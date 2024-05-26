const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 3000;

const authRouter = require("./routes/auth");
const eventRouter = require("./routes/event");
const pagebuilderRouter = require("./routes/page-builder");
const ticketingRouter = require("./routes/ticketing");
const accountManagementRouter = require("./routes/accountManagement");

const profileRouter = require("./routes/profile");

const { verifyToken } = require("./middleware/verifyToken");
const { checkAdmin } = require("./middleware/checkAdmin");

app.use(cors());
app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);
app.use(verifyToken); // This is the middleware that checks for the token

app.use("/event", eventRouter);
app.use("/profile", profileRouter);
app.use("/ticketing", ticketingRouter);
app.use("/page-builder", pagebuilderRouter);
app.use(checkAdmin); // This is the middleware that checks for the admin role
app.use("/accountManagement", accountManagementRouter);

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
