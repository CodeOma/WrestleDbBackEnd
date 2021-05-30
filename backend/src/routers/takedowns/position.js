const express = require("express");
const router = new express.Router();
const { Position } = require("../../db/models/takedown");
const { positionCheck } = require("../../helpers/errorhandling");
const { checkIfAuthenticated, checkIfAdmin } = require("../../middleware/auth");

// TAKEDOWN

////////////PUT (UPDATE/CREATE)//////////////
router.post("/user/position", checkIfAuthenticated, async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.position !== "" && req.authId) {
      if (!req.body.position || !req.body.position.length) {
        return res.status(400).json({
          error: "Position is required",
        });
      }
      const position1 = await Position.findOneAndUpdate(
        {
          position: req.body.position,
          owner: req.authId,
        },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true },

        function (error, result) {
          if (error) throw new Error(error);
        }
      );
      res.status(200).send(position1);
      console.log(position1);
    } else {
      throw new Error("Invalid position Format");
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

//////////Search Autocomple////
router.get(
  "/user/autosearch/position/:key",
  checkIfAuthenticated,
  async (req, res) => {
    try {
      let q = req.params.key;
      let query = {
        $or: [{ position: { $regex: q, $options: "i" }, owner: req.authId }],
      };
      const position = await Position.find(query).sort({ date: -1 }).limit(10);

      if (!position) {
        return res.status(404).send();
      }
      const array = await position.map(wres => {
        return { title: wres.fullName, id: wres._id };
      });
      res.send(array);
    } catch (error) {
      error("MENDANDNEDDJAKSDNJASKD", error.message);
      res.status(500).send;
    }
  }
);

////////////Get ALL FOR CREATOR//////////////
router.get("/user/position/all", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const position = await Position.find({ owner: req.authId });
    res.status(200).send(position);
  } catch (e) {
    res.status(500).send();
  }
});
/////////////UPDATE///////////////
router.put("/user/position", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    positionCheck(req.body);

    const position = await Position.findOneAndUpdate(
      { _id: req.body._id, owner: req.authId },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).send(position);
  } catch (e) {
    console.log(e);

    res.status(500).send();
  }
});
////////////DELETE////////////////
router.delete("/user/position/:id", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const position = await Position.deleteOne({
      _id: req.params.id,
      owner: req.authId,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Unable to");
  }
});
module.exports = router;
