const mongoose = require("mongoose");

const eventPageSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  sections: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  componentStates: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

module.exports = mongoose.model("EventPage", eventPageSchema);
