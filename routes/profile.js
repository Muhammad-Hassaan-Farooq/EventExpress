const router = require('express').Router();
const {changePassword, changeRole, deleteAccount, deleteMyAccount} = require('../controllers/profile');
const { checkAdmin } = require('../middleware/checkAdmin');

router.post('/changePassword', changePassword);
router.post('/deleteMyAccount', deleteMyAccount);
 
router.use(checkAdmin); // This is the middleware that checks for the role of the user is organizer
router.post('/changeRole', changeRole);
router.post('/deleteAccount', deleteAccount);

module.exports = router;