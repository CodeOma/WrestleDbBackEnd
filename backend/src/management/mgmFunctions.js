// const Match = require("../db/models/match");
// const Wrestler = require("../db/models/wrestler");
// const mongoose = require("mongoose");

// const deleteProfilesNoMatches = async () => {
//   const deleteMatches = await Wrestler.aggregate([
//     {
//       $project: {
//         _id: {
//           $toString: "$_id",
//         },
//         fullName: 1,
//         lastName: 1,
//         team: 1,
//       },
//     },
//     {
//       $lookup: {
//         from: "matches",
//         localField: "_id",
//         foreignField: "redWrestler.id",
//         as: "red",
//       },
//     },
//     {
//       $lookup: {
//         from: "matches",
//         localField: "_id",
//         foreignField: "blueWrestler.id",
//         as: "blue",
//       },
//     },
//     {
//       $project: {
//         _id: 1,
//         fullName: 1,
//         red: 1,
//         redsize: {
//           $size: "$red",
//         },
//         bluesize: {
//           $size: "$blue",
//         },
//         blue: 1,
//       },
//     },
//     {
//       $match: {
//         $and: [
//           {
//             redsize: {
//               $eq: 0,
//             },
//           },
//           {
//             bluesize: {
//               $eq: 0,
//             },
//           },
//         ],
//       },
//     },
//     {
//       $project: {
//         id: 1,
//         fullName: 1,
//       },
//     },
//   ]);
//   //   const idList = await deleteMatches.map(wres => {
//   //     return wres._id;
//   //   });
//   //   const actuallyDelete = await Wrestler.deleteMany({
//   //     _id: { $in: idList },
//   //   });

//   console.log(actuallyDelete);
// };
// const findProfilesNoMatches = async () => {
//   const deleteMatches = await Match.aggregate([
//     {
//       $project: {
//         _id: {
//           $toString: "$_id",
//         },
//         fullName: 1,
//         lastName: 1,
//         team: 1,
//       },
//     },
//     {
//       $lookup: {
//         from: "matches",
//         localField: "_id",
//         foreignField: "redWrestler.id",
//         as: "red",
//       },
//     },
//     {
//       $lookup: {
//         from: "matches",
//         localField: "_id",
//         foreignField: "blueWrestler.id",
//         as: "blue",
//       },
//     },
//     {
//       $project: {
//         _id: 1,
//         fullName: 1,
//         red: 1,
//         redsize: {
//           $size: "$red",
//         },
//         bluesize: {
//           $size: "$blue",
//         },
//         blue: 1,
//       },
//     },
//     {
//       $match: {
//         $and: [
//           {
//             redsize: {
//               $eq: 0,
//             },
//           },
//           {
//             bluesize: {
//               $eq: 0,
//             },
//           },
//         ],
//       },
//     },
//     {
//       $project: {
//         id: 1,
//         fullName: 1,
//       },
//     },
//   ]);
//   const idList = await deleteMatches.map(wres => {
//     return wres._id;
//   });
//   const find = await Match.find({
//     _id: { $in: idList },
//   });

//   console.log(find);
// };

// module.exports.deleteProfilesNoMatches = deleteProfilesNoMatches;
// module.exports.findProfilesNoMatches = findProfilesNoMatches;
