const express = require("express");
const router = new express.Router();
const { checkIfAuthenticated, checkIfAdmin } = require("../middleware/auth");

const Wrestler = require("../db/models/wrestler");
const Tournament = require("../db/models/tournament");
const { AllStats } = require("../db/models/stats");

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
  scorecounter,
  oppSetups,
  setups,
  scoring,
  conceded,
  gotCountered,
  getScoreTypes,
} = require("../aggregates/IndividualWrestler");

router.get("/stats/all", async (req, res) => {
  try {
    const getStats = await AllStats.findById({
      _id: "61198f224e1bc7cce942d928",
    });
    res.send(getStats.array);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put("/stats/all", async (req, res) => {
  try {
    const totSetup = await totalSetup();
    const totTechnique = await totalTechnique();
    const totDefTechnique = await totalDefTechnique();

    // const updateStats = await AllStats.findOneAndUpdate(
    //   {},
    //   {
    //     array: [totTechnique, totDefTechnique, totSetup],
    //   },
    //   { upsert: true, new: true }
    // );

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
