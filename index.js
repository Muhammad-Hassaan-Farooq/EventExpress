const express = require("express");
const app = express();
const port = 3000;
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const eventRouter = require("./routes/event");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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

app.use(async (req, res, next) => {
  try {
      const token = req.headers.authorization;
      const user = jwt.verify(token.split(" ")[1], "MY_SECRET")
      req.user = user;
      next()
  } catch (e) {
      return res.json({ msg: "TOKEN NOT FOUND / INVALID" })
  }
})

app.use("/event", eventRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
