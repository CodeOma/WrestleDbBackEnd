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
  month: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

tournamentSchema.virtual("matches", {
  ref: "Match",
  localField: "_id",
  foreignField: "tournament",
});

const UserTournament = mongoose.model("UserTournament", tournamentSchema);

module.exports = UserTournament;
