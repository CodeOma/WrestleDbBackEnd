const Match = require("../db/models/match");
// const Wrestler = require("../db/models/wrestler");
// const mongoose = require("mongoose");

// const {
//   deleteProfilesNoMatches,
//   findProfilesNoMatches,
// } = require("./mgmFunctions");
// const correctDups = async () => {
//   try {
//     const getDuplicates = await Wrestler.aggregate([
//       {
//         $group: {
//           _id: "$lastName",
//           name: {
//             $push: {
//               names: "$fullName",
//               ids: "$_id",
//             },
//           },
//           count: {
//             $sum: 1,
//           },
//         },
//       },
//       {
//         $match: {
//           _id: {
//             $ne: null,
//           },
//           count: {
//             $gt: 1,
//           },
//         },
//       },
//       {
//         $sort: {
//           count: -1,
//         },
//       },
//       {
//         $project: {
//           name: "$_id",
//           fullName: "$name",
//           _id: 0,
//         },
//       },
//     ]);
// const fixMatches = async () => {
//   try {
//     const matches = await Match.find({});
//     console.log(Match);

//     const fix = await matches.forEach(async match => {
//       try {
//         const fixed1 = await match.scores.map(wrestler => {
//           try {
//             if (wrestler.color === "red") {
//               if (match.redWrestler.fullName !== wrestler.fullName) {
//                 const fix = wrestler.totalScores.map(score => {
//                   return { ...score, name: match.redWrestler.fullName };
//                 });
//                 console.log(fix);
//                 return {
//                   fullName: match.redWrestler.fullName,
//                   color: "red",
//                   totalScores: fix,
//                   total: wrestler.total,
//                 };
//               } else {
//                 return wrestler;
//               }
//             }
//             if (wrestler.color === "blue") {
//               if (match.blueWrestler.fullName !== wrestler.fullName) {
//                 const fix = wrestler.totalScores.map(score => {
//                   return { ...score, name: match.blueWrestler.fullName };
//                 });
//                 return {
//                   fullName: match.blueWrestler.fullName,
//                   color: "blue",
//                   totalScores: fix,
//                   total: wrestler.total,
//                 };
//               } else {
//                 return wrestler;
//               }
//             }
//           } catch (e) {
//             console.log(e);
//           }
//         });
//         const update = await Match.findByIdAndUpdate(
//           { _id: match._id },
//           { scores: fixed1 }
//         );
//         console.log(update);
//       } catch (error) {
//         console.log(error);
//       }
//     });
//   } catch (e) {
//     console.log(e);
//   }
// };

// fixMatches();

// const checkDuplicates = await getDuplicates.filter(wrestler => {
//   const wrestDups = wrestler.fullName.filter((name, i, arr) => {
//     if (arr.length !== i + 1) {
//       if (
//         name.names.split(" ").join("").toLowerCase() ===
//         arr[i + 1].names.split(" ").join("").toLowerCase()
//       ) {
//         return true;
//       }
//       return false;
//     }
//   });
//   return wrestDups.length !== 0;
// });
//     const checking = () => {
//       Promise.all(
//         checkDuplicates.map(wres => {
//           wres.fullName.map(async (wrestler, i, arr) => {
//             if (arr.length === i + 1) {
//               const matches = await Match.updateMany(
//                 {
//                   $or: [{ "redWrestler.id": wrestler.ids }],
//                 },
//                 {
//                   "redWrestler.id": arr[0].ids,
//                   "redWrestler.fullName": arr[0].names,
//                 }
//               );
//               console.log(matches);

//               const matches2 = await Match.updateMany(
//                 {
//                   $or: [{ "blueWrestler.id": wrestler.ids }],
//                 },
//                 {
//                   "blueWrestler.id": arr[0].ids,
//                   "blueWrestler.fullName": arr[0].names,
//                 }
//               );

//               return [matches, matches2];
//             }
//           });
//         })
//       );
//     };

//     const getMatchesToDelete = await Match.aggregate([
//       {
//         $project: {
//           _id: 1,
//           url: "$url",
//           scores: {
//             $filter: {
//               input: "$scores.totalScores",
//               as: "sc",
//               cond: {
//                 $eq: ["$$sc.takedown", []],
//               },
//             },
//           },
//         },
//       },
//       {
//         $unwind: "$scores",
//       },
//       {
//         $project: {
//           _id: 1,
//         },
//       },
//     ]);
//     const matchIdList = getMatchesToDelete.map(match => match._id);
//     const deleteMatches = await Match.deleteMany({ _id: { $in: matchIdList } });
//     console.log(deleteMatches);
//     // checking();
//     // findProfilesNoMatches();
//     // deleteProfilesNoMatches();
//   } catch (e) {
//     console.log(e);
//   }
// };

// module.exports.correctDups = correctDups;
// // const mergeMatches = await Wrestler.updateMany({ lastName }, { id }).drop;
// // const mergeRed = await Wrestler.updateMany(
// //   {
// //     $or: [
// //       {
// //         "redWrestler.id": {
// //           $regex: "6042f38b8e4ff31a532f7510",
// //           $options: "i",
// //         },
// //       },
// //       {
// //         "blueWrestler.id": {
// //           $regex: "6042f38b8e4ff31a532f7510",
// //           $options: "i",
// //         },
// //       },
// //     ],
// //   },
// //   { id }
// // ).drop;
// // const mergeBlue = await Wrestler.updateMany(
// //   {
// //     $or: [
// //       {
// //         "blueWrestler.id": {
// //           $regex: "6042f38b8e4ff31a532f7510",
// //           $options: "i",
// //         },
// //       },
// //     ],
// //   },
// //   { "blueWrestler.id": id }
// // );

// //  const deleteDups = () =>{
// //      const wrestlersWithoutMatches = await Wrestler.deleteMany({"$expr": {}});
// //     }
// // }

// ////
// // [
// //     {
// //       '$project': {
// //         '_id': {
// //           '$toString': '$_id'
// //         },
// //         'fullName': 1,
// //         'lastName': 1,
// //         'team': 1
// //       }
// //     }, {
// //       '$lookup': {
// //         'from': 'matches',
// //         'localField': '_id',
// //         'foreignField': 'redWrestler.id',
// //         'as': 'red'
// //       }
// //     }, {
// //       '$lookup': {
// //         'from': 'matches',
// //         'localField': '_id',
// //         'foreignField': 'blueWrestler.id',
// //         'as': 'blue'
// //       }
// //     }, {
// //       '$project': {
// //         '_id': 1,
// //         'fullName': 1,
// //         'red': 1,
// //         'redsize': {
// //           '$size': '$red'
// //         },
// //         'bluesize': {
// //           '$size': '$blue'
// //         },
// //         'blue': 1
// //       }
// //     }, {
// //       '$match': {
// //         '$and': [
// //           {
// //             'redsize': {
// //               '$eq': 0
// //             }
// //           }, {
// //             'bluesize': {
// //               '$eq': 0
// //             }
// //           }
// //         ]
// //       }
// //     }
// //   ]

// const fixMatches = async () => {
//   try {
//     console.log("dasd");
//     const check = await Match.updateMany(
//       { owner: "60abd80102509f797c51ca09" },
//       { owner: "60a2a5803bb95bbc1c18b767" }
//     );
//     console.log(check);
//   } catch (e) {
//     console.log(e);
//   }
// };
// fixMatches();
