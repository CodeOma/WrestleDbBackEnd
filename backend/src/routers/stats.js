const express = require("express");
const router = new express.Router();
const { checkIfAuthenticated, checkIfAdmin } = require("../middleware/auth");

const Wrestler = require("../db/models/wrestler");
const Tournament = require("../db/models/tournament");
const { generalStats, individualProfileStats } = require("../aggregates/stats");
const {
  totalTechnique,
  totalDefTechnique,

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
  scorecounter,
  oppSetups,
  setups,
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
router.get("/stats/all", async (req, res) => {
  try {
    // const All = await allWrestlers();
    const totSetup = await totalSetup();
    const totTechnique = await totalTechnique();
    const totDefTechnique = await totalDefTechnique();

    // const totSpecific = await totalSpecific("Double Leg");
    res.send([totTechnique, totDefTechnique, totSetup]);
  } catch (e) {
    res.status(400).send(e);
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
    const setup = await setups(wrestler[0].fullName);
    const oppSetup = await oppSetups(wrestler[0].fullName);

    const stats = await individualProfileStats(req.params.id);
    const sc = await scorecounter(wrestler[0].fullName);
    res.send([
      stats,
      takedownsGiven,
      takedownsScored,
      countered,
      scoreTypes,
      setup,
      oppSetup,
      sc,
    ]);
  } catch (e) {
    res.status(400).send(e);
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
