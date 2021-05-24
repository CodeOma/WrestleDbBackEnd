const express = require("express");
const router = new express.Router();
const User = require("../db/models/user");
const { checkIfAuthenticated, checkIfAdmin } = require("../middleware/auth");

const { createUser } = require("../actions/auth");
router.put("/auth/signup", async (req, res) => {
  try {
    // console.log(req);

    const create = await createUser(req);
    const { email, phoneNumber, password, firstName, lastName } = req.body;

    const user = await User.findOneAndUpdate(
      { userId: create.uid },
      {
        userId: create.uid,

        userInfo: {
          firstName,
          lastName,
          email,
          displayName: "user1" + Math.random(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(200).send("OK");
    console.log(user);
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

module.exports = router;
