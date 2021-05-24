const express = require("express");
const router = new express.Router();
const { UserPosition } = require("../../db/models/usermodels/usertakedown");
const { checkIfAuthenticated, checkIfAdmin } = require("../../middleware/auth");

// TAKEDOWN

////////////PUT (UPDATE/CREATE)//////////////
router.post("/user/position", checkIfAuthenticated, async (req, res) => {
  try {
    console.log(req.body, "yeet");
    // console.log(req.body.position);
    // console.log(req.body._id);

    if (req.body.position !== "" && req.authId) {
      const position1 = await UserPosition.findOneAndUpdate(
        {
          position: req.body.position,
          owner: req.authId,
        },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (error, result) {
          if (error) console.log(error);
        }
      );
      res.status(200).send(position1);
      // console.log(position1);
    } else {
      throw new Error("Invalid position Format");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send();
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
      const position = await UserPosition.find(query)
        .sort({ date: -1 })
        .limit(10);

      if (!position) {
        return res.status(404).send();
      }
      const array = await position.map(wres => {
        return { title: wres.fullName, id: wres._id };
      });
      res.send(array);
    } catch (error) {
      res.status(500).send;
    }
  }
);

////////////Get ALL FOR CREATOR//////////////
router.get("/user/position/all", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const position = await UserPosition.find({ owner: req.authId });
    res.status(200).send(position);
  } catch (e) {
    res.status(500).send();
  }
});
/////////////UPDATE///////////////
router.put("/user/position", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    const position = await UserPosition.findOneAndUpdate(
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
    console.log(req.authId);
    console.log(req.params.id);

    const position = await UserPosition.deleteOne({
      _id: req.params.id,
      owner: req.authId,
    });
    console.log(position);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});
module.exports = router;
