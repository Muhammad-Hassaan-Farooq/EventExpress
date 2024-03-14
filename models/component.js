const schema = require("mongoose").Schema;
const elementSchema = require("./element");

const componentSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  layout: {
    type: Number,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  elements: [
    {
      type: schema.Types.ObjectId,
      ref: "Element",
    },
  ],
});

module.exports = require("mongoose").model("Component", componentSchema);
