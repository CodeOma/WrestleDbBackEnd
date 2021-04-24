const mongoose = require("mongoose");

const takedownSchema = mongoose.Schema({
  takedown: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
    enum: ["admin", "user", "course"],
  },
  type: {
    type: String,
    required: true,
    enum: ["admin", "user", "course"],
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
  type: String,
  required: true,
});
const positionSchema = mongoose.Schema({
  type: String,
  required: true,
});
