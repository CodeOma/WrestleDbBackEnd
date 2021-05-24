const Match = require("../db/models/match");

////UPDATING DOCS//////
// const fixingDocs = async ()=>{
// try {
//   const match = await Match.findOne({round: 'Final 1-2', weightClass: 74},);
//   const data = await match._doc;
//   var bulk = await  Object.entries(data.scores).map(async([key, round]) => {
//     const totalScores = Object.entries(round.rounds).map(([key, score], i) => {
//       const scor = Object.values(score.points).map(({ points, second }) => {
//         return { points, time: second, name: round.fullName };
//       });
//       return { [`round${i + 1}scores`]: scor };
//     });
//     const { 0: round1scores, 1: round2scores } = totalScores;

//     return {
//       fullName: round.fullName,
//       total: round.total,
//       ...round1scores,
//       ...round2scores,
//     };
//   })

//   const update = { scores : bulk}
//   // bulk.find({round: 'Final 1-2', weightClass: 74}).update(update);
//   // bulk.execute(function (error) {
//     //  callback();
//   // });
//   // console.log(update)
// //   Object.entries(data).map(key=>
// //     console.log(key))
// // console.log(data);
// //     console.log(data.scores);
// //   console.log(data.scores);
// //   const newArr = await Object.entries(data.scores).map(async([key, round]) => {
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
// //   });
//   // const update = await {scores:newArr}
//   // console.log(update);
//   // { $set:update}
//   const criteria = {round: 'Final 1-2', weightClass: 74}
//    const updateMatch = await Match.findByIdAndUpdate(criteria,({$set:{update}}));
//   console.log(updateMatch);

//   // console.log(newArr);
// } catch (e) {
// console.log(e);}

// }
// fixingDocs()
/////////
const filtered = scores => {
  try {
    console.log(scores);
    // const y =
    //   matchData.scores[0] && matchData.scores[1]
    //     ? [
    //         ...matchData.scores[0].totalScores,
    //         ...matchData.scores[1].totalScores,
    //       ]
    //     : matchData.scores[0]
    //     ? [...matchData.scores[0].totalScores]
    //     : [...matchData.scores[1].totalScores];
    // const x = y.filter(t => t.id === id);
    // const [selectedScore] = x;
    // return selectedScore;
  } catch (e) {
    console.log(e);
  }
};

const newFormat = {
  tournament: "",
  style: "",
  weightClass: "",
  round: "",
  result: {
    victoryType: "",
    winner: "",
    loser: "",
    winnerPoints: "",
    loserPoints: "",
    redTotalScore: "",
    blueTotalScore: "",
  },
  redWrestlerId: {
    id: "",

    team: "",
  },
  blueWrestler: {
    id: "",

    team: "",
  },
  url: "",
  scores: [],
  // scoreRed.totalScores !== [] && scoreBlue.totalScores !== []
  //   ? [scoreRed, scoreBlue]
  //   : scoreRed.totalScores !== []
  //   ? [scoreRed]
  //   : [scoreBlue],
};

const fixMatches = async () => {
  try {
    const matches = await Match.find({});

    let scoresfixed = [];
    const fix = await matches.forEach(async match => {
      try {
        const mo = match.scores.map(wrestler => {
          if (wrestler.totalScores) {
            return wrestler.totalScores;
          }
        });
        const m = mo;
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

        // const update = await Match.findByIdAndUpdate(
        //   { _id: match._id },
        //   {
        //     scores: scoresFixed,
        //     redWrestler: {
        //       id: match.redWrestler.id,

        //       team: match.redWrestler.team,
        //     },
        //     blueWrestler: {
        //       id: match.blueWrestler.id,

        //       team: match.blueWrestler.team,
        //     },
        //   }
        // );
        // console.log(update);
      } catch (error) {
        console.log(error);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

// module.exports.fixMatches = fixMatches;
const fixMatches = async () => {
  try {
    const matches = await Match.find({});

    let scoresfixed = [];
    const fix = await matches.forEach(async match => {
      try {
        const winnerPoints =
          match.result.victoryType === "VPO"
            ? 3
            : "VPO1"
            ? 3
            : "VSU"
            ? 4
            : "VSU1"
            ? 4
            : "VFA"
            ? 5
            : "VCA"
            ? 5
            : "VIN"
            ? 5
            : "DSQ"
            ? 5
            : 0;
        const loserPoints =
          match.result.victoryType === "VPO"
            ? 0
            : "VPO1"
            ? 1
            : "VSU"
            ? 0
            : "VSU1"
            ? 1
            : "VFA"
            ? 0
            : "VCA"
            ? 0
            : "VIN"
            ? 0
            : "DSQ"
            ? 0
            : 0;
        const totalRed = match.scores
          .filter(takedown => takedown.wrestlerId === match.redWrestler.id)
          .reduce((a, score) => parseInt(score.points) + a, 0);
        const totalBlue = match.scores
          .filter(takedown => takedown.wrestlerId === match.blueWrestler.id)
          .reduce((a, score) => parseInt(score.points) + a, 0);
        const redTotalScore = match
          .filter()
          .reduce((a, match) => parseInt(match.points) + a);
        const blueTotalScore = match
          .filter()
          .reduce((a, match) => parseInt(match.points) + a);
        const update = await Match.findByIdAndUpdate(
          { _id: match._id },
          {
            result: {
              victoryType: "",
              winner: match.result.winner,
              loser: match.result.loser,
              winnerPoints,
              loserPoints,
              redTotalScore,
              blueTotalScore,
            },
          }
        );
        console.log(update);
      } catch (error) {
        console.log(error);
      }
    });
  } catch (e) {
    console.log(e);
  }
};
