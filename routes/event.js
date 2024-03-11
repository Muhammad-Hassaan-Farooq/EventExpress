const router = require('express').Router();
const {createEvent,getEvents} = require('../controllers/event');

router.get('/getEvents', getEvents);

router.use((req, res, next) => {
    const userRole = req.user;
    console.log(userRole);
    if (userRole === 'organizer'){
       next();
    }
    else {
        return res.status(400).json({ message: 'Unauthorized Access' });
    }
})

router.post('/createEvent', createEvent);


module.exports = router;