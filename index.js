const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const eventRouter = require("./routes/event");
const pagebuilderRouter = require("./routes/page-builder");

app.use(express.json());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/event", eventRouter);
app.use("/page-builder", pagebuilderRouter);

const connectDB = async () => {
  try {
    mongoose.connect("mongodb://localhost:27017/event-express");
    console.log("Connected to the database");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
};
connectDB();
