const Attendees = require("../models/attendees");

const markAttending = async (req, res) => {
  try {
    const { eventID } = req.body;
    const userID = req.user.id;

    const attendee = await Attendees.findOne({ eventID });

    if (attendee) {
      if (attendee.userID.includes(userID)) {
        return res.status(400).json({ error: "User already attending event" });
      }
      attendee.userID.push(userID);
      await attendee.save();
      return res.status(200).json({ message: "User marked as attending" });
    } else {
      await Attendees.create({ userID: [userID], eventID });
      return res.status(200).json({ message: "User marked as attending" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeAttending = async (req, res) => {
  try {
    const { eventID } = req.body;
    const userID = req.user.id;

    const attendee = await Attendees.findOne({ eventID });
  } catch (error) {}
};

module.exports = {
  markAttending,
};
