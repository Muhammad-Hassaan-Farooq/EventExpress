const router = require('express').Router();
const {getAllOrganizers,getAllUsers,deleteAccount,changeRole} = require('../controllers/accountManagement');


router.get('/getOrganizers', getAllOrganizers);
router.get('/getUsers', getAllUsers);
router.post('/deleteAccount', deleteAccount);
router.post('/changeRole', changeRole);

module.exports = router;