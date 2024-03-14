const express = require("express");
const app = express();
const port = 3000;
const authRouter = require("./routes/auth");
const eventRouter = require("./routes/event");
const mongoose = require("mongoose");
const { verifyToken } = require("./middleware/verifyToken");

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

app.use("/auth", authRouter);

app.use(verifyToken)        // This is the middleware that checks for the token

app.use("/event", eventRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
