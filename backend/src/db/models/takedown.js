const mongoose = require("mongoose");
const timestampSchema = mongoose.Schema({
  // id: "",
  round: {
    type: Number,
    required: true,
  },
  wrestlerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  fullName: {
    type: String,
    // required: true,
  },
  oppDefendedShot: {
    type: String,
    // required: true,
  },
  takedown: {
    type: String,
  },
  setup: [],
  details: {
    type: String,
  },
  videoTime: {
    type: Number,
    // required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },

  takedown: {
    type: String,
    // required: true,
  },
  position: {
    type: String,
    // required: true,
  },
  type: {
    type: String,
    // required: true,
  },
  offdef: {
    type: String,
    // required: true
  },
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
  offdef: { type: String, required: true },
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
  position: {
    type: String,
    required: true,
    // enum: ["admin", "user", "course"],
  },
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

const Takedown = mongoose.model("Takedown", takedownSchema);
const Position = mongoose.model("Position", positionSchema);
const Tag = mongoose.model("Tag", tagSchema);
const Type = mongoose.model("Type", typeSchema);
const Category = mongoose.model("Category", categorySchema);
const Timestamp = mongoose.model("Timestamp", timestampSchema);

module.exports = {
  timestampSchema,
  Takedown,
  Position,
  Tag,
  Type,
  Category,
  Timestamp,
};
