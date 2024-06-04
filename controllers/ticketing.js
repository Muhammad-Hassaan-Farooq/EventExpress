const mongoose = require("mongoose");
const Attendees = require("../models/attendees");

const markAttending = async (req, res) => {
  try {
    const { eventID } = req.body;
    const requserID = req.user.id;
    const userID = {
      user: requserID,
    };

    let attendee = await Attendees.findOne({ eventID });
    let attendeesList = attendee.userID;

    if (!attendee) {
      return res
        .status(500)
        .json({ success: true, message: "Event not found" });
    }
    for (const user of attendeesList) {
      if (user.user == requserID) {
        return res
          .status(400)
          .json({ success: true, message: "Already attending" });
      }
    }

    await Attendees.findOneAndUpdate(
      { eventID },
      { $push: { userID } },
      { runValidators: true }
    );

    return res.status(200).json({ success: true, message: "Marked Attending" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const removeAttending = async (req, res) => {
  try {
    const { eventID } = req.body;
    const userID = req.user.id;

    let attendee = await Attendees.findOneAndUpdate(
      { eventID },
      { $pull: { userID: { user: userID } } }
    );
    res.status(200).json({ success: true, message: "Removed from attending" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const bookTicket = async (req, res) => {
  try {
    const { eventID } = req.body;
    const userID = req.user.id;

    const ticket = await Ticket.create({ userID, eventID });

    if (ticket) {
      return res.status(200).json({ success: true, message: "Ticket booked" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const cancelTicket = async (req, res) => {
  try {
    const { id } = req.body;

    await Ticket.findOneAndUpdate({ _id: id }, { status: "cancelled" });
    res.status(200).json({ success: true, message: "Ticket cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  markAttending,
  removeAttending,
  cancelTicket,
  bookTicket,
};
