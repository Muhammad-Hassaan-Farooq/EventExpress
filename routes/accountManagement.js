const router = require('express').Router();

const {getAllOrganizers,getAllUsers,deleteAccount,changeRole,getOrganizerByName, getUserByName} = require('../controllers/accountManagement');


router.get('/getOrganizers', getAllOrganizers);
router.post('/getOrganizerByName', getOrganizerByName);
router.get('/getUsers', getAllUsers);
router.post('/getUserByName', getUserByName);
router.post('/deleteAccount', deleteAccount);
router.post('/changeRole', changeRole);

module.exports = router;