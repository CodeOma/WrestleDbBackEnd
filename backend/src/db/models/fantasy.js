const mongoose = require("mongoose");

const fantasySelectionSchema = mongoose.Schema({
  userName: { type: String, required: true },
  selections: {
    57: { type: String, required: true },
    61: { type: String, required: true },
    65: { type: String, required: true },
    70: { type: String, required: true },
    74: { type: String, required: true },
    79: { type: String, required: true },
    86: { type: String, required: true },
    92: { type: String, required: true },
    97: { type: String, required: true },
    125: { type: String, required: true },
  },
  tournamentid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  score: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const FantasySelection = mongoose.model(
  "FantasySelection",
  fantasySelectionSchema
);

module.exports = FantasySelection;
