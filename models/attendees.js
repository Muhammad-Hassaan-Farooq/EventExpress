const mongoose = require("mongoose");
const schema = mongoose.Schema;

const attendeeSchema = schema({
  userID: [
    {
      user: {
        type: schema.Types.ObjectId,
        ref: "Users",
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
  },
});

module.exports = mongoose.model("Attendees", attendeeSchema);
