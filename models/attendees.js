const mongoose = require("mongoose");
const schema = mongoose.Schema;

const attendeeSchema = schema({
  userID: [
    {
      user: {
        type: schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
      count: {
        type: Number,
        default: 1,
      },
    },
  ],
  eventID: {
    type: schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
});

module.exports = mongoose.model("Attendees", attendeeSchema);
