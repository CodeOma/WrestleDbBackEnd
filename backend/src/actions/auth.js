const admin = require("../auth/firebase");

const makeUserAdmin = async (req, res) => {
  const { userId } = req.body; // userId is the firebase uid for the user

  await admin.auth().setCustomUserClaims(userId, { admin: true });

  return res.send({ message: "Success" });
};

const createUser = async (req, res) => {
  const {
    email,
    phoneNumber,
    password,
    firstName,
    lastName,
    photoUrl,
  } = req.body;

  const user = await admin.auth().createUser({
    email,
    phoneNumber,
    password,
    displayName: `${firstName} ${lastName}`,
    photoURL: photoUrl,
  });

  return res.send(user);
};

exports.makeUserAdmin = makeUserAdmin;
exports.createUser = createUser;
