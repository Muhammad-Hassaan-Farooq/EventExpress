const router = require('express').Router();
const {createEvent,getEvents} = require('../controllers/event');

router.get('/getEvents', getEvents);

router.use((req, res, next) => {
    if (req.body.role != 'organizer'){
        return res.json({ msg: "UNAUTHORIZED ACCESS" })
    }
    else {
        next()
    }
})

router.post('/createEvent', createEvent);


module.exports = router;