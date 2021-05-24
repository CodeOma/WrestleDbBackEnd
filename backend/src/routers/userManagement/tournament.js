const express = require("express");
const router = new express.Router();
const UserTournament = require("../../db/models/usermodels/usertournament");
const { tournamentMatches } = require("../../aggregates/tournament");
const { checkIfAuthenticated, checkIfAdmin } = require("../../middleware/auth");
const { errorHandler } = require("../../helpers/errorhandling");
/////////Get Tournaments///////////

router.get("/user/tournament/all", checkIfAuthenticated, async (req, res) => {
  try {
    const tournament = await UserTournament.find({ owner: req.authId });
    res.status(200).send(tournament);
  } catch (e) {
    res.status(400).send();
  }
});

/////////Get Matches By Tournament///////////

router.get(
  "/user/match/tournament/:id",
  checkIfAuthenticated,
  async (req, res) => {
    try {
      if (req.query.filters) {
        const filter = req.query.filters;
        const skip = req.query.skip;
        const tournament = await tournamentMatches(req.params.id, filter, skip);
        res.status(200).send(tournament);
        console.log(tournament);
      } else {
        const tournament = await tournamentMatches(req.params.id);
        res.status(200).send(tournament);
      }
    } catch (e) {
      res.status(400).send();
    }
  }
);

/////////PUT(Update/Create)///////////

router.post("/user/tournament", checkIfAuthenticated, async (req, res) => {
  try {
    console.log(req.body);
    if (
      req.body.type !== "" &&
      req.body.year !== "" &&
      req.body.location.city !== "" &&
      req.body.location.country !== "" &&
      req.body.name !== ""
    ) {
      const tournament = await UserTournament.findOneAndUpdate(
        {
          type: req.body.type,
          year: req.body.year,
          location: {
            city: req.body.location.city,
            country: req.body.location.country,
          },
          name: req.body.name,
          owner: req.authId,
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
      throw new Error("Invalid Tournament Format");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

////Search
router.get(
  "/user/autosearch/tournament/:key",
  checkIfAuthenticated,
  async (req, res) => {
    try {
      console.log("reached");
      let q = req.params.key;
      let query = {
        $and: [
          { $or: [{ name: { $regex: q, $options: "i" } }] },
          { owner: req.authId },
        ],
      };
      const tournament = await UserTournament.find(query)
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
  }
);

router.put("/user/tournament", checkIfAuthenticated, async (req, res) => {
  try {
    console.log(req.body);
    if (
      req.body.type !== "" &&
      req.body.year !== "" &&
      req.body.location.city !== "" &&
      req.body.location.country !== "" &&
      req.body.name !== ""
    ) {
      const tournament = await UserTournament.findOneAndUpdate(
        {
          _id: req.body._id,
          owner: req.authId,
        },
        {
          name: req.body.name,

          type: req.body.type,
          year: req.body.year,
          location: {
            city: req.body.location.city,
            country: req.body.location.country,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (error, result) {
          if (error) console.log(error);
        }
      );
      console.log(tournament);
      res.send(tournament);
    } else {
      throw new Error("Invalid Tournament Format");
    }
  } catch (e) {
    res.status(500).send();
  }
});
////////////DELETE////////////////
router.delete(
  "/user/tournament/:id",
  checkIfAuthenticated,
  async (req, res) => {
    try {
      //Validation
      console.log(req.authId);
      console.log(req.params.id);

      const tournament = await UserTournament.deleteOne({
        _id: req.params.id,
        owner: req.authId,
      });
      console.log(tournament);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
);
module.exports = router;
