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
});

teamSchema.virtual("wrestlers", {
  ref: "Wrestler",
  localField: "teamName",
  foreignField: "team",
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
