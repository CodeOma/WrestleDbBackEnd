const mongoose = require("mongoose");

const wrestlerSchema = mongoose.Schema({
  fullName: { type: String, required: true },
  lastName: { type: String, required: true },
  team: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  private: {
    type: Boolean,
    required: true,
  },
});

const Wrestler = mongoose.model("Wrestler", wrestlerSchema);

module.exports = Wrestler;
