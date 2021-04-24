const mongoose = require("mongoose");

const userteamSchema = mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  //  coaches: {
  //   type: mongoose.Schema.Types.ObjectId,
  //      required: true },
});

teamSchema.virtual("wrestlers", {
  ref: "Wrestler",
  localField: "teamName",
  foreignField: "team",
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
