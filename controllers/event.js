const Event = require("../models/event");
const Users = require("../models/User");
const Attendees = require("../models/attendees");
const { get } = require("mongoose");

// Create a new event
const createEvent = async (req, res) => {
  try {
    let { title, description, date, location, price, attendeesLimit } =
      req.body;

    organizer = req.user.id;
    const newEvent = await Event.create({
      title,
      description,
      location,
      organizer,
      price,
      startDate: new Date(date),
      attendeesLimit,
      createdBy: req.user.name,
      updatedBy: req.user.name,
    });
    res
      .status(201)
      .json({
        success: true,
        message: "Event created successfully",
        data: newEvent,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all current events that are not full for user
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      isDeleted: false,
      startDate: { $gte: Date.now() },
      isFull: false,
    });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all  events
const getOldEvents = async (req, res) => {
  try {
    const events = await Event.find({ isDeleted: false });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get a current single event by id by organizer
const getEvent = async (req, res) => {
  try {
    currDate = Date.now();
    console.log(currDate);
    const event = await Event.find({
      organizer: req.user.id,
      isDeleted: false,
      startDate: { $gte: currDate },
    });
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete an event if you are the organizer of that particular event
const deleteEvent = async (req, res) => {
  try {
    id = req.body.id;
    const event = await Event.findById(id, { isDeleted: false });
    if (!event) {
      return res
        .status(404)
        .json({ success: true, message: "Event not found" });
    }
    if (event.organizer == req.user.id) {
      event.isDeleted = true;
      event.deletedAt = new Date();
      event.deletedBy = req.user.name;
      await event.save();
      res.status(200).json({ success: true, message: "Event deleted" });
    } else {
      res.status(401).json({
        success: true,
        message: "You are not authorized to delete this event",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get events by user's event array
const getEventsByUser = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    const eventIds = user.events;
    const events = await Event.find({ _id: { $in: eventIds } });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// View all the events made by the specific organizer
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      organizer: req.user.id,
      isDeleted: false,
    });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllMyEvents = async (req, res) => {
  try {
    const events = await Users.findById(req.user.id).populate(
      "attendingEvents"
    );
    if (!events) {
      return res
        .status(200)
        .json({ success: false, message: "No events found" });
    } else {
      res
        .status(200)
        .json({
          success: true,
          data: events,
          message: "Events fetched successfully",
        });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const changeEventDetails = async (req, res) => {
  try {
    const { title, description, date, location, price, id, attendeesLimit } =
      req.body;
    let event = await Event.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!event) {
      return res
        .status(404)
        .json({ success: true, message: "Event not found" });
    }
    if (event.organizer != req.user.id) {
      return res.status(401).json({
        success: true,
        message: "You are not authorized to change this event",
      });
    }

    if (title !== "" && title !== undefined) {
      event.title = title;
    }
    if (description !== "" && description !== undefined) {
      event.description = description;
    }
    if (date !== "" && date !== undefined) {
      event.date = date;
    }
    if (location !== "" && location !== undefined) {
      event.location = location;
    }
    if (price !== "" && price !== undefined) {
      event.price = price;
    }
    if (attendeesLimit !== "" && attendeesLimit !== undefined) {
      event.attendeesLimit = attendeesLimit;
    }
    event.updatedBy = req.user.name;
    event.updatedAt = Date.now();

    await event.save();
    res.status(200).json({ success: true, message: "Event details changed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const searchById = async (req, res) => {
  try {
    const id = req.body.id;
    const event = await Event.findById(id, { isDeleted: false });
    if (!event) {
      return res
        .status(404)
        .json({ success: true, message: "No events found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const searchByDate = async (req, res) => {
  try {
    const date = req.body.date;

    const startDate = new Date(date);
    console.log(startDate);
    const formattedDate = startDate.toISOString().split("T")[0];
    console.log(formattedDate);
    const events = await Event.find({
      isDeleted: false,
      isFull: false,
      startDate: {
        $gte: formattedDate + "T00:00:00.000Z",
        $lt: formattedDate + "T23:59:59.999Z",
      },
    });

    if (events.length === 0) {
      return res
        .status(404)
        .json({ success: true, message: "No events found" });
    }

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const searchByLocation = async (req, res) => {
  try {
    const location = req.body.location;
    const events = await Event.find({
      location: { $regex: location, $options: "i" },
      isDeleted: false,
      startDate: { $gte: Date.now() },
      isFull: false,
    });
    if (events.length === 0) {
      return res
        .status(404)
        .json({ success: true, message: "No events found" });
    }
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const searchByOrganizer = async (req, res) => {
  try {
    const id = req.body.org_id;
    const events = await Event.find({
      organizer: id,
      isDeleted: false,
      startDate: { $gte: Date.now() },
      isFull: false,
    });
    if (events.length === 0) {
      return res
        .status(404)
        .json({ success: true, message: "No events found" });
    }
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const searchByName = async (req, res) => {
  try {
    const name = req.body.name;
    const events = await Event.find({
      title: { $regex: name, $options: "i" },
      isDeleted: false,
      startDate: { $gte: Date.now() },
      isFull: false,
    });
    if (events.length === 0) {
      return res
        .status(404)
        .json({ success: true, message: "No events found" });
    }
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getOrganizerByName = async (req, res) => {
  const fullName = req.body.name.trim();
  const names = fullName.split(" ");
  const firstName = names[0];
  const lastName = names.slice(1).join(" ");

  try {
    const searchCriteria = {
      role: "organizer",
      isDeleted: false,

      $or: [
        { firstName: { $regex: new RegExp("^" + firstName + "$", "i") } },
        {
          $and: [
            { firstName: { $regex: new RegExp("^" + firstName + "$", "i") } },
            { lastName: { $regex: new RegExp("^" + lastName + "$", "i") } },
          ],
        },
      ],
    };

    const organizers = await Users.find(searchCriteria).select("-password");

    if (organizers.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No organizer found with this name" });
    }
    return res.status(200).json({
      success: true,
      data: organizers,
      message: "Organizer fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const searchByPrice = async (req, res) => {
  try {
    const { price } = req.body;
    const events = await Event.find({
      isDeleted: false,
      price: { $lte: price },
      startDate: { $gte: Date.now() },
      isFull: false,
    });
    if (events.length === 0) {
      return res
        .status(404)
        .json({ success: true, message: "No events found" });
    }
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const Attending = async (req, res) => {
  try {
    const { id } = req.body;
    const event = await Event.findById(id);
    const user = await Users.findById(req.user.id);
    if (!event) {
      return res
        .status(404)
        .json({ success: true, message: "Event not found" });
    }
    if (event.isFull) {
      return res.status(401).json({ success: true, message: "Event is full" });
    }
    if (event.attendees.includes(req.user.id)) {
      return res
        .status(401)
        .json({ success: true, message: "You are already attending" });
    } else {
      event.attendees.push(req.user.id);
      event.attendeesCount += 1;
      await event.save();
      if (event.attendeesCount >= event.attendeesLimit) {
        event.isFull = true;
      }
      user.events.push(event.id);
      await user.save();
      res.status(200).json({ success: true, message: "You are now attending" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

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
  searchByName,
  searchById,
  searchByPrice,
  getOrganizerByName,
  Attending,
  getOldEvents,
  getEventsByUser,
};
