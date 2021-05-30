const Match = require("../db/models/match");
// const Tag = require("../db/models/takedown");
const { Tag, Position, Takedown, Type } = require("../db/models/takedown");
const Tournament = require("../db/models/tournament");
const Wrestler = require("../db/models/wrestler");
const Team = require("../db/models/team");

// // Need to research if 2 models vs 1 model and make private

const Tags = [
  "Arm-Drag",
  "Clearing ties",
  "Collar-Tie",
  "Counter",
  "Elbow-Tie",
  "Fake",
  "From Space",
  "Front Headlock",
  "Inside Tie",
  "Multiple Offensive Attempts",
  "Outside tie",
  "Overtie",
  "Overhook",
  "Over Under",
  "Post",
  "Reach and Go",
  "Snap",
  "Shuck",
  "Slide-by",
  "Wrists",
  "Underhook",
  "2 on 1",
  "By Zone",
];

const createTags = async array => {
  try {
    Promise.all(
      array.map(async t => {
        const c = await Tag.findOneAndUpdate(
          {
            tag: t,
            owner: "60a2a5803bb95bbc1c18b767",
          },
          {},
          { upsert: true, new: true },
          function (error, result) {
            if (error) console.log(error);
          }
        );
        console.log(c);
      })
    );
  } catch (e) {
    console.log(e);
  }
};
//

const offStandingUpper = [
  "Slide-by",
  "Duck Under",
  "Body-Lock",

  "Push-out",
  "Underhook-Throwby",
  "Snap Go behind",
  "Go behind",

  "Front Headlock",
  "Arm-Drag",
  "Shuck",
];

const createTakedown = async array => {
  try {
    Promise.all(
      array.map(async t => {
        const c = await Takedown.create({
          takedown: t,
          offdef: 1,
          position: "Standing",
          // category: req.body.category,
          type: "Upper-Body",
          owner: "60a2a5803bb95bbc1c18b767",
        });
        console.log(c);
      })
    );
  } catch (e) {
    console.log(e);
  }
};

const pos = ["Standing", "Ground", "Other"];
const createPos = async array => {
  try {
    Promise.all(
      array.map(async t => {
        const c = await Position.findOneAndUpdate(
          {
            position: t,
            owner: "60a2a5803bb95bbc1c18b767",
          },
          {},
          { upsert: true, new: true },
          function (error, result) {
            if (error) console.log(error);
          }
        );
        console.log(c);
      })
    );
  } catch (e) {
    console.log(e);
  }
};
// createPos(pos);
const createType = async array => {
  try {
    Promise.all(
      array.map(async t => {
        const c = await Type.create({
          type: t,
          owner: "60a2a5803bb95bbc1c18b767",
          position: "Ground",
        });
        console.log(c);
      })
    );
  } catch (e) {
    console.log(e);
  }
};
// createType(["Ground"]);
const swapOffDef = async () => {
  try {
    const tdarr = await Takedown.find({});
    console.log(tdarr);
    Promise.all(
      tdarr.map(async t => {
        if (t.offdef === "Defense") {
          console.log(t);
          const c = await Takedown.findOneAndUpdate(
            {
              _id: t._id,
            },
            {
              offdef: "Defensive",
            },
            { upsert: true, new: true },
            function (error, result) {
              if (error) console.log(error);
            }
          );
        }
      })
    );
  } catch (e) {
    console.log(e);
  }
};
const addOwnerWrest = async () => {
  try {
    const wdarr = await Wrestler.find({});
    console.log(wdarr);
    Promise.all(
      wdarr.map(async w => {
        const c = await Wrestler.findOneAndUpdate(
          {
            _id: w._id,
          },
          {
            owner: "60a2a5803bb95bbc1c18b767",
            private: false,
          },
          { upsert: true, new: true },
          function (error, result) {
            if (error) console.log(error);
          }
        );
      })
    );
  } catch (e) {
    console.log(e);
  }
};
const addOwnerTourn = async () => {
  try {
    const wdarr = await Tournament.find({});
    console.log(wdarr);
    Promise.all(
      wdarr.map(async w => {
        const c = await Tournament.findOneAndUpdate(
          {
            _id: w._id,
          },
          {
            owner: "60a2a5803bb95bbc1c18b767",
            private: false,
          },
          { upsert: true, new: true },
          function (error, result) {
            if (error) console.log(error);
          }
        );
      })
    );
  } catch (e) {
    console.log(e);
  }
};
const addOwnerTeam = async () => {
  try {
    const wdarr = await Team.find({});
    console.log(wdarr);
    Promise.all(
      wdarr.map(async w => {
        const c = await Team.findOneAndUpdate(
          {
            _id: w._id,
          },
          {
            // owner: "60a2a5803bb95bbc1c18b767",
            private: false,
          },
          { upsert: true, new: true },
          function (error, result) {
            if (error) console.log(error);
          }
        );
      })
    );
  } catch (e) {
    console.log(e);
  }
};
// addOwnerTeam();
const addPositionToType = async () => {
  try {
    const tdarr = await Type.find({});
    console.log(tdarr);
    Promise.all(
      tdarr.map(async t => {
        if (t.type === "Defense") {
          console.log(t);
          const c = await Type.findOneAndUpdate(
            {
              _id: t._id,
            },
            {
              position: "Defense",
            },
            { upsert: true, new: true },
            function (error, result) {
              if (error) console.log(error);
            }
          );
        }
      })
    );
  } catch (e) {
    console.log(e);
  }
};
// addPositionToType();
// addOwnerTourn();
// swapOffDef();
// <Grid xs={12} md={6} container direction='column'>
// {timestamp.takedown.offdef === "Offensive" &&
// timestamp.takedown.position === "Standing" ? (
// <>
// <Select
//   state={timestamp.takedown}
//   fn={setTimestamp}
//   name={"type"}
//   onChange={onSelectorChange}
//   options={}
//   label={"type"}
// />
// <Select
//   state={timestamp.takedown}
//   fn={setTimestamp}
//   name={"takedown"}
//   onChange={onSelectorChange}
//   options={
//     timestamp.takedown.type === "Upper-Body"

//       : timestamp.takedown.type === "Lower-Body"
//       ? [
//           "Single Leg",
//           "Double Leg",
//           "High-Crotch",
//           "Outside-Step High-Crotch",
//           "Outside-Reach High-Crotch",
//           "Other Legshot",
//           "Ankle-pick",
//           "Scramble",
//           "Low-Single",
//           "Counter",

//           "Head-outside Low-Single",
//           "Foot Sweep",
//         ]
//       : timestamp.takedown.type === "Throw"
//       ? [
//           "Inside-Trip",
//           "Fireman's",
//           "Outside Fireman's",
//           "Shoulder-Throw",
//           "Headlock",
//           "OverUnder",
//           "Front-headlock",
//           "Other Throw",
//         ]
//       : ["Other"]
//   }
//   label={"Scoring"}
// />
// </>
// ) : timestamp.takedown.offdef === "Offensive" &&
// timestamp.takedown.position === "Ground" ? (
// <>
// <Select
//   state={timestamp.takedown}
//   fn={setTimestamp}
//   name={"takedown"}
//   onChange={onSelectorChange}
//   options={[
//     "Cross Ankles",
//     "Gut Wrench",
//     "High gutwrench",
//     "Low gutwrench",
//     "Ground Other",
//     "Takedown Turn",
//   ]}
//   label={"Scoring"}
// />
// </>
// ) : (
// <>
// <Select
//   state={timestamp.takedown}
//   fn={setTimestamp}
//   name={"takedown"}
//   onChange={onSelectorChange}
//   options={
//     timestamp.takedown.offdef === "Other"
//       ? [
//           "Caution",
//           "Passivity(Shot-Clock)",
//           "Denied Challenge",
//         ]
//       : [
//           "Go behind",
//           "Chestwrap",
//           "Tilts",
//           "Far Ankle",
//           "Front Headlock",
//           "Counter",
//           "Scramble",
//           "Step Over",
//         ]
//   }
//   label={"Scoring"}
// />
// {timestamp.takedown.offdef !== "Other" && (
//   <Select
//     state={timestamp.takedown}
//     fn={setTimestamp}
//     name={"oppDefendedShot"}
//     onChange={onSelectorChange}
//     options={[
//       "Push-out",
//       "Underhook-Throwby",
//       "Go behind",
//       "Front Headlock",
//       "Slide-by",

//       "Single Leg",
//       "Double Leg",
//       "High-Crotch",
//       "Outside-Step High-Crotch",
//       "Ankle-pick",
//       "Scramble",
//       "Low-Single",
//       "Counter",
//       "Head-outside Low-Single",

//       "Inside-Trip",
//       "Fireman's",
//       "Outside Fireman's",
//       "Shoulder-Throw",
//       "Headlock",
//       "OverUnder",
//       "Front-headlock",
//       "Step Over",
//       "Other Throw",
