const mongoose = require("mongoose");
const scheme = mongoose.Schema;

const pageSchema = new scheme({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});
