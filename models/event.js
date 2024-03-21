const mongoose = require("mongoose");

// Define the schema for the Event model
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  location: {
    type: String,
    //required: true
  },
  organizer: {
    type: String, // Reference to the User model
    //required: true
  },
  attendees: {
    type: [String], // Assuming attendees are represented by their usernames or IDs
    default: [],
  },
  price: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Event model using the schema
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
