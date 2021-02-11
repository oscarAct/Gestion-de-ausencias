const mongoose = require("mongoose");

const { Schema } = mongoose;

const AgentSchema = Schema(
  {
    userId: { type: String, unique: true, required: true },
    id_number: { type: String },
    name: { type: String },
    lastName: { type: String },
    active: { type: Boolean, required: true, default: true },
    deleted: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Agent", AgentSchema);
