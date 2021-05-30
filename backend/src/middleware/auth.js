const { admin } = require("../auth/firebase");
const User = require("../db/models/user");
const getAuthToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else {
    req.authToken = null;
  }
  next();
};

const checkIfAuthenticated = (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await admin.auth().verifyIdToken(authToken);
      const fetchUser = await User.findOne({ userId: userInfo.uid });
      req.authId = fetchUser._id;
      return next();
    } catch (e) {
      return res
        .status(401)
        .send({ error: "You are not authorized to make this request" });
    }
  });
};

const checkIfAdmin2 = (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await admin.auth().verifyIdToken(authToken);

      if (userInfo.admin === true) {
        req.authId = userInfo.uid;
        return next();
      }

      throw new Error("unauthorized");
    } catch (e) {
      return res
        .status(401)
        .send({ error: "You are not authorized to make this request" });
    }
  });
};
const checkIfAdmin = (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await admin.auth().verifyIdToken(authToken);
      const getUser = await User.find({ userId: userInfo.uid });

      if (getUser.role !== 300) {
        return res.status(400).json({
          error: "Admin resource. Access denied",
        });
      }

      if (userInfo.role === 300) {
        req.authId = getUser._id;
        return next();
      }

      throw new Error("unauthorized");
    } catch (e) {
      return res
        .status(401)
        .send({ error: "You are not authorized to make this request" });
    }
  });
};

exports.checkIfAdmin = checkIfAdmin;
exports.checkIfAuthenticated = checkIfAuthenticated;
