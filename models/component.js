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
  elements: {
    type: [elementSchema],
    required: true,
  },
});
