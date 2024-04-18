const Event = require("../models/event");
const Users = require("../models/User");
const Attendees = require("../models/attendees");

// Create a new event
const createEvent = async (req, res) => {
  try {

    let {
      title,
      description,
      startDate,
      endDate,
      location,
      attendees,
      price,
    } = req.body;

    organizer = req.user.id;
    const newEvent = await Event.create({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      organizer,
      attendees,
      price,
      createdBy: req.user.name,
      updatedBy: req.user.name,
    });

    if (!createAttendeeList(newEvent._id)) {
      newEvent.delete();
      return res.status(500).send("An error occurred while creating the event");
    }

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
    res.status(500).send("An error occurred while getting the events");
  }
};

// Get a single event by id
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.status(200).json(event);
  } catch (error) {
    res.status(500).send("An error occurred while getting the event");
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
      event.is_deleted = true;
      event.deletedAt = new Date();
      event.deletedBy = req.user.name;
      await event.save();
      res.status(200).send("Event deleted successfully");
    } else {
      res.status(401).send("You are not authorized to delete this event");
    }
  } catch (error) {
    res.status(500).send("An error occurred while deleting the event");
  }
};

// View all the events made by the specific organizer
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).send("An error occurred while getting the events");
  }
};

const changeEventDetails = async (req, res) => {
  try {
    const { title, description, startDate, endDate,  location, price } = req.body;
    let event = await Event.findOne({ _id: req.body.id });
    if (!event) {
      return res.status(404).send("Event not found");
    }
    if (event.organizer != req.user.id) {
      return res.status(401).send("You are not authorized to change this event details");
    }
    
    if (title !== undefined) {
      event.title = title;
    }
    if (description !== undefined) {
      event.description = description;
    }
    if (startDate !== undefined) {
      event.date = startDate;
    }
    if (endDate !== undefined) {
      event.date = endDate;
    }
    if (location !== undefined) {
      event.location = location;
    }
    if (price !== undefined) {
      event.price = price;
    }
    event.updatedBy = req.user.name;
    event.updatedAt = new Date();

    await event.save();
    res.status(200).json({ message: "Event details changed successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while changing the event details" });
  }
};

//error gives events of one day prior to the entered date
const searchByDate = async (req, res) => {
  try {
    const date = req.body.date;
    const startDate = new Date(date);
    const formattedDate = startDate.toISOString().split("T")[0];

    const events = await Event.find({
      startDate: {
        $gte: formattedDate + "T00:00:00.000Z",
        $lt: formattedDate + "T23:59:59.999Z",
      },
    });

    if (events.length === 0) {
      return res.status(404).send("No events found on the entered date");
    }

    res.status(200).json(events);
  } catch (error) {
    res.status(500).send("An error occurred while getting the events");
  }
};

const searchByLocation = async (req, res) => {
  try {
    const location = req.body.location;
    const events = await Event.find({ location });
    if (events.length === 0) {
      return res.status(404).send("No events found in the entered location");
    }
    res.status(200).json(events);
  } catch (error) {
    res.status(500).send("An error occurred while getting the events");
  }
};

const searchByOrganizer = async (req, res) => {
  try {
    const id = req.body.org_id;
    const events = await Event.find({ organizer: id });
    if (events.length === 0) {
      return res.status(404).send("No events found by the entered organizer");
    }
    res.status(200).json(events);
  } catch (error) {
    res.status(500).send("An error occurred while getting the events");
  }
};

const searchByPrice = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body;
    const events = await Event.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });
    if (events.length === 0) {
      return res
        .status(404)
        .send("No events found within the specified price range");
    }
    res.status(200).json(events);
  } catch (error) {
    res.status(500).send("An error occurred while getting the events");
  }
};

async function createAttendeeList(eventID) {
  try {
    const attendee = new Attendees({ eventID });
    await attendee.save();
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  deleteEvent,
  getMyEvents,
  changeEventDetails,
  searchByDate,
  searchByLocation,
  searchByOrganizer,

  searchByPrice

};
