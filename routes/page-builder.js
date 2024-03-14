const router = require("express").Router();

const {
  createElement,
  createComponent,
  createPage,
} = require("../controllers/page-builder");

router.get("/", (req, res) => {
  res.send("Page Builder index");
});

router.post("/create-element", createElement);

router.post("/create-component", createComponent);

router.post("/create-page", createPage);

module.exports = router;
