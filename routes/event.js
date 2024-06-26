
const router = require('express').Router();

const {createEvent,getEvents,getEvent,deleteEvent,getMyEvents,changeEventDetails,searchByDate,searchByLocation, searchByPrice,searchByOrganizer, searchById, searchByName, getOrganizerByName, Attending, getOldEvents, getEventsByUser} = require('../controllers/event');

const { checkOrganizer } = require('../middleware/checkOrganizer');



router.get('/getEvents', getEvents);
router.post('/attendingEvent', Attending);
router.get('/getEvent', getEvent);
router.post('/getByDate',searchByDate);
router.post('/getByLocation',searchByLocation);
router.post('/getByOrganizer',searchByOrganizer)
router.post('/getByPrice', searchByPrice);
router.post('/getByName', searchByName)
router.post('/getById', searchById);
router.post('/getOrganizerByName', getOrganizerByName);
router.post('/getOldEvents', getOldEvents);
router.get('/myCurrentEvents', getEventsByUser);



router.use(checkOrganizer)     // This is the middleware that checks for the role of the user is organizer

router.post('/createEvent', createEvent);
router.post('/deleteEvent', deleteEvent);
router.get('/myEvents', getMyEvents);
router.post('/changeEventDetails', changeEventDetails);


module.exports = router;

