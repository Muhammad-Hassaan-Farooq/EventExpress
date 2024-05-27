const router = require("express").Router();
const { changePassword, deleteMyAccount , viewProfile} = require("../controllers/profile");

router.post("/viewProfile", viewProfile);
router.post("/changePassword", changePassword);
router.post("/deleteMyAccount", deleteMyAccount);

module.exports = router;
