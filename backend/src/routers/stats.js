const express = require("express");
const router = new express.Router();
const { checkIfAuthenticated, checkIfAdmin } = require("../middleware/auth");

const Wrestler = require("../db/models/wrestler");
const Tournament = require("../db/models/tournament");
const { generalStats, individualProfileStats } = require("../aggregates/stats");
const {
  totalTechnique,
  totalSetup,
  totalSpecific,
  allWrestlers,
  wrestlerStats,
} = require("../aggregates/allWrestlers");
const {
  // ok,
  wrestlerTakedowns,
  wrestlerConceded,
  takedownsConceded,
  scoring,
  conceded,
  gotCountered,
  getScoreTypes,
} = require("../aggregates/IndividualWrestler");

// // router.get("/stats/wrestler/:id", async (req, res) => {
// //   try {
// //     const wrestler = await Wrestler.find({ _id: req.params.id });
// //     // const ok = await ok(wrestler[0].fullName);

// const takedownsC = await takedownsConceded(wrestler[0].fullName);
// const takedownsScored = await scoring(wrestler[0].fullName);
// const takedownsGiven = await conceded(wrestler[0].fullName);
// const scoreTypes = await getScoreTypes(wrestler[0].fullName);
// const countered = await gotCountered(wrestler[0].fullName);
// const setup = await setups(wrestler[0].fullName);

// res.send({
//   takedownsGiven,
//   takedownsScored,
//   countered,
//   scoreTypes,
// });
// //   } catch (e) {}
// // });
router.get("/holyshit", async (req, res) => {
  try {
    const totSetup = await wrestlerStats(["6042f3208e4ff31a532f7324"]);
    // const All = await allWrestlers();
    // const totSetup = await totalSetup();
    // const totTechnique = await totalTechnique();
    // const totSpecific = await totalSpecific("Double Leg");
    res.send(totSetup);
  } catch (e) {
    res.status(400).send();
  }
});

router.get("/stats/wrestler/:id", async (req, res) => {
  try {
    const wrestler = await Wrestler.find({ _id: req.params.id });
    // //     // const ok = await ok(wrestler[0].fullName);

    const takedownsScored = await scoring(wrestler[0].fullName);
    const takedownsGiven = await conceded(wrestler[0].fullName);
    const scoreTypes = await getScoreTypes(wrestler[0].fullName);
    const countered = await gotCountered(wrestler[0].fullName);
    // const setup = await setups(wrestler[0].fullName);

    const stats = await individualProfileStats(req.params.id);
    console.log(stats);
    res.send([stats, takedownsGiven, takedownsScored, countered, scoreTypes]);
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

router.get("/stats/general", async (req, res) => {
  try {
    const stats = await generalStats();
    res.send(stats);
  } catch (e) {
    res.status(400).send();
  }
});
module.exports = router;
