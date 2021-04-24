const mongoose = require("mongoose");
const Wrestler = require("./wrestler");
const Match = require("./match");

// db.games.aggregate([
//   {
//     $match : {
//       date : {
//         $gt : ISODate("1999-08-01T00:00:00Z"),
//         $lt : ISODate("2000-08-01T00:00:00Z")
//       }
//     }
//   },
//   {
//     $unwind : '$teams'
//   },
//   {
//     $match : {
//       'teams.won' : 1
//     }
//   },
//   {
//     $group : {
//       _id : '$teams.name',
//       wins : { $sum : 1 }
//     }
//   },
//   {
//     $sort : { wins : -1 }
//   },
//   {
//     $limit : 5
//   }
// ]);

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

// const Stats = mongoose.model("Stats", statsSchema);

// module.exports = Stats;
