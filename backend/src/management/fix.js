const Match = require("../db/models/match");
const Tournament = require("../db/models/tournament");
const js = require("./sa.json");

const fixMatches = async () => {
  try {
    const td = await js.map(async match => {
      let scoresFixed = [];
      const mo = match.scores.map(wrestler => {
        if (wrestler.totalScores) {
          console.log(wrestler.totalScores);
          return wrestler.totalScores;
        }
      });
      const m = mo;
      console.log(mo);

      if (m[0] && m[1]) {
        scoresFixed = [...m[0], ...m[1]].sort((a, b) => {
          return a.time - b.time;
        });
      }

      if (m[0] && !m[1]) {
        scoresFixed = m[0].sort((a, b) => {
          return a.time - b.time;
        });
      }

      if (m[1] && !m[0]) {
        scoresFixed = m[1].sort((a, b) => {
          return a.time - b.time;
        });
      }

      const getWinnerPoint = victoryType => {
        if (victoryType === "VPO") {
          return 3;
        }

        if (victoryType === "VPO1") {
          return 3;
        }

        if (victoryType === "VSU") {
          return 4;
        }
        if (victoryType === "VSU1") {
          return 4;
        }

        if (victoryType === "VFA") {
          return 5;
        }
        if (victoryType === "VCA") {
          return 5;
        }
        if (victoryType === "VIN") {
          return 5;
        }
        if (victoryType === "DSQ") {
          return 5;
        } else {
          return 0;
        }
      };
      const getLoserPoint = victoryType => {
        if (victoryType === "VPO") {
          return 0;
        }

        if (victoryType === "VPO1") {
          return 1;
        }

        if (victoryType === "VSU") {
          return 0;
        }
        if (victoryType === "VSU1") {
          return 1;
        }

        if (victoryType === "VFA") {
          return 0;
        }
        if (victoryType === "VCA") {
          return 0;
        }
        if (victoryType === "VIN") {
          return 0;
        }
        if (victoryType === "DSQ") {
          return 0;
        } else {
          return 0;
        }
      };
      const loserPoints = getLoserPoint(match.result.victoryType);
      const winnerPoints = getWinnerPoint(match.result.victoryType);
      // console.log(loserPoints, winnerPoints);
      const [red] = match.scores.filter(obj => {
        // console.log(obj["_doc"].fullName);
        // Object.entries(obj).map(([k, v]) => {
        //   console.log(`${k} key ' + ${v}`);
        return obj.color === "red";
        // });
      });
      // console.log(red["_doc"].total);

      const [blue] = match.scores.filter(obj => {
        return obj.color === "blue";
      });

      // console.log(scoresFixed);
      const scoresFixed2 = scoresFixed.map(score => {
        const wrestlerId =
          match.redWrestler.fullName === score.fullName
            ? match.redWrestler.id
            : match.blueWrestler.id;
        return { ...score, wrestlerId };
      });
      console.log(scoresFixed2);

      const tourny = await Tournament.findById({ _id: match.tournament });
      const update = await Match.create({
        _id: match._id,
        tournament: {
          tournamentId: match.tournament,
          tournamentName: tourny.name,
          tournamentType: tourny.type,
        },
        style: match.style,
        weightClass: match.weightClass,
        round: match.round,
        redWrestler: {
          id: match.redWrestler.id,
          fullName: match.redWrestler.fullName,

          team: match.redWrestler.team,
        },
        blueWrestler: {
          id: match.blueWrestler.id,
          fullName: match.blueWrestler.fullName,

          team: match.blueWrestler.team,
        },

        url: match.url,

        owner: "60abd80102509f797c51ca09",
        private: false,
        organization: "United World Wrestling",
        scores: scoresFixed2,
        result: {
          victoryType: match.result.victoryType,
          winnerPoints,
          loserPoints,
          winner: match.result.winner,
          loser: match.result.loser,
          redTotalScore: red?.total || 0,
          blueTotalScore: blue?.total || 0,
        },
      });
    });
  } catch (e) {
    console.log(e);
  }
};
// module.exports.fixMatches = fixMatches;

// ////UPDATING DOCS//////
// // const fixingDocs = async ()=>{
// // try {
// //   const match = await Match.findOne({round: 'Final 1-2', weightClass: 74},);
// //   const data = await match._doc;
// //   var bulk = await  Object.entries(data.scores).map(async([key, round]) => {
// //     const totalScores = Object.entries(round.rounds).map(([key, score], i) => {
// //       const scor = Object.values(score.points).map(({ points, second }) => {
// //         return { points, time: second, name: round.fullName };
// //       });
// //       return { [`round${i + 1}scores`]: scor };
// //     });
// //     const { 0: round1scores, 1: round2scores } = totalScores;

// //     return {
// //       fullName: round.fullName,
// //       total: round.total,
// //       ...round1scores,
// //       ...round2scores,
// //     };
// //   })

// //   const update = { scores : bulk}
// //   // bulk.find({round: 'Final 1-2', weightClass: 74}).update(update);
// //   // bulk.execute(function (error) {
// //     //  callback();
// //   // });
// //   // console.log(update)
// // //   Object.entries(data).map(key=>
// // //     console.log(key))
// // // console.log(data);
// // //     console.log(data.scores);
// // //   console.log(data.scores);
// // //   const newArr = await Object.entries(data.scores).map(async([key, round]) => {
// // //     const totalScores = Object.entries(round.rounds).map(([key, score], i) => {
// // //       const scor = Object.values(score.points).map(({ points, second }) => {
// // //         return { points, time: second, name: round.fullName };
// // //       });
// // //       return { [`round${i + 1}scores`]: scor };
// // //     });
// // //     const { 0: round1scores, 1: round2scores } = totalScores;

// // //     return {
// // //       fullName: round.fullName,
// // //       total: round.total,
// // //       ...round1scores,
// // //       ...round2scores,
// // //     };
// // //   });
// //   // const update = await {scores:newArr}
// //   // console.log(update);
// //   // { $set:update}
// //   const criteria = {round: 'Final 1-2', weightClass: 74}
// //    const updateMatch = await Match.findByIdAndUpdate(criteria,({$set:{update}}));
// //   console.log(updateMatch);

// //   // console.log(newArr);
// // } catch (e) {
// // console.log(e);}

// // }
// // fixingDocs()
// /////////
// const filtered = scores => {
//   try {
//     console.log(scores);
//     // const y =
//     //   matchData.scores[0] && matchData.scores[1]
//     //     ? [
//     //         ...matchData.scores[0].totalScores,
//     //         ...matchData.scores[1].totalScores,
//     //       ]
//     //     : matchData.scores[0]
//     //     ? [...matchData.scores[0].totalScores]
//     //     : [...matchData.scores[1].totalScores];
//     // const x = y.filter(t => t.id === id);
//     // const [selectedScore] = x;
//     // return selectedScore;
//   } catch (e) {
//     console.log(e);
//   }
// };

// const newFormat = {
//   tournament: "",
//   style: "",
//   weightClass: "",
//   round: "",
//   result: {
//     victoryType: "",
//     winner: "",
//     loser: "",
//     winnerPoints: "",
//     loserPoints: "",
//     redTotalScore: "",
//     blueTotalScore: "",
//   },
//   redWrestlerId: {
//     id: "",

//     team: "",
//   },
//   blueWrestler: {
//     id: "",

//     team: "",
//   },
//   url: "",
//   scores: [],
//   // scoreRed.totalScores !== [] && scoreBlue.totalScores !== []
//   //   ? [scoreRed, scoreBlue]
//   //   : scoreRed.totalScores !== []
//   //   ? [scoreRed]
//   //   : [scoreBlue],
// };

// const fixMatches = async () => {
//   try {
//     const matches = await Match.find({});

// let scoresFixed = [];
// const fix = await matches.forEach(async match => {
//   try {
//     const mo = match.scores.map(wrestler => {
//       if (wrestler.totalScores) {
//         console.log(wrestler.totalScores);
//         return wrestler.totalScores;
//       }
//     });
//     const m = mo;
//     console.log(mo);

//     if (m[0] && m[1]) {
//       scoresFixed = [...m[0], ...m[1]].sort((a, b) => {
//         return a.time - b.time;
//       });
//     }

//     if (m[0] && !m[1]) {
//       scoresFixed = m[0].sort((a, b) => {
//         return a.time - b.time;
//       });
//     }

//     if (m[1] && !m[0]) {
//       scoresFixed = m[1].sort((a, b) => {
//         return a.time - b.time;
//       });
//     }

//     const getWinnerPoint = victoryType => {
//       if (victoryType === "VPO") {
//         return 3;
//       }

//       if (victoryType === "VPO1") {
//         return 3;
//       }

//       if (victoryType === "VSU") {
//         return 4;
//       }
//       if (victoryType === "VSU1") {
//         return 4;
//       }

//       if (victoryType === "VFA") {
//         return 5;
//       }
//       if (victoryType === "VCA") {
//         return 5;
//       }
//       if (victoryType === "VIN") {
//         return 5;
//       }
//       if (victoryType === "DSQ") {
//         return 5;
//       } else {
//         return 0;
//       }
//     };
//     const getLoserPoint = victoryType => {
//       if (victoryType === "VPO") {
//         return 0;
//       }

//       if (victoryType === "VPO1") {
//         return 1;
//       }

//       if (victoryType === "VSU") {
//         return 0;
//       }
//       if (victoryType === "VSU1") {
//         return 1;
//       }

//       if (victoryType === "VFA") {
//         return 0;
//       }
//       if (victoryType === "VCA") {
//         return 0;
//       }
//       if (victoryType === "VIN") {
//         return 0;
//       }
//       if (victoryType === "DSQ") {
//         return 0;
//       } else {
//         return 0;
//       }
//     };
//     const loserPoints = getLoserPoint(match.result.victoryType);
//     const winnerPoints = getWinnerPoint(match.result.victoryType);
//     console.log(loserPoints, winnerPoints);
//     const [red] = match.scores.filter(obj => {
//       // console.log(obj["_doc"].fullName);
//       // Object.entries(obj).map(([k, v]) => {
//       //   console.log(`${k} key ' + ${v}`);
//       return obj["_doc"].color === "red";
//       // });
//     });
//     // console.log(red["_doc"].total);

//     const [blue] = match.scores.filter(obj => {
//       return obj["_doc"].color === "blue";
//     });

//     console.log(scoresFixed); // const update = await Match.findByIdAndUpdate(
//     //   { _id: match._id },
//     //   {
//     //     scores: scoresFixed,
//     //     result: {
//     //       victoryType: match.result.victoryType,
//     //       winnerPoints,
//     //       loserPoints,
//     //       winner: match.result.winner,
//     //       loser: match.result.loser,
//     //       redTotalScore: red?.["_doc"]?.total || 0,
//     //       blueTotalScore: blue?.["_doc"]?.total || 0,
//     //     },
//     //   }
//     // );

//         // console.log(update);
//       } catch (error) {
//         console.log(error);
//       }
//     });
//   } catch (e) {
//     console.log(e);
//   }
// };

// module.exports.fixMatches = fixMatches;
// // const fixMatches = async () => {
// //   try {
// //     const matches = await Match.find({});

// //     let scoresfixed = [];
// //     const fix = await matches.forEach(async match => {
// //       try {
// //         const winnerPoints =
// //           match.result.victoryType === "VPO"
// //             ? 3
// //             : "VPO1"
// //             ? 3
// //             : "VSU"
// //             ? 4
// //             : "VSU1"
// //             ? 4
// //             : "VFA"
// //             ? 5
// //             : "VCA"
// //             ? 5
// //             : "VIN"
// //             ? 5
// //             : "DSQ"
// //             ? 5
// //             : 0;
// //         const loserPoints =
// //           match.result.victoryType === "VPO"
// //             ? 0
// //             : "VPO1"
// //             ? 1
// //             : "VSU"
// //             ? 0
// //             : "VSU1"
// //             ? 1
// //             : "VFA"
// //             ? 0
// //             : "VCA"
// //             ? 0
// //             : "VIN"
// //             ? 0
// //             : "DSQ"
// //             ? 0
// //             : 0;
// //         const totalRed = match.scores
// //           .filter(takedown => takedown.wrestlerId === match.redWrestler.id)
// //           .reduce((a, score) => parseInt(score.points) + a, 0);
// //         const totalBlue = match.scores
// //           .filter(takedown => takedown.wrestlerId === match.blueWrestler.id)
// //           .reduce((a, score) => parseInt(score.points) + a, 0);
// //         const redTotalScore = match
// //           .filter()
// //           .reduce((a, match) => parseInt(match.points) + a);
// //         const blueTotalScore = match
// //           .filter()
// //           .reduce((a, match) => parseInt(match.points) + a);
// //         const update = await Match.findByIdAndUpdate(
// //           { _id: match._id },
// //           {
// //             result: {
// //               victoryType: "",
// //               winner: match.result.winner,
// //               loser: match.result.loser,
// //               winnerPoints,
// //               loserPoints,
// //               redTotalScore,
// //               blueTotalScore,
// //             },
// //           }
// //         );
// //         console.log(update);
// //       } catch (error) {
// //         console.log(error);
// //       }
// //     });
// //   } catch (e) {
// //     console.log(e);
// //   }
// // };
