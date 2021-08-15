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
////////////PUT (UPDATE/CREATE)//////////////
router.post("/user/team", checkIfAuthenticated, async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body.teamName || !req.body.teamName.length) {
      return res.status(400).json({
        error: "Team is required",
      });
    }
    if (req.body.team !== "" && req.authId) {
      const team1 = await Team.findOneAndUpdate(
        {
          teamName: req.body.teamName,
          owner: req.authId,
        },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (error, result) {
          if (error) console.log(error);
        }
      );
      res.status(200).send(team1);
      // console.log(team1);
    } else {
      throw new Error("Invalid team Format");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

//////////Search Autocomple////
router.get(
  "/user/autosearch/team/:key",
  checkIfAuthenticated,
  async (req, res) => {
    try {
      let q = req.params.key;
      let query = {
        $or: [{ teamName: { $regex: q, $options: "i" }, owner: req.authId }],
      };
      const team = await Team.find(query).sort({ date: -1 }).limit(10);

      if (!team) {
        return res.status(404).send();
      }
      const array = await team.map(team => {
        return { title: team.teamName, id: team._id };
      });
      res.send(array);
    } catch (error) {
      res.status(500).send;
    }
  }
);

////////////Get ALL FOR CREATOR//////////////
router.get("/user/team/all", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const team = await Team.find({
      $or: [{ owner: req.authId }, { owner: "60a2a5803bb95bbc1c18b767" }],
    });
    res.status(200).send(team);
  } catch (e) {
    res.status(500).send();
  }
});
/////////////UPDATE///////////////
router.put("/user/team", checkIfAuthenticated, async (req, res) => {
  try {
    if (!req.body.teamName | !req.body.teamName.length) {
      return res.status(400).json({
        error: "Type is required",
      });
    }
    const team = await Team.findOneAndUpdate(
      { _id: req.body._id, owner: req.authId },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).send(team);
  } catch (e) {
    console.log(e);

    res.status(500).send();
  }
});
////////////DELETE////////////////
router.delete("/user/team/:id", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    console.log(req.authId);
    console.log(req.params.id);

    const team = await Team.deleteOne({
      _id: req.params.id,
      owner: req.authId,
    });
    console.log(team);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});
module.exports = router;

// await req.user.populate("tasks").execPopulate();
// res.status(200).send(req.user.tasks);
