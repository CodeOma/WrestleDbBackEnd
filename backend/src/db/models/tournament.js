const mongoose = require("mongoose");

const tournamentSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  location: {
    country: { type: String },
    city: { type: String },
  },
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
  },
});

tournamentSchema.virtual("matches", {
  ref: "Match",
  localField: "_id",
  foreignField: "tournament",
});

const Tournament = mongoose.model("Tournament", tournamentSchema);

module.exports = Tournament;
