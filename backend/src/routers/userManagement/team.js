const express = require("express");
const router = new express.Router();
const UserTeam = require("../../db/models/usermodels/userteam");
const { checkIfAuthenticated, checkIfAdmin } = require("../../middleware/auth");
const { teamMatches } = require("../../aggregates/team");

////////////PUT (UPDATE/CREATE)//////////////
router.post("/user/team", checkIfAuthenticated, async (req, res) => {
  try {
    console.log(req.body, "yeet");
    // console.log(req.body.team);
    // console.log(req.body._id);

    if (req.body.team !== "" && req.authId) {
      const team1 = await UserTeam.findOneAndUpdate(
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
      const team = await UserTeam.find(query).sort({ date: -1 }).limit(10);

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

    const team = await UserTeam.find({ owner: req.authId });
    res.status(200).send(team);
  } catch (e) {
    res.status(500).send();
  }
});
/////////////UPDATE///////////////
router.put("/user/team", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    const team = await UserTeam.findOneAndUpdate(
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

    const team = await UserTeam.deleteOne({
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
