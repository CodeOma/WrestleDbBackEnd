const express = require("express");
const router = new express.Router();
const Tournament = require("../db/models/tournament");
const { tournamentMatches } = require("../aggregates/tournament");
const { checkIfAuthenticated, checkIfAdmin } = require("../middleware/auth");

/////////Get Tournaments///////////

router.get("/tournament", async (req, res) => {
  try {
    const tournament = await Tournament.find({});
    res.status(200).send(tournament);
  } catch (e) {
    res.status(400).send();
  }
});

/////////Get Matches By Tournament///////////

router.get("/match/tournament/:id", async (req, res) => {
  try {
    if (req.query.filters) {
      const filter = req.query.filters;
      const skip = req.query.skip;
      const tournament = await tournamentMatches(req.params.id, filter, skip);
      res.status(200).send(tournament);
      console.log(tournament);
    } else {
      const team = await tournamentMatches(req.params.id);
      res.status(200).send(team);
    }
  } catch (e) {
    res.status(400).send();
  }
});

/////////PUT(Update/Create)///////////

router.put("/tournament", async (req, res) => {
  try {
    console.log(req.body);
    if (
      req.body.type !== "" &&
      req.body.year !== "" &&
      req.body.location.city !== "" &&
      req.body.location.country !== "" &&
      req.body.name !== ""
    ) {
      const tournament = await Tournament.findOneAndUpdate(
        {
          type: req.body.type,
          year: req.body.year,
          location: {
            city: req.body.location.city,
            country: req.body.location.country,
          },
          name: req.body.name,
        },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (error, result) {
          if (error) console.log(error);
        }
      );
      console.log(tournament);
      res.send(tournament);
    } else {
      throw new Error("Invalid Wreslter Format");
    }
  } catch (e) {
    res.status(500).send();
  }
});

////Search
router.get("/autosearch/tournament/:key", async (req, res) => {
  try {
    let q = req.params.key;
    let query = {
      $or: [{ name: { $regex: q, $options: "i" } }],
    };
    const tournament = await Tournament.find(query)
      .sort({ date: -1 })
      .limit(10);
    if (!tournament) {
      return res.status(404).send();
    }
    const array = await tournament.map(tour => {
      return { title: tour.name, id: tour._id };
    });
    res.send(array);
  } catch (error) {
    res.status(500).send;
  }
});

module.exports = router;

// router.get("/:id/matches", async (req, res) => {
//   try {
//     const tournament = await Tournament.findById({ _id: req.params.id });
//     await tournament.populate("matches").execPopulate();
//     res.status(200).send(tournament.matches);
//   } catch (e) {
//     res.status(400).send();
//   }
// });
