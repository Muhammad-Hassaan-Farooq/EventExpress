const Schema = require("mongoose").Schema;

const elementSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

(module.exports = Schema.model("Element", elementSchema)), elementSchema;
