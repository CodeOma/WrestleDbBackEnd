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
  private: {
    type: Boolean,
  },
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
