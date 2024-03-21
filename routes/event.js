
const router = require('express').Router();
const {createEvent,getEvents,getEvent,deleteEvent,getMyEvents,changeEventDetails,searchByDate,searchByLocation} = require('../controllers/event');
const { checkOrganizer } = require('../middleware/checkOrganizer');



router.get('/getEvents', getEvents);
router.get('/getEvent/:id', getEvent);
router.post('/getByDate',searchByDate);
router.post('/getByLocation',searchByLocation);


router.use(checkOrganizer)     // This is the middleware that checks for the role of the user is organizer

router.post('/createEvent', createEvent);
router.post('/deleteEvent', deleteEvent);
router.get('/myEvents', getMyEvents);
router.post('/changeEventDetails', changeEventDetails);


module.exports = router;

