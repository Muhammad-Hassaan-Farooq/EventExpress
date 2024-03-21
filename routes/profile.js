const router = require('express').Router();
const {changePassword,deleteAccount, deleteMyAccount} = require('../controllers/profile');
const { checkAdmin } = require('../middleware/checkAdmin');

router.post('/changePassword', changePassword);
router.post('/deleteMyAccount', deleteMyAccount);
 
router.use(checkAdmin); // This is the middleware that checks for the role of the user is organizer

module.exports = router;