const mongoose = require("mongoose");
const { timestampSchema, Timestamp } = require("./takedown");
const matchSchema = mongoose.Schema({
  tournament: {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    tournamentName: { type: String, required: true },
    tournamentType: { type: String, required: true },
  },
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
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    fullName: { type: String, required: true },

    team: { type: String, required: true },
  },
  blueWrestler: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    fullName: { type: String, required: true },

    team: { type: String, required: true },
  },

  url: {
    type: String,
    // required: true,
  },

  scores: [],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  private: {
    type: Boolean,
  },
  organization: {
    type: String,
    required: true,
  },
});

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
