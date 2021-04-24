const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const Task = require("./task");
const userSchema = mongoose.Schema({
  userInfo: {
    username: {
      type: String,
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
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("password cant contain password");
        }
      },
    },
  },
  // settings: {
  //   language: "EN",
  //   darkMode: {},
  // },

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// userSchema.virtual("tasks", {
//   ref: "Task",
//   localField: "_id",
//   foreignField: "creator",
// });
//saved to methods, can be called of the instances
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  //is you get back is object so need to stringify to use with jwt
  const token = jwt.sign({ _id: user._id.toString() }, "BJBADJADYEWICNMB");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
//to json gets called when res. sends something, becuase it stringifies
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};
//saved to statics so it can be called from object
//statics available on the model
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to Login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};
///pre before save, post after save
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 8);
  next(); //run next so it ends
});

//middle ware delete all tasks when user deleted
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
