const mongoose = require("mongoose");

const { Schema } = mongoose;

const AreaSchema = Schema(
  {
    name: { type: String, required: true },
    description: {type: String}
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Area", AreaSchema);
