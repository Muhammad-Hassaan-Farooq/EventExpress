const router = require("express").Router();
const { markAttending, removeAttending } = require("../controllers/ticketing");

router.post("/markAttending", markAttending);
router.post("/markNotAttending", removeAttending);

module.exports = router;
