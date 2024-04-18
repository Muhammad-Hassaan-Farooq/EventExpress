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
      return res.status(500).json({ error: "An error occurred" });
    }
    for (const user of attendeesList) {
      if (user.user == requserID) {
        return res.status(400).json({ message: "User already attending" });
      }
    }

    await Attendees.findOneAndUpdate(
      { eventID },
      { $push: { userID } },
      { runValidators: true }
    );

    return res.status(200).json({ message: "User marked as attending" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
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
    res.status(200).json({ message: "User removed from attending" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bookTicket = async (req, res) => {
  try {
    const { eventID } = req.body;
    const userID = req.user.id;

    const ticket = await Ticket.create({ userID, eventID });

    if (ticket) {
      return res.status(200).json({ message: "Ticket booked successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelTicket = async (req, res) => {
  try {
    const { id } = req.body;

    await Ticket.findOneAndUpdate({ _id: id }, { status: "cancelled" });
    res.status(200).json({ message: "Ticket cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  markAttending,
  removeAttending,
  cancelTicket,
  bookTicket,
};
