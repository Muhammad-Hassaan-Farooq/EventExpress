const nodemailer = require("nodemailer");
const Users = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName)
      return res
        .status(200)
        .json({ success: false, message: "Please enter all fields", data: [] }); // Check the email format

    if (!email.match(/^\S+@\S+\.\S+$/))
      return res
        .status(200)
        .json({ success: false, message: "Invalid Email format", data: [] }); // Check the email format
    let user = await Users.findOne({ email });

    if (user) {
      return res
        .status(200)
        .json({ success: false, message: "User already exists" });
    }
    if (password.length < 8) {
      return res.status(200).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    await Users.create({
      ...req.body,
      password: await bcrypt.hash(password, 5),
    });
    return res.status(200).json({ success: true, message: "User created" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email, isDeleted: false });
    if (!user)
      return res
        .status(200)
        .json({ success: false, message: "User not found" });

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck)
      return res
        .status(200)
        .json({ success: false, message: "Invalid password" });

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
      success: true,
      message: "LOGGED IN",
      token,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email, isDeleted: false });

    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }

    const newPassword = Math.random().toString(36).slice(-8);
    user.password = await bcrypt.hash(newPassword, 5);
    await user.save();

    await sendEmail(email, newPassword);
    res
      .status(200)
      .json({ success: true, message: "Email sent for password reset" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error: Email not sent" });
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
