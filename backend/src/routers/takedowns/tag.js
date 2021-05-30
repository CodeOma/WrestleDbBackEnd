const express = require("express");
const router = new express.Router();
const { Tag } = require("../../db/models/takedown");
const { tagCheck } = require("../../helpers/errorhandling");
const { checkIfAuthenticated, checkIfAdmin } = require("../../middleware/auth");

// TAKEDOWN

////////////PUT (UPDATE/CREATE)//////////////
router.post("/user/tag", checkIfAuthenticated, async (req, res) => {
  try {
    if (req.body.tag !== "" && req.authId) {
      tagCheck(req.body);
      const tag1 = await Tag.findOneAndUpdate(
        {
          tag: req.body.tag,
          owner: req.authId,
        },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (error, result) {
          if (error) console.log(error);
        }
      );
      res.status(200).send(tag1);

      console.log(tag1);
    } else {
      throw new Error("Invalid tag Format");
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

//////////Search Autocomple////
router.get(
  "/user/autosearch/tag/:key",
  checkIfAuthenticated,
  async (req, res) => {
    try {
      let q = req.params.key;
      let query = {
        $or: [{ tag: { $regex: q, $options: "i" }, owner: req.authId }],
      };
      const tag = await Tag.find(query).sort({ date: -1 }).limit(10);

      if (!tag) {
        return res.status(404).send();
      }
      const array = await tag.map(wres => {
        return { title: wres.fullName, id: wres._id };
      });
      res.send(array);
    } catch (error) {
      res.status(500).send;
    }
  }
);

////////////GET//////////////
router.get("/user/tag/all", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const tag = await Tag.find({ owner: req.authId });
    res.status(200).send(tag);
  } catch (e) {
    res.status(500).send();
  }
});
router.get("/user/tag/:id", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const tag = await Tag.find({
      _id: req.params.id,
    });
    console.log(tag);
    res.status(200).send(tag);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});
/////////////UPDATE///////////////
router.put("/user/tag", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    tagCheck(req.body);

    const tag = await Tag.findOneAndUpdate(
      { _id: req.body._id, owner: req.authId },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).send(tag);
  } catch (e) {
    console.log(e);

    res.status(500).send();
  }
});
////////////DELETE////////////////
router.delete("/user/tag/:id", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    console.log(req.authId);
    console.log(req.params.id);

    const tag = await Tag.deleteOne({
      _id: req.params.id,
      owner: req.authId,
    });
    res.status(200).send("Deleted");
    console.log(tag);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});
module.exports = router;
