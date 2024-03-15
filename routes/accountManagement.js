const router = require('express').Router();
const {getAllOrganizers} = require('../controllers/accountManagement');

router.get('/getOrganizers', getAllOrganizers);

module.exports = router;