const jwt = require("jsonwebtoken");
const User = require("../db/models/user");

// let authorized = true;

// function checkAuth(req, res, next) {
//   if (authorized) {
//     next()
//   } else {
//     res.status(403).send('Unauthorized!')
//     return
//   }
// }

// app.use('/', checkAuth)

const auth = async (req, res, next) => {
  try {
    //need to get token from req header
    //need to remove Bearer so it is just token for authentication
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log(token);

    const decoded = jwt.verify(token, "BJBADJADYEWICNMB");
    console.log(decoded);
    //check if user has that token in there tokens
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;

    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

// module.exports = auth;

// const auth = async (req, res, next) => {
//   try {
//     const token = req.header("Authorization").replace("Bearer ", "");
//     const decoded = jwt.verify(token, "thisismynewcourse");
//     const user = await User.findOne({
//       _id: decoded._id,
//       "tokens.token": token,
//     });

//     if (!user) {
//       throw new Error();
//     }

//     req.token = token;
//     req.user = user;
//     next();
//   } catch (e) {
//     res.status(401).send({ error: "Please authenticate." });
//   }
// };

module.exports = auth;
