const Event = require('../models/Event');

// Create a new event
const createEvent = async (req, res) => {
    try {
        const { title, description, startDate, endDate, location, organizer, attendees, price } = req.body;
        await Event.create({ title, description, startDate, endDate, location, organizer, attendees, price });
        res.status(201).send('Event created successfully');
    } catch (error) {
        console.log(error);
    }
}

// Get all events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createEvent,
    getEvents,
}