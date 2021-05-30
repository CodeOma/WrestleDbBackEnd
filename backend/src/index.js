const express = require("express");
require("./auth/firebase");
require("./db/mongoose.js");

require("./management/turnOldtoId.js");
///
const Wrestler = require("./db/models/wrestler");
const Match = require("./db/models/match");
// const { correctDups } = require("./management/management");
// require("./management/management");
const userRouter = require("./routers/user");
const matchRouter = require("./routers/match");
//takedowns//
const takedownRouter = require("./routers/takedowns/takedowns");
const typeRouter = require("./routers/takedowns/type");
const tagRouter = require("./routers/takedowns/tag");
const positionRouter = require("./routers/takedowns/position");
// const categoryRouter = require("./routers/takedowns/category");
// fixMatches();
//Public Data//
const wrestlerRouter = require("./routers/wrestler");
const teamRouter = require("./routers/team");
const tournamentRouter = require("./routers/tournament");
const statsRouter = require("./routers/stats");
const techniqueRouter = require("./routers/techniques");
//End User Management///
const cors = require("cors");
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});
// const { login, userBasedFunc } = require("./user");
// app.post("/login", login);
// app.get("/userBasedFunc", fbAuth, userBasedFunc);

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(matchRouter);
app.use(statsRouter);
app.use(tournamentRouter);
app.use(teamRouter);
app.use(wrestlerRouter);
app.use(techniqueRouter);

app.use(takedownRouter);
app.use(typeRouter);
app.use(tagRouter);
app.use(positionRouter);
// app.use(categoryRouter);

// correctDups();

const port = process.env.PORT || 5000;


app.listen(port, () => {
  console.log(`listening on ${port}`);
});
