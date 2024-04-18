const nodemailer = require("nodemailer");
const Users = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email.match(/^\S+@\S+\.\S+$/))
      return res
        .status(200)
        .json({ success: true, msg: "Invalid Email format", data: [] }); // Check the email format
    let user = await Users.findOne({ email });

    if (user) {
      return res
        .status(200)
        .json({ success: true, msg: "User already exists", data: [] });
    }
    if (
      password.length < 8 || // Check the length of the password
      !password.match(/[0-9]/) || // Check the presence of a number
      !password.match(/[a-z]/) || // Check the presence of a lowercase letter
      !password.match(/[A-Z]/)
    )
      return res
        .status(200)
        .json({
          success: true,
          msg: "Your password must be at least 8 characters long, contain at least one number, and have a mixture of uppercase and lowercase letters.",
          data: [],
        }); // Check the presence of an uppercase letter

    await Users.create({
      ...req.body,
      password: await bcrypt.hash(password, 5),
    });
    return res
      .status(201)
      .json({ success: true, msg: "User created successfully", data: [] });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        msg: "An error occurred while creating the user",
        data: [],
      });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user)
      return res
        .status(200)
        .json({ success: true, msg: "User not found", data: [] });

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck)
      return res
        .status(200)
        .json({ success: true, msg: "Invalid password", data: [] });

    const token = jwt.sign(
      {
        name: user.firstName + " " + user.lastName,
        id: user._id,
        role: user.role,
        createdAt: new Date(),
      },
      "MY_SECRET",
      { expiresIn: "1d" }
    );
    res.json({
      msg: "LOGGED IN",
      token,
      role: user.role,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        msg: "An error occurred while logging in",
        data: [],
      });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email, isDeleted: false });

    if (!user) {
      return res
        .status(200)
        .json({ success: true, msg: "User not found", data: [] });
    }

    const newPassword = Math.random().toString(36).slice(-8);
    user.password = await bcrypt.hash(newPassword, 5);
    await user.save();

    await sendEmail(email, newPassword);
    res
      .status(200)
      .json({
        success: true,
        msg: "Password reset successfully, an email has been sent.",
        data: [],
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        msg: "An error occurred while resetting the password",
        data: [],
      });
  }
};

const sendEmail = async (email, newPassword) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "shaheeralam.alam@gmail.com",
      pass: "gonb urqe lgez qhyn",
    },
  });

  const mailOptions = {
    from: "shaheeralam.alam@gmail.com",
    to: email,
    subject: "Password Reset For Event Express",
    text: `Your new password is: ${newPassword}. Please use this password to login and then reset it.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  login,
  signUp,
  forgetPassword,
};
