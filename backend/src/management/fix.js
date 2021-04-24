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
