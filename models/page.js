const mongoose = require("mongoose");
const schema = mongoose.Schema;

const pageSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  components: [
    {
      type: schema.Types.ObjectID,
      ref: "Component",
    },
  ],
});

module.exports = mongoose.model("Page", pageSchema);
