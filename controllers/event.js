const Event = require("../models/Event");

// Create a new event
const createEvent = async (req, res) => {
  try {
    let {
      title,
      description,
      startDate,
      endDate,
      location,
      organizer,
      attendees,
      price,
    } = req.body;
    organizer = req.user.id;
    await Event.create({
      title,
      description,
      startDate,
      endDate,
      location,
      organizer,
      attendees,
      price,
    });
    res.status(201).send("Event created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while creating the event");
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.log(error);
  }
};

// Get a single event by id
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.status(200).json(event);
  } catch (error) {
    console.log(error);
  }
};

// Delete an event if you are the organizer of that particular event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.body.id);
    if (!event) {
      return res.status(404).send("Event not found");
    }
    if (event.organizer == req.user.id) {
      await Event.deleteOne({ _id: req.body.id });
      res.status(200).send("Event deleted successfully");
    } else {
      res.status(401).send("You are not authorized to delete this event");
    }
  } catch (error) {
    console.log(error);
  }
};

// View all the events made by the specific organizer
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.status(200).json(events);
  } catch (error) {
    console.log(error);
  }
};

const changeEventDetails = async (req, res) => {
  try {
    const {title, description, startDate, endDate, location, price} = req.body;
    let event = await Event.findOne({title});
    //organizer check not necessary because the user can only change the details of the event they createdriv
    if (event) {
      event.title = title;
      event.description = description;
      event.startDate = startDate;
      event.endDate = endDate;
      event.location = location;
      event.price = price;
      await event.save();
      res.status(200).json({message: "Event details changed successfully"});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "An error occurred while changing the event details"});
  }
}

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  deleteEvent,
  getMyEvents,
  changeEventDetails,
};
