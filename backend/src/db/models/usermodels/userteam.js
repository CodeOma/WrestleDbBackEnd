const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
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

const UserTeam = mongoose.model("UserTeam", teamSchema);

module.exports = UserTeam;
