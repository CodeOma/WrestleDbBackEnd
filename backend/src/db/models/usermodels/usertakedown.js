const mongoose = require("mongoose");
const timestampSchema = mongoose.Schema({
  id: "",
  round: "",
  wrestlerId: "",
  oppDefendedShot: "",
  type: "",
  setup: [],
  details: "",
  videoTime: 0,
  time: 0,
  points: 0,
});
const takedownSchema = mongoose.Schema({
  takedown: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
    // enum: ["admin", "user", "course"],
  },
  type: {
    type: String,
    required: true,
    // enum: ["admin", "user", "course"],
  },
  category: {
    type: String,
    required: true,
    enum: ["offensive", "defensive", "other"],
  },
  offdef: {
    type: String,
    required: true,
    enum: ["offensive", "defensive", "other"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const tagSchema = mongoose.Schema({
  tag: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const typeSchema = mongoose.Schema({
  type: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});
const positionSchema = mongoose.Schema({
  position: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});
const pointsSchema = mongoose.Schema({
  points: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});
const categorySchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const UserTakedown = mongoose.model("UserTakedown", takedownSchema);
const UserPosition = mongoose.model("UserPosition", positionSchema);
const UserTag = mongoose.model("UserTag", tagSchema);
const UserType = mongoose.model("UserType", typeSchema);
const UserCategory = mongoose.model("UserCategory", categorySchema);

module.exports = {
  UserTakedown,
  UserType,
  UserPosition,
  UserTag,
  UserCategory,
};
