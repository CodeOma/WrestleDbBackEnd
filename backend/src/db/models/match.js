const mongoose = require("mongoose");

const matchSchema = mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
  style: {
    type: String,
  },
  weightClass: {
    type: Number,
  },
  round: {
    type: String,
  },
  result: {},
  redWrestler: {
    id: {
      type: String,
    },
    fullName: {
      type: String,
    },

    team: { type: String },
  },
  blueWrestler: {
    id: {
      type: String,
    },
    fullName: {
      type: String,
    },
    team: { type: String },
  },

  url: {},

  scores: {},
});

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
