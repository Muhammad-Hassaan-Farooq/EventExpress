const nodemailer = require("nodemailer");
const Users = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await Users.findOne({ email });

    if (user) {
      return res
        .status(409)
        .json({ success: true, message: "User already exists" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: true,
        message: "Password must be at least 8 characters long",
      });
    }

    await Users.create({
      ...req.body,
      password: await bcrypt.hash(password, 5),
    });
    return res.status(201).json({ success: true, message: "User created" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email, isDeleted: false });
    if (!user)
      return res.status(404).json({ success: true, message: "User not found" });

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck)
      return res
        .status(400)
        .json({ success: true, message: "Invalid password" });

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
      return res.status(404).json({ success: true, message: "User not found" });
    }

    const newPassword = Math.random().toString(36).slice(-8);
    user.password = await bcrypt.hash(newPassword, 5);
    await user.save();

    await sendEmail(email, newPassword);
    res
      .status(200)
      .json({ success: true, message: "Email sent for password reset" });
  } catch (error) {
    console.log(error);
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
