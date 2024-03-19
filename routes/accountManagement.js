const router = require('express').Router();
const {getAllOrganizers,deleteOrganizer} = require('../controllers/accountManagement');

router.get('/getOrganizers', getAllOrganizers);
router.post('/deleteOrganizer/:id', deleteOrganizer);

module.exports = router;