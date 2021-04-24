const express = require("express");
const router = new express.Router();
const Wrestler = require("../db/models/wrestler");
const { checkIfAuthenticated, checkIfAdmin } = require("../middleware/auth");

// const auth = require("../middleware/auth");

////////BY WEIGHTCLASS////////

router.get("/wrestler", async (req, res) => {
  try {
    const wrestler = await Wrestler.find({});
    res.status(200).send(wrestler);
  } catch (e) {
    res.status(400).send();
  }
});
router.get("/wrestler/:id", async (req, res) => {
  try {
    const wrestler = await Wrestler.find({ _id: req.params.id });
    res.status(200).send(wrestler);
  } catch (e) {
    res.status(400).send();
  }
});

router.get("/wrestler/weightclass/:id", async (req, res) => {
  try {
    const wrestler = await Wrestler.find({
      weightClass: req.params.weightclass,
    });
    res.status(200).send(wrestler);
  } catch (e) {
    res.status(400).send();
  }
});
router.get("/wrestler/team/:team", async (req, res) => {
  try {
    console.log(req.params.team);
    const wrestler = await Wrestler.find({
      team: req.params.team.toUpperCase(),
    });
    res.status(200).send(wrestler);
  } catch (e) {
    res.status(400).send();
  }
});
////BY ROUND///
router.get("/wrestler/round/:round", async (req, res) => {
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

////////////PUT (UPDATE/CREATE)//////////////
router.put("/wrestler", async (req, res) => {
  try {
    console.log(req.body);
    if (
      req.body.fullName !== "" &&
      req.body.lastName !== "" &&
      req.body.team !== ""
    ) {
      const wrestler1 = await Wrestler.findOneAndUpdate(
        {
          fullName: req.body.fullName,
          lastName: req.body.lastName,
          team: req.body.team,
        },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (error, result) {
          if (error) console.log(error);
        }
      );
      console.log(wrestler1);
    } else {
      throw new Error("Invalid Wreslter Format");
    }
  } catch (e) {
    res.status(500).send();
  }
});

//////////Search Autocomple////
router.get("/autosearch/wrestler/:key", async (req, res) => {
  try {
    let q = req.params.key;
    let query = {
      $or: [{ fullName: { $regex: q, $options: "i" } }],
    };
    const wrestler = await Wrestler.find(query).sort({ date: -1 }).limit(10);

    if (!wrestler) {
      return res.status(404).send();
    }
    const array = await wrestler.map(wres => {
      return { title: wres.fullName, id: wres._id };
    });
    res.send(array);
  } catch (error) {
    res.status(500).send;
  }
});

module.exports = router;

///////Create////////
// router.post("/wrestler", async (req, res) => {
//   try {
//     await task.save();
//     res.status(201).send(task);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });
