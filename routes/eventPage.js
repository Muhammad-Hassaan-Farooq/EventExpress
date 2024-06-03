const router = require("express").Router();

const { getEventPage, setEventPage } = require("../controllers/eventPage");

router.get("/getEventPage/:eventid", getEventPage);
router.post("/setEventPage/:eventid", setEventPage);

module.exports = router;
