const express = require("express");
const router = new express.Router();
const { Takedown } = require("../../db/models/takedown");
const { takedownCheck } = require("../../helpers/errorhandling");
const { checkIfAuthenticated, checkIfAdmin } = require("../../middleware/auth");

// TAKEDOWN

////////////PUT (UPDATE/CREATE)//////////////
router.post(
  "/user/takedown",
  checkIfAuthenticated,

  async (req, res) => {
    try {
      const { takedown, position, type, offdef } = req.body;

      if (!takedown || !takedown.length) {
        return res.status(400).json({
          error: "Takedown is required",
        });
      }
      if (!position || !position.length) {
        return res.status(400).json({
          error: "Position is required",
        });
      }
      if (!type || !type.length) {
        return res.status(400).json({
          error: "Type is required",
        });
      }
      if (!offdef || !offdef.length) {
        return res.status(400).json({
          error: "Category must be selected",
        });
      }

      const takedown1 = await Takedown.findOneAndUpdate(
        {
          takedown: req.body.takedown,
          offdef: req.body.offdef,
          position: req.body.position,
          // category: req.body.category,
          type: req.body.type,
          owner: req.authId,
        },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (error, result) {
          if (error) console.log(error);
        }
      );
      console.log(takedown1);
      res.status(200).send(takedown1);
    } catch (e) {
      res.status(500).send(errorHandler(e));
    }
  }
);

//////////Search Autocomple////
router.get(
  "/user/autosearch/takedown/:key",
  checkIfAuthenticated,
  async (req, res) => {
    try {
      let q = req.params.key;
      let query = {
        $or: [{ fullName: { $regex: q, $options: "i" } }],
      };
      const takedown = await Takedown.find(query).sort({ date: -1 }).limit(10);

      if (!takedown) {
        return res.status(404).send();
      }
      const array = await takedown.map(wres => {
        return { title: wres.fullName, id: wres._id };
      });
      res.send(array);
    } catch (error) {
      res.status(500).send;
    }
  }
);

////////////GET//////////////
router.get("/user/takedown/all", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const takedown = await Takedown.find({
      $or: [{ owner: req.authId }, { owner: "60a2a5803bb95bbc1c18b767" }],
    });
    res.status(200).send(takedown);
  } catch (e) {
    res.status(500).send(e);
  }
});
router.get("/user/takedown/:id", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const takedown = await Takedown.find({
      _id: req.params.id,
    });
    console.log(takedown);
    res.status(200).send(takedown);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});
/////////////UPDATE///////////////
router.put("/user/takedown", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const { takedown, position, type, offdef } = req.body;

    if (!takedown || !takedown.length) {
      return res.status(400).json({
        error: "Takedown is required",
      });
    }
    if (!position || !position.length) {
      return res.status(400).json({
        error: "Position is required",
      });
    }
    if (!type || !type.length) {
      return res.status(400).json({
        error: "Type is required",
      });
    }
    if (!offdef || !offdef.length) {
      return res.status(400).json({
        error: "Category must be selected",
      });
    }
    const takedownUpd = await Takedown.findOneAndUpdate(
      { _id: req.body._id, owner: req.authId },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).send(takedownUpd);
  } catch (e) {
    res.status(500).send(e);
  }
});
////////////DELETE////////////////
router.delete("/user/takedown/:id", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    console.log(req.params);
    console.log(req.body);

    const takedown = await Takedown.deleteOne({
      _id: req.params.id,
      owner: req.authId,
    });
    res.status(200).send(takedown);
  } catch (e) {
    res.status(500).send(e);
  }
});
module.exports = router;
