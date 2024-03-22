const router = require("express").Router();
const { changePassword, deleteMyAccount } = require("../controllers/profile");

router.post("/changePassword", changePassword);
router.post("/deleteMyAccount", deleteMyAccount);

module.exports = router;
