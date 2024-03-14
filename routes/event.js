const router = require('express').Router();
const {createEvent,getEvents,getEvent,deleteEvent} = require('../controllers/event');
const { checkOrganizer } = require('../middleware/checkOrganizer');



router.get('/getEvents', getEvents);
router.get('/getEvent/:id', getEvent);


router.use(checkOrganizer)     // This is the middleware that checks for the role of the user is organizer

router.post('/createEvent', createEvent);
router.post('/deleteEvent', deleteEvent);


module.exports = router;