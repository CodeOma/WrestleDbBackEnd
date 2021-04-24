const mongoose = require("mongoose");

const wrestlerSchema = mongoose.Schema({
  fullName: { type: String },
  lastName: { type: String },
  team: { type: mongoose.Schema.Types.String, required: true },
});

// wrestlerSchema.methods.generateStats = async function () {
//   const user = this;
//   //is you get back is object so need to stringify to use with jwt
//   const stats = jwt.sign({ _id: user._id.toString() }, "BJBADJADYEWICNMB");
//   user.tokens = user.tokens.concat({ token });
//   await user.save();
//   return stats;
// };
const Wrestler = mongoose.model("Wrestler", wrestlerSchema);

module.exports = Wrestler;

// Person.findOne({ firstname: "Aaron" })
//   .populate("eventsAttended") // only works if we pushed refs to person.eventsAttended
//   .exec(function (err, person) {
//     if (err) return handleError(err);
//     console.log(person);
//   });
