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
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  location: {
    type: String,
    required: true,
  },
  organizer: {
    type: String, // Reference to the User model
  },
  image: {
    type: String,
    default: null,
  },
  attendees: {
    type: [String], // Assuming attendees are represented by their usernames or IDs
    default: [],
  },
  attendeesLimit: {
    type: Number,
    default: 100,
  },
  attendeesCount: {
    type: Number,
    default: 0,
  },
  isFull: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: String,
    default: null,
    required: true,
  },
  deletedBy: {
    type: String,
    default: null,
  },
});

// Create the Event model using the schema
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
