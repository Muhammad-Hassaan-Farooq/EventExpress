const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

const authRouter = require("./routes/auth");
const eventRouter = require("./routes/event");
const pagebuilderRouter = require("./routes/page-builder");
const profileRouter = require("./routes/profile");
const { verifyToken } = require("./middleware/verifyToken");

app.use(express.json());
app.use("/auth", authRouter);
app.use(verifyToken); // This is the middleware that checks for the token
app.use("/event", eventRouter);
app.use("/profile", profileRouter);
app.use("/page-builder", pagebuilderRouter);

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/EventExpress");
    console.log("Connected to the database");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
};
connectDB();
