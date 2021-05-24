const Match = require("../db/models/match");
const Tag = require("../db/models/");

// // Need to research if 2 models vs 1 model and make private


const Tags = ["Arm-Drag",
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
]


const create = async () =>{
    const create = await 
}

{/* <Grid xs={6} style={tags ? styles.list : {}}> */}
{/* <Grid xs={12} className='px-1' style={{}}>
{timestamp.takedown.offdef === "Offensive" &&
timestamp.takedown.position === "Standing" && (
<Select
  state={timestamp.takedown}
  fn={setTimestamp}
  name={"setup"}
  onChange={onSelectorChange}
  options={[
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
  ]}
  label={"Setup/Tags"}
/>
)}
<div style={styles.list}>
{tags && (
<ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
  {tags.map(tag => (
    <li>
      {" "}
      <Button onClick={() => removeTag(tag)}>{tag}</Button>
    </li>
  ))}
</ul>
)}
</div>
</Grid> */}
<Grid xs={12} md={6} container direction='column'>
{timestamp.takedown.offdef === "Offensive" &&
timestamp.takedown.position === "Standing" ? (
<>
<Select
  state={timestamp.takedown}
  fn={setTimestamp}
  name={"type"}
  onChange={onSelectorChange}
  options={["Lower-Body", "Upper-Body", "Throw", "Other"]}
  label={"type"}
/>
<Select
  state={timestamp.takedown}
  fn={setTimestamp}
  name={"takedown"}
  onChange={onSelectorChange}
  options={
    timestamp.takedown.type === "Upper-Body"
      ? [
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
        ]
      : timestamp.takedown.type === "Lower-Body"
      ? [
          "Single Leg",
          "Double Leg",
          "High-Crotch",
          "Outside-Step High-Crotch",
          "Outside-Reach High-Crotch",
          "Other Legshot",
          "Ankle-pick",
          "Scramble",
          "Low-Single",
          "Counter",

          "Head-outside Low-Single",
          "Foot Sweep",
        ]
      : timestamp.takedown.type === "Throw"
      ? [
          "Inside-Trip",
          "Fireman's",
          "Outside Fireman's",
          "Shoulder-Throw",
          "Headlock",
          "OverUnder",
          "Front-headlock",
          "Other Throw",
        ]
      : ["Other"]
  }
  label={"Scoring"}
/>
</>
) : timestamp.takedown.offdef === "Offensive" &&
timestamp.takedown.position === "Ground" ? (
<>
<Select
  state={timestamp.takedown}
  fn={setTimestamp}
  name={"takedown"}
  onChange={onSelectorChange}
  options={[
    "Cross Ankles",
    "Gut Wrench",
    "High gutwrench",
    "Low gutwrench",
    "Ground Other",
    "Takedown Turn",
  ]}
  label={"Scoring"}
/>
</>
) : (
<>
<Select
  state={timestamp.takedown}
  fn={setTimestamp}
  name={"takedown"}
  onChange={onSelectorChange}
  options={
    timestamp.takedown.offdef === "Other"
      ? [
          "Caution",
          "Passivity(Shot-Clock)",
          "Denied Challenge",
        ]
      : [
          "Go behind",
          "Chestwrap",
          "Tilts",
          "Far Ankle",
          "Front Headlock",
          "Counter",
          "Scramble",
          "Step Over",
        ]
  }
  label={"Scoring"}
/>
{timestamp.takedown.offdef !== "Other" && (
  <Select
    state={timestamp.takedown}
    fn={setTimestamp}
    name={"oppDefendedShot"}
    onChange={onSelectorChange}
    options={[
      "Push-out",
      "Underhook-Throwby",
      "Go behind",
      "Front Headlock",
      "Slide-by",

      "Single Leg",
      "Double Leg",
      "High-Crotch",
      "Outside-Step High-Crotch",
      "Ankle-pick",
      "Scramble",
      "Low-Single",
      "Counter",
      "Head-outside Low-Single",

      "Inside-Trip",
      "Fireman's",
      "Outside Fireman's",
      "Shoulder-Throw",
      "Headlock",
      "OverUnder",
      "Front-headlock",
      "Step Over",
      "Other Throw",