const Schema = require("mongoose").Schema;

const ticketSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  eventID: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  bought_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status: {
    type: String,
    enum: ["paid", "pending", "cancelled"],
    default: "pending",
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);