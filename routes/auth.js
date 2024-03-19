const router = require('express').Router();
const {login,signUp,forgetPassword} = require('../controllers/auth');

router.post('/login', login);
router.post('/signup', signUp);
router.post('/forgetPassword', forgetPassword);


module.exports = router;
