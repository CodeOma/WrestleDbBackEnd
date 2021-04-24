const express = require("express");
const router = new express.Router();
const Wrestler = require("../db/models/wrestler");
const Tournament = require("../db/models/tournament");
const Match = require("../db/models/match");
const { checkIfAuthenticated, checkIfAdmin } = require("../middleware/auth");
const { allTechniques } = require("../aggregates/technique");

////Fetch ALL TECHNIQUES////

router.get("/techniques/all", checkIfAuthenticated, async (req, res) => {
  try {
    const id = "";
    const filter = req.query.filters;
    const skip = req.query.skip;
    const techniques = await allTechniques(id, filter, skip);
    // const techniques = await allTechniques();
    res.status(200).send(techniques);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
