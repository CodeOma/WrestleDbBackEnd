const express = require("express");
const router = new express.Router();
const Tournament = require("../db/models/tournament");
const { tournamentMatches } = require("../aggregates/tournament");
const { checkIfAuthenticated, checkIfAdmin } = require("../middleware/auth");
const { errorHandler } = require("../helpers/errorhandling");
/////////Get Tournaments///////////

router.get("/tournament", async (req, res) => {
  try {
    const tournament = await Tournament.find({});
    res.status(200).send(tournament);
  } catch (e) {
    res.status(400).send(e);
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
    res.status(400).send(e);
  }
});

/////////PUT(Update/Create)///////////

router.put("/tournament", async (req, res) => {
  try {

    if (!req.body.type || !req.body.type.length) {
      return res.status(400).json({
        error: "Type is required",
      });
    }
    if (!req.body.year || !req.body.year.length) {
      return res.status(400).json({
        error: "Year is required",
      });
    }
    if (!req.body.location.city || !req.body.location.city.length) {
      return res.status(400).json({
        error: "City is required",
      });
    }
    if (!req.body.location.country || !req.body.location.country.length) {
      return res.status(400).json({
        error: "Country is required",
      });
    }
    if (!req.body.name || !req.body.name.length) {
      return res.status(400).json({
        error: "Name is required",
      });
    }
    if (parseInt(req.body.year).length !== 4) {
      return res.status(400).json({
        error: "Year needs to be in proper format",
      });
    }

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
          year: parseInt(req.body.year),
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
    res.status(500).send(e);
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
  } catch (e) {
    res.status(500).send(e);
  }
});
/////////Get Tournaments///////////

router.get("/user/tournament/all", checkIfAuthenticated, async (req, res) => {
  try {
    const tournament = await Tournament.find({ owner: req.authId });
    res.status(200).send(tournament);
  } catch (e) {
    res.status(400).send(e);
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
      res.status(400).send(e);
    }
  }
);

/////////PUT(Update/Create)///////////

router.post("/user/tournament", checkIfAuthenticated, async (req, res) => {
  try {
    if (!req.body.type || !req.body.type.length) {
      return res.status(400).json({
        error: "Type is required",
      });
    }
    if (!req.body.year || !req.body.year.length) {
      return res.status(400).json({
        error: "Year is required",
      });
    }
    if (!req.body.location.city || !req.body.location.city.length) {
      return res.status(400).json({
        error: "City is required",
      });
    }
    if (!req.body.location.country || !req.body.location.country.length) {
      return res.status(400).json({
        error: "Country is required",
      });
    }
    if (!req.body.name || !req.body.name.length) {
      return res.status(400).json({
        error: "Name is required",
      });
    }
    if (parseInt(req.body.year) < 1980 && parseInt(req.body.year) > 2023) {
      return res.status(400).json({
        error: "Year needs to be in proper format",
      });
    }

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
          year: parseInt(req.body.year),
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
    }
    // else {
    //   throw new Error("Invalid Tournament Format");
    // }
  } catch (e) {
    res.status(500).send(e);
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
      res.status(500).send(e);
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
      const tournament = await Tournament.findOneAndUpdate(
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
    res.status(500).send(e);
  }
});
////////////DELETE////////////////
router.delete(
  "/user/tournament/:id",
  checkIfAuthenticated,
  async (req, res) => {
    try {
      //Validation

      const tournament = await Tournament.deleteOne({
        _id: req.params.id,
        owner: req.authId,
      });
      console.log(tournament);
      res.status(204).send(tournament);
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }
);

module.exports = router;
