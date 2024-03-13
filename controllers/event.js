const mongoose = require("mongoose");
const event = require("../models/event");

const createEvent = async (req, res) => {
  try {
    const { title, start_date, end_date, location, description } = req.body;
    const newEvent = new event({
      title,
      start_date,
      end_date,
      location,
      description,
    });
    await newEvent.save();
    res.send("Event created");
  } catch (error) {
    res.send(error);
  }
};

module.exports = { createEvent };
