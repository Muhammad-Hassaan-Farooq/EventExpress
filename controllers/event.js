const Event = require("../models/event");
const Users = require("../models/User");
const Attendees = require("../models/attendees");

// Create a new event
const createEvent = async (req, res) => {
  try {

    let {
      title,
      description,
      date,
      location,
      attendees,
      price,
    } = req.body;

    organizer = req.user.id;
    const newEvent = await Event.create({
      title,
      description,
      date: new Date(date),
      location,
      organizer,
      attendees,
      price,
      createdBy: req.user.name,
      updatedBy: req.user.name,
    });

    if (!createAttendeeList(newEvent._id)) {
      newEvent.delete();
      return res
      .status(500)
      .json({success:true, msg :"An error occurred while creating the event", data:[]});
    }

    res
      .status(201)
      .json({success:true, msg :"Event created successfully", data:[]});
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({success:false, msg :"An error occurred while creating the event", data:[]});
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ 
      isDeleted: false
    });
    res
      .status(200)
      .json({success:true, msg :"Events found", data:[events]});
  } catch (error) {
    res
      .status(500)
      .json({success:false, msg: "An error occurred while getting the events", data:[]});
  }
};

// Get a single event by id
const getEvent = async (req, res) => {
  try {
    id = req.params.id;
    const event = await Event.findById({
      id, isDeleted: false
    });
    res
      .status(200)
      .json({success:true, msg :"Event found", data:[event]});
  } catch (error) {
    res
      .status(500)
      .json({success:false, msg: "An error occurred while getting the event", data:[]});
  }
};

// Delete an event if you are the organizer of that particular event
const deleteEvent = async (req, res) => {
  try {
    id = req.body.id;
    const event = await Event.findById( {
      id, 
      isDeleted: false
    });
    if (!event) {
      return res
        .status(404)
        .json({success:true, msg: "Event not found", data:[]});
    }
    if (event.organizer == req.user.id) {
      event.is_deleted = true;
      event.deletedAt = new Date();
      event.deletedBy = req.user.name;
      await event.save();
      res
        .status(200)
        .json({success:true, msg: "Event deleted successfully", data:[]});
    } else {
      res
        .status(401)
        .json({success:true, msg: "You are not authorized to delete this event", data:[]});
    }
  } catch (error) {
    res
      .status(500)
      .json({success:false, msg: "An error occurred while deleting the event", data:[]});
  }
};

// View all the events made by the specific organizer
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ 
      organizer: req.user.id, 
      isDeleted: false
    });
    res
      .status(200)
      .json({success:true, msg: "Events found", data:[events]});
  } catch (error) {
    res
      .status(500)
      .json({success:false, msg: "An error occurred while getting the events", data:[]});
  }
};

const changeEventDetails = async (req, res) => {
  try {
    const { title, description, date, location, price } = req.body;
    let event = await Event.findOne({
       _id: req.body.id,
        isDeleted: false
      });
    if (!event) {
      return res
        .status(404)
        .json({success:true, msg: "Event not found", data:[]})
    }
    if (event.organizer != req.user.id) {
      return res
        .status(401)
        .json({success:true, msg: "You are not authorized to change the details of this event", data:[]});
    }
    
    if (title !== undefined) {
      event.title = title;
    }
    if (description !== undefined) {
      event.description = description;
    }
    if (date !== undefined) {
      event.date = date;
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
    res
      .status(200)
      .json({success:true, message: "Event details changed successfully", data:[] });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({success:false, message: "An error occurred while changing the event details", data:[] });
  }
};

const searchByDate = async (req, res) => {
  try {
    const date = req.body.date;
    const startDate = new Date(date);
    const formattedDate = startDate.toISOString().split("T")[0];

    const events = await Event.find({
      date: {
        isDeleted: false,
        $gte: formattedDate + "T00:00:00.000Z",
        $lt: formattedDate + "T23:59:59.999Z",
      },
    });

    if (events.length === 0) {
      return res
        .status(404)
        .json({success:true, msg: "No events found on the entered date", data:[]});
    }

    res
      .status(200)
      .json({success:true, msg: "Events found", data:[events]});
  } catch (error) {
    res
      .status(500)
      .json({success:false, msg: "An error occurred while getting the events", data:[]});
  }
};

const searchByLocation = async (req, res) => {
  try {
    const location = req.body.location;
    const events = await Event.find({ 
      location, 
      isDeleted: false
    });
    if (events.length === 0) {
      return res
        .status(404)
        .json({success:true, msg: "No events found in the entered location", data:[]});
    }
    res
      .status(200)
      .json({success:true, msg: "Events found", data:[events]});
  } catch (error) {
    res
      .status(500)
      .json({success:false, msg: "An error occurred while getting the events", data:[]});
  }
};

const searchByOrganizer = async (req, res) => {
  try {
    const id = req.body.org_id;
    const events = await Event.find({ 
      organizer: id, 
      isDeleted: false
    });
    if (events.length === 0) {
      return res
        .status(404)
        .json({success:true, msg: "No events found for the entered organizer", data:[]});
    }
    res
      .status(200)
      .json({success:true, msg: "Events found", data:[events]});
  } catch (error) {
    res
      .status(500)
      .json({success:false, msg: "An error occurred while getting the events", data:[]});
  }
};

const searchByPrice = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body;
    const events = await Event.find({
      isDeleted: false,
      price: { $gte: minPrice, $lte: maxPrice },
    });
    if (events.length === 0) {
      return res
        .status(404)
        .json({success:true, msg: "No events found in the entered price range", data:[]});
    }
    res
      .status(200)
      .json({success:true, msg: "Events found", data:[events]});
  } catch (error) {
    res.status(500).json({success:false, msg: "An error occurred while getting the events", data:[]});
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
