const express = require("express");
require("./auth/firebase");
require("./db/mongoose.js");
// const { fbAuthMW } = require("./auth/firebase");

///
const Wrestler = require("./db/models/wrestler");
const Match = require("./db/models/match");
const { correctDups } = require("./management/management");
///
const userRouter = require("./routers/user");
const matchRouter = require("./routers/match");
const wrestlerRouter = require("./routers/wrestler");
const teamRouter = require("./routers/team");
const tournamentRouter = require("./routers/tournament");
const statsRouter = require("./routers/stats");
const techniqueRouter = require("./routers/techniques");

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
//app.use(userRouter);
app.use(matchRouter);
app.use(statsRouter);
app.use(tournamentRouter);
app.use(teamRouter);
app.use(wrestlerRouter);
app.use(techniqueRouter);
// correctDups();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
