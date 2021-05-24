const express = require("express");
const router = new express.Router();
const { UserCategory } = require("../../db/models/usermodels/usertakedown");
const { checkIfAuthenticated, checkIfAdmin } = require("../../middleware/auth");

// TAKEDOWN

////////////PUT (UPDATE/CREATE)//////////////
router.post("/user/category", checkIfAuthenticated, async (req, res) => {
  try {
    console.log(req.body, "yeet");
    // console.log(req.body.category);
    // console.log(req.body._id);

    if (req.body.category !== "" && req.authId) {
      const category1 = await UserCategory.findOneAndUpdate(
        {
          category: req.body.category,
          owner: req.authId,
        },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (error, result) {
          if (error) console.log(error);
        }
      );
      res.status(200).send(category1);
      // console.log(category1);
    } else {
      throw new Error("Invalid category Format");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

//////////Search Autocomple////
router.get(
  "/user/autosearch/category/:key",
  checkIfAuthenticated,
  async (req, res) => {
    try {
      let q = req.params.key;
      let query = {
        $or: [{ category: { $regex: q, $options: "i" }, owner: req.authId }],
      };
      const category = await UserCategory.find(query)
        .sort({ date: -1 })
        .limit(10);

      if (!category) {
        return res.status(404).send();
      }
      const array = await category.map(wres => {
        return { title: wres.fullName, id: wres._id };
      });
      res.send(array);
    } catch (error) {
      res.status(500).send;
    }
  }
);

////////////Get ALL FOR CREATOR//////////////
router.get("/user/category/all", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation

    const category = await UserCategory.find({ owner: req.authId });
    res.status(200).send(category);
  } catch (e) {
    res.status(500).send();
  }
});
/////////////UPDATE///////////////
router.put("/user/category", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    const category = await UserCategory.findOneAndUpdate(
      { _id: req.body._id, owner: req.authId },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).send(category);
  } catch (e) {
    console.log(e);

    res.status(500).send();
  }
});
////////////DELETE////////////////
router.delete("/user/category/:id", checkIfAuthenticated, async (req, res) => {
  try {
    //Validation
    console.log(req.authId);
    console.log(req.params.id);

    const category = await UserCategory.deleteOne({
      _id: req.params.id,
      owner: req.authId,
    });
    console.log(category);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});
module.exports = router;
