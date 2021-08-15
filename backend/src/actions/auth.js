const { admin } = require("../auth/firebase");

// const makeUserAdmin = async (req, res) => {
//   const { userId } = req.body; // userId is the firebase uid for the user

//   await admin.auth().setCustomUserClaims(userId, { admin: true });

//   return res.send({ message: "Success" });
// };

const createUser = async (req, res) => {
  const { email, phoneNumber, password, firstName, lastName } = req.body;

  const user = await admin.auth().createUser({
    email,
    phoneNumber,
    password,
    displayName: `${firstName} ${lastName}`,
    // photoURL: photoUrl,
  });

  return user;
};
// const makeUserAdmin = async (req, res) => {
//   try {
//     const { userId } = req.body; // userId is the firebase uid for the user

//     const adminUser = await admin
//       .auth()
//       .setCustomUserClaims(userId, { admin: true });
//     console.log(adminUser);
//     return res.send({ message: "Success" });
//   } catch (e) {
//     console.log(e);
//   }
// };
// makeUserAdmin({ body: { userId: "8NKUw1IFuQPuKm0fVnF2Y8mYqet1" } });
// exports.makeUserAdmin = makeUserAdmin;
exports.createUser = createUser;
