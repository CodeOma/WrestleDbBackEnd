const mongoose = require("mongoose");

const matchSchema = mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
  style: {
    type: String,
    required: true,
  },
  weightClass: {
    type: Number,
    required: true,
  },
  round: {
    type: String,
    required: true,
  },
  result: {},
  redWrestler: {
    id: {
      type: String,
      required: true,
    },

    team: { type: String, required: true },
  },
  blueWrestler: {
    id: {
      type: String,
      required: true,
    },

    team: { type: String, required: true },
  },

  url: {},

  scores: [],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const UserMatch = mongoose.model("UserMatch", matchSchema);

module.exports = UserMatch;
