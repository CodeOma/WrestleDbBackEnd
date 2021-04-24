const express = require("express");
const router = new express.Router();
const User = require("../db/models/user");
const { checkIfAuthenticated, checkIfAdmin } = require("../middleware/auth");

const { createUser } = require("../actions/auth");
router.put("/auth/signup", createUser);

// module.exports = router;
