const router = require('express').Router();
const {getAllOrganizers,deleteAccount,changeRole} = require('../controllers/accountManagement');


router.get('/getOrganizers', getAllOrganizers);

router.post('/deleteAccount', deleteAccount);
router.post('/changeRole', changeRole);

module.exports = router;