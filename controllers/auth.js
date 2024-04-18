const nodemailer = require("nodemailer");
const Users = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await Users.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    await Users.create({
      ...req.body,
      password: await bcrypt.hash(password, 5),
    });
    return res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while signing up" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email, isDeleted: false });
    if (!user) return res.status(400).json({ message: "User not found" });

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck)
      return res.status(400).json({ message: "Invalid password" });

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
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while logging in" });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email, isDeleted: false });

    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }

    const newPassword = Math.random().toString(36).slice(-8);
    user.password = await bcrypt.hash(newPassword, 5);
    await user.save();

    await sendEmail(email, newPassword);
    res.status(200).json({ message: "New password sent to your email" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while forgetting password" });
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
