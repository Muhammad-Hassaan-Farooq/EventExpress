const router = require('express').Router();

const {getAllOrganizers,getAllUsers,deleteAccount,changeRole,getOrganizerByName, getUserByName,countOrganizers, countUsers} = require('../controllers/accountManagement');


router.get('/getOrganizers', getAllOrganizers);
router.post('/getOrganizerByName', getOrganizerByName);
router.get('/getUsers', getAllUsers);
router.post('/getUserByName', getUserByName);
router.post('/deleteAccount', deleteAccount);
router.post('/changeRole', changeRole);
router.get('/countOrganizers', countOrganizers);
router.get('/countUsers', countUsers);

module.exports = router;