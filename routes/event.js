const router = require("express").Router();
const { createEvent } = require("../controllers/event");

router.get("/", (req, res) => {
  res.send("Event index");
});

router.post("/create", createEvent);

module.exports = router;
