const express = require("express");
const router = new express.Router();
const UserWrestler = require("../../db/models/usermodels/userwrestler");
const { checkIfAuthenticated, checkIfAdmin } = require("../../middleware/auth");
const { errorHandler } = require("../../helpers/errorhandling");

// const auth = require("../middleware/auth");

////////BY WEIGHTCLASS////////

// router.get("/user/wrestler", checkIfAuthenticated, async (req, res) => {
//   try {
//     const wrestler = await UserWrestler.find({ owner: req.authId });
//     res.status(200).send(wrestler);
//   } catch (e) {
//     res.status(400).send();
//   }
// });
// router.get("/user/wrestler/:id", checkIfAuthenticated, async (req, res) => {
//   try {
//     const wrestler = await UserWrestler.find({ _id: req.params.id });
//     res.status(200).send(wrestler);
//   } catch (e) {
//     res.status(400).send();
//   }
// });

// router.get(
//   "/user/wrestler/weightclass/:id",
//   checkIfAuthenticated,
//   async (req, res) => {
//     try {
//       const wrestler = await UserWrestler.find({
//         weightClass: req.params.weightclass,
//         owner: req.authId,
//       });
//       res.status(200).send(wrestler);
//     } catch (e) {
//       res.status(400).send();
//     }
//   }
// );
// router.get(
//   "/user/wrestler/team/:team",
//   checkIfAuthenticated,
//   async (req, res) => {
//     try {
//       console.log(req.params.team);
//       const wrestler = await UserWrestler.find({
//         team: req.params.team.toUpperCase(),
//         owner: req.authId,
//       });
//       res.status(200).send(wrestler);
//     } catch (e) {
//       res.status(400).send();
//     }
//   }
// );

////////////PUT (UPDATE/CREATE)//////////////
router.post("/user/wrestler", checkIfAuthenticated, async (req, res) => {
  try {
    if (
      req.body.fullName !== "" &&
      req.body.lastName !== "" &&
      req.body.team !== ""
    ) {
      const wrestler1 = await UserWrestler.findOneAndUpdate(
        {
          fullName: req.body.fullName,
          lastName: req.body.lastName,
          team: req.body.team,
          owner: req.authId,
        },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (error, result) {
          if (error) console.log(error);
        }
      );
      console.log(wrestler1);
    }
    // else {
    //   throw new Error("Invalid Wreslter Format");
    // }
  } catch (e) {
    console.log("yeeeeeet", errorHandler(e));
    res.status(500).send();
  }
});

//////////Search Autocomple////
router.get(
  "/user/autosearch/wrestler/:key",
  checkIfAuthenticated,
  async (req, res) => {
    try {
      let q = req.params.key;
      let query = {
        $and: [
          { $or: [{ fullName: { $regex: q, $options: "i" } }] },
          { owner: req.authId },
        ],
      };
      const wrestler = await UserWrestler.find(query)
        .sort({ date: -1 })
        .limit(10);

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
  }
);

////////////Get ALL FOR CREATOR//////////////
router.get("/user/wrestler/all", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    console.log(req.authId);
    const wrestler = await UserWrestler.find({ owner: req.authId });
    res.status(200).send(wrestler);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

/////////////UPDATE///////////////

router.put("/user/wrestler", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    const wrestler = await UserWrestler.findOneAndUpdate(
      { _id: req.body._id, owner: req.authId },
      req.body,
      {
        new: true,
      }
    );
    console.log(wrestler);
  } catch (e) {
    res.status(500).send();
  }
});
////////////DELETE////////////////

router.delete("/user/wrestler/:id", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    console.log(req.params);
    console.log(req.body);

    const wrestler = await UserWrestler.deleteOne({
      _id: req.params.id,
      owner: req.authId,
    });
    console.log(wrestler);
  } catch (e) {
    res.status(500).send();
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
