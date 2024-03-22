const router = require("express").Router();
const { markAttending } = require("../controllers/ticketing");

router.post("/markAttending", markAttending);

module.exports = router;
