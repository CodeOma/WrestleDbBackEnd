const mongoose = require("mongoose");

const tournamentSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  location: {
    country: { type: String, required: true },
    city: { type: String, required: true },
  },
  year: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  private: {
    type: Boolean,
  },
});

const Tournament = mongoose.model("Tournament", tournamentSchema);

module.exports = Tournament;
