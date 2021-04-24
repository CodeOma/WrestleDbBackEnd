const { admin } = require("../auth/firebase");

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
      console.log(userInfo);

      req.authId = userInfo.uid;
      return next();
    } catch (e) {
      console.log(e);
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
exports.checkIfAdmin = checkIfAdmin;
exports.checkIfAuthenticated = checkIfAuthenticated;
