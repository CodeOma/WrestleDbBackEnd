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

// router.post("/tasks", auth, async (req, res) => {
// //   const task = new Task({ ...req.body, creator: req.user._id });

//   try {
//     await task.save();
//     res.status(201).send(task);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

////BY WEIGHTCLASS///

router.get("/match/weightclass/:weightclass", async (req, res) => {
  try {
    const match = await Match.find({ weightClass: req.params.weightclass });
    res.status(200).send(match);
  } catch (e) {
    res.status(400).send();
  }
});

////BY ROUND///
router.get("/match/round/:round", async (req, res) => {
  try {
    console.log(req.params.round);
    const roundfunc = () => {
      if (req.params.round === "round16") {
        return "1/16 Final";
      }
      if (req.params.round === "round8") {
        return "1/8 Final";
      }
      if (req.params.round === "round4") {
        return "1/4 Final";
      }
      if (req.params.round === "round2") {
        return "1/2 Final";
      }
      if (req.params.round === "final") {
        return "Final 1-2";
      }
      if (req.params.round === "repechage") {
        return "Repechage";
      }
      if (req.params.round === "final3") {
        return "Final 3-5";
      }
      if (req.params.round === "Qualif") {
        return "Qualif";
      }
    };
    const round = roundfunc(req.params.round);
    console.log(round);
    const match = await Match.find({ round });
    res.status(200).send(match);
  } catch (e) {
    res.status(400).send();
  }
});

/////BY WRESTLER ID (LIST for editing)////////

router.get("/match/wrestler/list/:id", async (req, res) => {
  try {
    const wrestler = await Match.find({
      $or: [
        { "redWrestler.id": req.params.id },
        { "blueWrestler.id": req.params.id },
      ],
    });
    res.status(200).send(wrestler);
  } catch (e) {
    res.status(400).send();
  }
});
////BY WRESTLER///////
router.get("/match/wrestler/:id", async (req, res) => {
  try {
    if (req.query.filters) {
      const filter = req.query.filters;
      const wrestler = await wrestlerMatches(req.params.id, filter);
      res.status(200).send(wrestler);
    } else {
      const wrestler = await wrestlerMatches(req.params.id);
      res.status(200).send(wrestler);
    }
  } catch (e) {
    res.status(400).send();
  }
});

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
router.put("/match/:id", async (req, res) => {
  try {
    console.log(req.params);
    console.log(req.body);

    const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    console.log(match);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
