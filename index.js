const express = require("express");
const app = express();
const port = 3000;
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const mongoose = require("mongoose");
app.use(express.json());


(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/EventExpress")
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
}
)();

app.use("/", indexRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
