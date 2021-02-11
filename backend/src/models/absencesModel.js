const mongoose = require("mongoose");

const { Schema } = mongoose;

const AbsenceSchema = Schema(
  {
    agent: { type: Schema.ObjectId, ref: "Agent", required: true },
    reason: { type: Schema.ObjectId, ref: "Reason", required: true },
    description: { type: String },
    from: { type: String },
    until: { type: String },
    proof: { type: String },
    deleted: { type: Boolean, default: false },
    user: { type: Schema.ObjectId, ref: "User", required: true },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Absence", AbsenceSchema);
