import puppeteer from "puppeteer";
import fs from "fs";
import mongoose from "mongoose";
import Tournament from "./models/tournament.js";
import Match from "./models/match.js";
import Team from "./models/team.js";
import Wrestler from "./models/wrestler.js";
import uniqid from "uniqid";

const idArr = [];
const uuidArr = [];
mongoose.connect("mongodb://127.0.0.1:27017/wrestling-stats", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    const browser = await puppeteer.launch({
      headless: true, //change to true in prod!
    });
    const links = [""];

    const page = await browser.newPage();
    await page.goto(`${li}/${i}`);
    console.log(i);
    var content = await page.content();
    const innerText = await page.evaluate(() => {
      return JSON.parse(document.querySelector("pre").textContent);
    });
    // links.map(lnk => {
    //   let x = 0;
    //   for (let i = 0; i < 1000; i++) {
    //     if (x < 15) {
    // const page = await browser.newPage();
    // await page.goto(
    //   `${li}/${i}`
    // );
    // console.log(i);
    // var content = await page.content();
    // const innerText = await page.evaluate(() => {
    //   return JSON.parse(document.querySelector("pre").textContent);
    // });
    // try {
    //   const {
    //     match: {
    //       id,
    //       fighter1FullName,
    //       fighter2FullName,
    //       fighter1FamilyName,
    //       fighter2FamilyName,
    //       team1AlternateName,
    //       team1Name,
    //       team2Name,
    //       fighter1Id,
    //       fighter2Id,
    //       team2AlternateName,
    //       roundFriendlyName,
    //       technicalPoints,
    //       technicalPointsTagStatus,
    //       weightCategoryMaxWeight,
    //       audienceShortName,
    //       sportName,
    //       victoryType,
    //       endTime,
    //       fighter1RankingPoint,
    //       fighter2RankingPoint,
    //       round,
    //       round1Id,
    //       round2Id,
    //     },
    //   } = await innerText;
    //   if (
    //     sportName === "Women's wrestling" ||
    //     sportName === "Greco-Roman"
    //   ) {
    //     continue;
    //   }
    //   const { eventName = "Freestyle" } =
    //     innerText?.match?.uploaderFight || "";
    //   const videoUrl =
    //     innerText.match?.uploaderFight?.current_video.videoUrl || "";
    //   const data = innerText.match;
    //   ///////////////////////Extracting Scores///////////////////////
    //   //////////////////////////////////////////////////////////////////////////
    //   const newArr = Object.values(data.technicalPoints).map(round => {
    //     const totalScores = Object.entries(round.rounds).map(
    //       ([key, score], i) => {
    //         const scor = Object.values(score.points).map(
    //           ({ points, second }) => {
    //             return {
    //               id: uniqid.process(),
    //               points,
    //               time: second,
    //               name: round.fullName,
    //               round: `round${i + 1}`,
    //             };
    //           }
    //         );
    //         return { ...scor };
    //       }
    //     );
    //     const totalm = Object.values(totalScores).map(i => i);
    //     const [round1scores = [], round2scores = []] = totalm;
    //     const r1 = Object.values(round1scores).map(i => i);
    //     const r2 = Object.values(round2scores).map(i => i);
    //     return {
    //       fullName: round.fullName,
    //       color: round.fullName === fighter1FullName ? "red" : "blue",
    //       totalScores: [...r1, ...r2],
    //       total: round.total,
    //     };
    //   });
    ///////////Wrestler ADD//////////////
    // const winnerPoints =
    //   fighter1RankingPoint > fighter2RankingPoint
    //     ? fighter1RankingPoint
    //     : fighter2RankingPoint;
    // const loserPoints =
    //   fighter1RankingPoint > fighter2RankingPoint
    //     ? fighter1RankingPoint
    //     : fighter2RankingPoint;
    // const result1 =
    //   roundFriendlyName === "Final 1-2" && winner === fighter1FullName
    //     ? 1
    //     : roundFriendlyName === "Final 1-2"
    //     ? 2
    //     : roundFriendlyName === "Final 3-5" && winner === fighter1FullName
    //     ? 3
    //     : roundFriendlyName === "Final 3-5"
    //     ? 5
    //     : "";
    // const result2 =
    //   roundFriendlyName === "Final 1-2" && winner === fighter2FullName
    //     ? 1
    //     : roundFriendlyName === "Final 1-2"
    //     ? 2
    //     : roundFriendlyName === "Final 3-5" && winner === fighter2FullName
    //     ? 3
    //     : roundFriendlyName === "Final 3-5"
    //     ? 5
    //     : "";
    //ADDDING WRESTLERS////////////
    // const addingWrestlers = async () => {
    //   const check1 = await Wrestler.find({
    //     lastName: fighter1FamilyName,
    //   });
    //   if (check1) {
    //     const oldWres = check1.filter(
    //       wres =>
    //         wres.fullName.split(" ").join("").toLowerCase() ===
    //         fighter1FullName.split(" ").join("").toLowerCase()
    //     );
    //     if (oldWres) {
    //       return oldWres[0];
    //     }
    //   }
    // };
    // const addingWrestlers2 = async () => {
    //   const check1 = await Wrestler.find({
    //     lastName: fighter2FamilyName,
    //   });
    //   if (check1) {
    //     const oldWres = check1.filter(
    //       wres =>
    //         wres.fullName.split(" ").join("").toLowerCase() ===
    //         fighter2FullName.split(" ").join("").toLowerCase()
    //     );
    //     if (oldWres) {
    //       return oldWres[0];
    //     }
    //   }
    // };
    // const old1 = await addingWrestlers();
    // const old2 = await addingWrestlers2();
    // const wrestler1 = old1
    //   ? old1
    //   : await Wrestler.findOneAndUpdate(
    //       {
    //         fullName: fighter1FullName,
    //         lastName: fighter1FamilyName,
    //         team: team1Name,
    //       },
    //       {},
    //       { upsert: true, new: true, setDefaultsOnInsert: true },
    //       function (error, result) {
    //         if (error) console.log(error);
    //       }
    //     );
    // const wrestler2 = old2
    //   ? old2
    //   : await Wrestler.findOneAndUpdate(
    //       {
    //         fullName: fighter2FullName,
    //         lastName: fighter2FamilyName,
    //         team: team2Name,
    //       },
    //       {},
    //       { upsert: true, new: true, setDefaultsOnInsert: true },
    //       function (error, result) {}
    //     );
    // const winner =
    //   fighter1RankingPoint > fighter2RankingPoint
    //     ? wrestler1.fullName
    //     : wrestler2.fullName;
    // const loser =
    //   fighter1RankingPoint < fighter2RankingPoint
    //     ? wrestler1.fullName
    //     : wrestler2.fullName;
    //ADDDING Country////////////
    // const team1 = await Team.findOneAndUpdate(
    //   {
    //     teamName: team1Name,
    //   },
    //   {},
    //   { upsert: true, new: true, setDefaultsOnInsert: true },
    //   function (error, result) {
    //     if (error) console.log(error);
    //   }
    // );
    // const team2 = await Team.findOneAndUpdate(
    //   {
    //     teamName: team2Name,
    //   },
    //   {},
    //   { upsert: true, new: true, setDefaultsOnInsert: true },
    //   function (error, result) {
    //     if (error) console.log(error);
    //   }
    // );
    // const match = await new Match({
    //   tournament: "604798865bb2579ef0ac0420",
    //   // tournamentName: "2017 Senior World Championships",
    //   style: sportName,
    //   weightClass: weightCategoryMaxWeight,
    //   round: roundFriendlyName,
    //   redWrestler: {
    //     id: wrestler1._id,
    //     fullName: wrestler1.fullName,
    //     team: wrestler1.team,
    //   },
    //   blueWrestler: {
    //     id: wrestler2._id,
    //     fullName: wrestler2.fullName,
    //     team: wrestler2.team,
    //   },
    //   result: {
    //     victoryType,
    //     winnerPoints,
    //     loserPoints,
    //     winner,
    //     loser,
    //   },
    //   url: videoUrl,
    //   scores: newArr,
    // });
    // await match.save();
    // } catch (e) {
    //   console.log(e);
    // }
    //     } else {
    //       break;
    //     }
    //   }
    // });

    await browser.close();
  } catch (e) {
    console.log(e);
  }
}

run();

////OTHER////
////////////////////////////////
// fs.writeFile(`${id}.json`, JSON.stringify(saveObj), err => {
//   if (err) throw err;
//   console.log("Data written to file");
// });

//       /////////////////TOURNAMENT ADD////////////////////////
//       //////////////////////////////////////////////////////////////////////////

// const tournament = await Tournament.findOneAndUpdate(
//   {
//     name: "Individual World Cup",
//     location: {
//       city: "Belgrade",
//       country: "Serbia",
//     },
//     year: 2020,
//     month: "December",
//   },
//   {},
//   { upsert: true, new: true, setDefaultsOnInsert: true },
//   function (error, result) {
//     if (error) console.log(error);

//     // do something with the document
//   }
// );
