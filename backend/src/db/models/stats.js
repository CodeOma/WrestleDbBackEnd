const mongoose = require("mongoose");
const Wrestler = require("./wrestler");
const Match = require("./match");

const allStatsSchema = mongoose.Schema({
  array: [],
});
const wrestlerStatsSchema = mongoose.Schema({});

// const statsSchema = mongoose.Schema({
//   schemaVersion: {
//     type: Number,
//     required: true,
//   },
//   wrestlerId: {
//     type: String,
//     required: true,
//   },
//   offensiveScore: [
//     {
//       takedown: {
//         score: { type: Number },
//         technique: { type: String },
//         setup: { type: String },
//         setup: { type: String },
//       },
//     },
//   ],
//   defensiveScore: [
//     {
//       takedown: {
//         score: { type: Number },
//         technique: { type: String },
//         setup: { type: String },
//       },
//     },
//   ],
//   offensiveOppScore: [
//     {
//       takedown: {
//         score: { type: Number },
//         technique: { type: String },
//         setup: { type: String },
//       },
//     },
//   ],
//   defensiveOppScore: [
//     {
//       takedown: {
//         score: { type: Number },
//         technique: { type: String },
//         setup: { type: String },
//       },
//     },
//   ],
//   avgScoresPerMatch: {
//     type: Number,
//   },

//   winRate: {
//     type: Number,
//   },
// });

const AllStats = mongoose.model("AllStats", allStatsSchema);
const WrestlerStats = mongoose.model("WrestlerStats", wrestlerStatsSchema);

module.exports = { AllStats, WrestlerStats };
