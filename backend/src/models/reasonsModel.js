const mongoose = require("mongoose");

const { Schema } = mongoose;

const ReasonSchema = Schema(
  {
    name: { type: String },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Reason", ReasonSchema);
