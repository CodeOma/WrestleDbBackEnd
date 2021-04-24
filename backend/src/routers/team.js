const express = require("express");
const router = new express.Router();
const Team = require("../db/models/team");
const { checkIfAuthenticated, checkIfAdmin } = require("../middleware/auth");

const { teamMatches } = require("../aggregates/team");

/////////Get Teams///////////
router.get("/team", async (req, res) => {
  try {
    const team = await Team.find({});
    res.status(200).send(team);
  } catch (e) {
    res.status(400).send();
  }
});

/////////Get Matches By Teams///////////

router.get("/matches/team/:id", async (req, res) => {
  try {
    if (req.query.filters) {
      const filter = req.query.filters;
      const skip = req.query.skip;
      const team = await teamMatches(req.params.id, filter, skip);
      res.status(200).send(team);
    } else {
      const team = await teamMatches(req.params.id);
      res.status(200).send(team);
    }
  } catch (e) {
    res.status(400).send();
  }
});

///////////Search Autocomplete////////////

router.get("/autosearch/team/:key", async (req, res) => {
  try {
    let q = req.params.key;
    let query = {
      $or: [{ teamName: { $regex: q, $options: "i" } }],
    };
    const team = await Team.find(query).sort({ date: -1 }).limit(10);
    if (!team) {
      return res.status(404).send();
    }
    const array = await team.map(t => {
      return { title: t.teamName, id: t._id };
    });

    res.send(array);
  } catch (error) {
    res.status(500).send;
  }
});
module.exports = router;

// await req.user.populate("tasks").execPopulate();
// res.status(200).send(req.user.tasks);
