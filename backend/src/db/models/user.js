const mongoose = require("mongoose");
const validator = require("validator");

// const Task = require("./task");
const userSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true, //trims any extra spaces
  },
  role: {
    type: Number,
    default: 0,
  },
  userInfo: {
    displayName: {
      type: String,
      unique: true,
      required: true,
      trim: true, //trims any extra spaces
    },
    firstName: {
      type: String,
      required: true,
      trim: true, //trims any extra spaces
    },
    lastName: {
      type: String,
      required: true,
      trim: true, //trims any extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is invalid");
        }
      },
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
