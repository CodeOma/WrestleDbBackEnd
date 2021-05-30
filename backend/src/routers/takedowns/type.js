const express = require("express");
const router = new express.Router();
const { Type } = require("../../db/models/takedown");
const { checkIfAuthenticated, checkIfAdmin } = require("../../middleware/auth");

// TAKEDOWN

////////////PUT (UPDATE/CREATE)//////////////
router.post("/user/type", checkIfAuthenticated, async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body.type || !req.body.type.length) {
      return res.status(400).json({
        error: "Type is required",
      });
    }
    if (!req.body.position || !req.body.position.length) {
      return res.status(400).json({
        error: "Position is required",
      });
    }
    if (req.body.type !== "" && req.body.position !== "" && req.authId) {
      const type1 = await Type.findOneAndUpdate(
        {
          type: req.body.type,
          owner: req.authId,
        },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (error, result) {
          if (error) console.log(error);
        }
      );
      res.status(200).send(type1);
      // console.log(type1);
    } else {
      throw new Error("Invalid type Format");
    }
  } catch (e) {
    console.log(e);

    res.status(500).send(e);
  }
});

//////////Search Autocomple////
router.get(
  "/user/autosearch/type/:key",
  checkIfAuthenticated,
  async (req, res) => {
    try {
      let q = req.params.key;
      let query = {
        $or: [{ type: { $regex: q, $options: "i" }, owner: req.authId }],
      };
      const type = await Type.find(query).sort({ date: -1 }).limit(10);

      if (!type) {
        return res.status(404).send();
      }
      const array = await type.map(wres => {
        return { title: wres.fullName, id: wres._id };
      });
      res.send(array);
    } catch (error) {
      res.status(500).send;
    }
  }
);

////////////Get ALL FOR CREATOR//////////////
router.get("/user/type/all", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const type = await Type.find({ owner: req.authId });
    res.status(200).send(type);
  } catch (e) {
    res.status(500).send();
  }
});
/////////////UPDATE///////////////
router.put("/user/type", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    const type = await Type.findOneAndUpdate(
      { _id: req.body._id, owner: req.authId },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).send(type);
  } catch (e) {
    console.log(e);

    res.status(500).send();
  }
});
////////////DELETE////////////////
router.delete("/user/type/:id", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    console.log(req.authId);
    console.log(req.params.id);

    const type = await Type.deleteOne({
      _id: req.params.id,
      owner: req.authId,
    });
    console.log(type);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});
module.exports = router;
