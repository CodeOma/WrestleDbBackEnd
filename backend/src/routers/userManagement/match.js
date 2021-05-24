const express = require("express");
const router = new express.Router();
const UserMatch = require("../../db/models/usermodels/usermatch");
const {
  totalTechnique,
  totalSetup,
  totalSpecific,
} = require("../../aggregates/allWrestlers");
const {
  wrestlerTakedowns,
  wrestlerConceded,
  takedownsConceded,
  scoring,
  conceded,
  gotCountered,
  wrestlerMatches,
} = require("../../aggregates/IndividualWrestler");

const { checkIfAuthenticated, checkIfAdmin } = require("../../middleware/auth");
const UserWrestler = require("../../db/models/usermodels/userwrestler");

/////BY WRESTLER ID (LIST for editing)////////

router.get(
  "/user/match/wrestler/list/:id",
  checkIfAuthenticated,
  async (req, res) => {
    try {
      const wrestler = await UserMatch.find({
        $and: [
          {
            $or: [
              { "redWrestler.id": req.params.id },
              { "blueWrestler.id": req.params.id },
            ],
          },
          {
            owner: req.authId,
          },
        ],
      });
      res.status(200).send(wrestler);
    } catch (e) {
      res.status(400).send();
    }
  }
);
////BY WRESTLER///////
router.get(
  "/user/match/wrestler/:id",
  checkIfAuthenticated,
  async (req, res) => {
    try {
      if (req.query.filters) {
        const filter = req.query.filters;
        const wrestler = await wrestlerMatches(
          req.params.id,
          req.authId,
          filter
        );
        res.status(200).send(wrestler);
      } else {
        const wrestler = await wrestlerMatches(req.params.id);
        res.status(200).send(wrestler);
      }
    } catch (e) {
      res.status(400).send();
    }
  }
);

///Specific Match BY ID////
router.get("/user/match/:id", checkIfAuthenticated, async (req, res) => {
  try {
    const match = await UserMatch.findOne({
      _id: req.params.id,
      owner: req.authId,
    });
    if (!match) {
      return res.status(404).send();
    }
    res.send(match);
  } catch (e) {
    res.status(500).send();
  }
});

///////////Search Autocomplete//////////
router.get(
  "/user/autosearch/match/:key",
  checkIfAuthenticated,
  async (req, res) => {
    try {
      let q = req.params.key;
      let query = {
        $and: [
          {
            $or: [
              { "redWrestler.fullName": { $regex: q, $options: "i" } },
              { "blueWrestler.fullName": { $regex: q, $options: "i" } },
            ],
          },
          { owner: req.authId },
        ],
      };
      const matches = await UserMatch.find(query).sort({ date: -1 }).limit(10);
      if (!matches) {
        return res.status(404).send();
      }
      console.log("searched");
      res.send(matches);
    } catch (error) {
      res.status(500).send;
    }
  }
);

/////////PUT(Update/Create)///////////
router.put("/user/match/:id", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    console.log(req.params);
    console.log(req.body);

    const match = await UserMatch.findByIdAndUpdate(
      req.params.id,
      { ...req.body, owner: req.authId },
      {
        new: true,
      }
    );
    console.log(match);
  } catch (e) {
    res.status(500).send();
  }
});

////////////DELETE////////////////
router.delete("/user/match/:id", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    console.log(req.params);
    console.log(req.body);

    // const match = await UserMatch.findByIdAndDelete(req.params.id, req.body, {
    //   new: true,
    // });
    // console.log(match);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
