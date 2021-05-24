const express = require("express");
const router = new express.Router();
const { UserTakedown } = require("../../db/models/usermodels/usertakedown");
const { checkIfAuthenticated, checkIfAdmin } = require("../../middleware/auth");

// TAKEDOWN

////////////PUT (UPDATE/CREATE)//////////////
router.post("/user/takedown", checkIfAuthenticated, async (req, res) => {
  try {
    console.log(req.body);
    if (
      req.body.takedown !== "" &&
      req.body.offdef !== "" &&
      req.body.position !== "" &&
      req.body.category !== "" &&
      req.body.type !== "" &&
      req.authId
    ) {
      const takedown1 = await UserTakedown.findOneAndUpdate(
        {
          takedown: req.body.takedown,
          offdef: req.body.offdef,
          position: req.body.position,
          category: req.body.category,
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
    } else {
      throw new Error("Invalid Wreslter Format");
    }
  } catch (e) {
    res.status(500).send();
  }
});

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
      const takedown = await UserTakedown.find(query)
        .sort({ date: -1 })
        .limit(10);

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

    const takedown = await UserTakedown.find({ owner: req.authId });
    res.status(200).send(takedown);
  } catch (e) {
    res.status(500).send();
  }
});
router.get("/user/takedown/:id", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const takedown = await UserTakedown.find({
      _id: req.params.id,
    });
    console.log(takedown);
    res.status(200).send(takedown);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});
/////////////UPDATE///////////////
router.put("/user/takedown", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    console.log(req.authId);

    console.log(req.params);
    console.log(req.body);

    const takedown = await UserTakedown.findOneAndUpdate(
      { _id: req.body._id, owner: req.authId },
      req.body,
      {
        new: true,
      }
    );
    console.log(takedown);
    res.status(200).send(takedown);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});
////////////DELETE////////////////
router.delete(
  "/user/takedown/user/:id",
  checkIfAuthenticated,
  async (req, res) => {
    try {
      //Validation
      console.log(req.params);
      console.log(req.body);

      const takedown = await UserTakedown.findOneAndDelete(
        { _id: req.params.id, owner: req.authId },
        req.body,
        {
          new: true,
        }
      );
      console.log(match);
    } catch (e) {
      res.status(500).send();
    }
  }
);
module.exports = router;
