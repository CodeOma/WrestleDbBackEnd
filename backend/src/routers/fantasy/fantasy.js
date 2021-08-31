const express = require("express");
const router = new express.Router();
const FantasySelection = require("../../db/models/fantasy");
const { checkIfAuthenticated, checkIfAdmin } = require("../../middleware/auth");

// TAKEDOWN

////////////PUT (UPDATE/CREATE)//////////////
router.post("/user/fantasy", checkIfAuthenticated, async (req, res) => {
  try {
    if (req.body.selection !== "" && req.authId) {
      selectionCheck(req.body);
      const selection = await FantasySelection.findOneAndUpdate(
        {
          selection: req.body.selection,
          owner: req.authId,
        },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (error, result) {
          if (error) console.log(error);
        }
      );
      res.status(200).send(selection);

      console.log(selection);
    } else {
      throw new Error("Invalid selection Format");
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

//////////Search Autocomple////
// router.get(
//   "/user/autosearch/selection/:key",
//   checkIfAuthenticated,
//   async (req, res) => {
//     try {
//       let q = req.params.key;
//       let query = {
//         $or: [{ selection: { $regex: q, $options: "i" }, owner: req.authId }],
//       };
//       const selection = await FantasySelection.find(query).sort({ date: -1 }).limit(10);

//       if (!selection) {
//         return res.status(404).send();
//       }
//       const array = await selection.map(t => {
//         return { title: t.selection, id: t._id };
//       });
//       res.send(array);
//     } catch (error) {
//       res.status(500).send;
//     }
//   }
// );

////////////GET//////////////
router.get("/user/fantasy/all", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const selection = await FantasySelection.find({
      $or: [{ owner: req.authId }, { owner: "60a2a5803bb95bbc1c18b767" }],
    });
    res.status(200).send(selection);
  } catch (e) {
    res.status(500).send();
  }
});
router.get("/user/fantasy/:id", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const selection = await FantasySelection.find({
      _id: req.params.id,
    });
    res.status(200).send(selection);
  } catch (e) {
    res.status(500).send(e);
  }
});
/////////////UPDATE///////////////
router.put("/user/fantasy", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    selectionCheck(req.body);

    const selection = await FantasySelection.findOneAndUpdate(
      { _id: req.body._id, owner: req.authId },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).send(selection);
  } catch (e) {
    res.status(500).send(e);
  }
});
////////////DELETE////////////////
router.delete("/user/fantasy/:id", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const selection = await FantasySelection.deleteOne({
      _id: req.params.id,
      owner: req.authId,
    });
    res.status(200).send("Deleted");
  } catch (e) {
    res.status(500).send(e.message);
  }
});
module.exports = router;
