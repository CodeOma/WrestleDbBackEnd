const mongoose = require("mongoose");

const wrestlerSchema = mongoose.Schema({
  fullName: { type: String, required: true },
  lastName: { type: String, required: true },
  team: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const UserWrestler = mongoose.model("UserWrestler", wrestlerSchema);

module.exports = UserWrestler;
