const express = require("express");
const router = new express.Router();
const Match = require("../db/models/match");
const {
  totalTechnique,
  totalSetup,
  totalSpecific,
} = require("../aggregates/allWrestlers");
const {
  wrestlerTakedowns,
  wrestlerConceded,
  takedownsConceded,
  scoring,
  conceded,
  gotCountered,
  wrestlerMatches,
} = require("../aggregates/IndividualWrestler");

const { checkIfAuthenticated, checkIfAdmin } = require("../middleware/auth");
const Wrestler = require("../db/models/wrestler");
const Tournament = require("../db/models/tournament");
const User = require("../db/models/user");

/////BY WRESTLER ID (LIST for editing)////////

router.get(
  "/user/match/wrestler/list/:id",
  checkIfAuthenticated,
  async (req, res) => {
    try {
      if (req.role === 300) {
        const wrestler = await Match.find({
          $and: [
            {
              $or: [
                { "redWrestler.id": req.params.id },
                { "blueWrestler.id": req.params.id },
              ],
            },
            {
              $or: [
                { owner: req.authId },
                { owner: "60a2a5803bb95bbc1c18b767" },
              ],
            },
          ],
        });
        res.status(200).send(wrestler);
      } else {
        const wrestler = await Match.find({
          $and: [
            {
              $or: [
                { "redWrestler.id": req.params.id },
                { "blueWrestler.id": req.params.id },
              ],
            },
            {
              $or: [{ owner: req.authId }],
            },
          ],
        });
        res.status(200).send(wrestler);
      }
    } catch (e) {
      res.status(400).send();
    }
  }
);

router.get("/user/match/wrestler/publiclist/:id", async (req, res) => {
  try {
    const wrestler = await Match.find({
      $and: [
        {
          $or: [
            { "redWrestler.id": req.params.id },
            { "blueWrestler.id": req.params.id },
          ],
        },
        {
          $or: [{ owner: "60a2a5803bb95bbc1c18b767" }],
        },
      ],
    });
    res.status(200).send(wrestler);
  } catch (e) {
    res.status(400).send();
  }
});
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
          filter,
          skip,

          req.authId
        );
        res.status(200).send(wrestler);
      } else {
        const wrestler = await wrestlerMatches(req.params.id);
        res.status(200).send(wrestler);
      }
      console.log(req.query.filters);
    } catch (e) {
      res.status(400).send();
    }
  }
);
//no auth version
router.get("/match/wrestler/:id", async (req, res) => {
  try {
    console.log(req.query.skip);
    if (req.query.filters) {
      const filter = req.query.filters;
      const skip = req.query.skip;

      const wrestler = await wrestlerMatches(req.params.id, filter, skip);
      res.status(200).send(wrestler);
    } else {
      const wrestler = await wrestlerMatches(req.params.id);
      res.status(200).send(wrestler);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});
////////////Get ALL FOR CREATOR//////////////
router.get("/user/match/all", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const match = await Match.find({});
    res.status(200).send(match);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

///Specific Match BY ID////
router.get("/user/match/:id", checkIfAuthenticated, async (req, res) => {
  try {
    const match = await Match.findOne({
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
      const matches = await Match.find(query).sort({ date: -1 }).limit(10);
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

///Specific Match BY ID////
router.get("/match/:id", async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.id,
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
router.get("/autosearch/match/:key", async (req, res) => {
  try {
    let q = req.params.key;
    let query = {
      $or: [
        { "redWrestler.fullName": { $regex: q, $options: "i" } },
        { "blueWrestler.fullName": { $regex: q, $options: "i" } },
      ],
    };
    const matches = await Match.find(query).sort({ date: -1 }).limit(10);
    if (!matches) {
      return res.status(404).send();
    }
    console.log("searched");
    res.send(matches);
  } catch (error) {
    res.status(500).send;
  }
});

/////////PUT(Update/Create)///////////
router.put("/user/match", checkIfAuthenticated, async (req, res) => {
  try {
    if (
      !req.body.tournament.tournamentId ||
      !req.body.tournament.tournamentId.length
    ) {
      return res.status(400).json({
        error: "Tournament is required",
      });
    }
    // if (!req.body.style || !req.body.style.length) {
    //   return res.status(400).json({
    //     error: "Style is required",
    //   });
    // }
    if (!req.body.weightClass || !req.body.weightClass.length) {
      return res.status(400).json({
        error: "Weight Class is required",
      });
    }
    if (!req.body.round || !req.body.round.length) {
      return res.status(400).json({
        error: "Round is required",
      });
    }
    if (!req.body.result.victoryType || !req.body.result.victoryType.length) {
      return res.status(400).json({
        error: "Victory Type is required",
      });
    }
    if (!req.body.result.winner || !req.body.result.winner.length) {
      return res.status(400).json({
        error: "Winner is required",
      });
    }
    if (!req.body.result.loser || !req.body.result.loser.length) {
      return res.status(400).json({
        error: "Loser is required",
      });
    }
    // if (!result.winnerPoints || !result.winnerPoints.length) {
    //   return res.status(400).json({
    //     error: "Winneis required",
    //   });
    // }
    // if (!result.loserPoints || !result.loserPoints.length) {
    //   return res.status(400).json({
    //     error: "Position is required",
    //   });
    // }
    // if (req.body.result.redTotalPoints  ) {
    //   return res.status(400).json({
    //     error: "Red Total is required",
    //   });
    // }
    // if (!req.body.result.blueTotalPoints.length) {
    //   return res.status(400).json({
    //     error: "Blue Total Points is required",
    //   });
    // }

    if (!req.body.redWrestler.id || !req.body.redWrestler.id.length) {
      return res.status(400).json({
        error: "Position is required",
      });
    }

    if (!req.body.blueWrestler.id || !req.body.blueWrestler.id.length) {
      return res.status(400).json({
        error: "Blue Wrestler is required",
      });
    }

    if (!req.body.url || !req.body.url.length) {
      return res.status(400).json({
        error: "Match Url is required",
      });
    }
    const tournament = await Tournament.findOne({
      _id: req.body.tournament.tournamentId,
    });
    console.log({
      ...req.body,
      tournament: {
        tournamentName: tournament.name,
        tournamentId: tournament._id,
        tournamentType: tournament.type,
      },
      owner: req.authId,
      style: "Freestyle",
      organization: "United World Wrestling",
    });
    const match = await Match.create({
      ...req.body,
      tournament: {
        tournamentName: tournament.name,
        tournamentId: tournament._id,
        tournamentType: tournament.type,
      },
      owner: req.authId,
      style: "Freestyle",
      organization: "United World Wrestling",
    });
    res.status(200).send(match);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});
router.put("/user/match/:id", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { ...req.body, owner: req.authId },
      {
        new: true,
      }
    );
    res.send(200).send(match);
  } catch (e) {
    res.status(500).send(e);
  }
});

////////////DELETE////////////////
router.delete("/user/match/:id", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    // console.log(req.params);
    // console.log(req.body);
    // const match = await Match.findByIdAndDelete(req.params.id, req.body, {
    //   new: true,
    // });
    // console.log(match);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
