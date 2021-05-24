const express = require("express");
const router = new express.Router();
const UserWrestler = require("../../db/models/usermodels/userwrestler");
const UserTournament = require("../../db/models/usermodels/usertournament");
const UserMatch = require("../../db/models/usermodels/usermatch");
const { checkIfAuthenticated, checkIfAdmin } = require("../../middleware/auth");
const { allTechniques } = require("../../aggregates/technique");

////Fetch ALL TECHNIQUES////

router.get("/user/techniques/all", checkIfAuthenticated, async (req, res) => {
  try {
    const id = "";
    const filter = req.query.filters;
    const skip = req.query.skip;
    const techniques = await allTechniques(id, filter, skip, req.authId);
    // const techniques = await allTechniques();
    res.status(200).send(techniques);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
