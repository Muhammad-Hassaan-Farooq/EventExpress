const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Page Builder index");
});

module.exports = router;
