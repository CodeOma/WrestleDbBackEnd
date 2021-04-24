require("firebase/auth");
const admin = require("firebase-admin");
const firebase = require("firebase");
const serviceAccount = require("../../keys.json");

const firebaseConfig = {
  apiKey: "AIzaSyBL8nsWGFcj8qBe70OQYCfN25FykRdMPGY",
  authDomain: "wrestling-stats.firebaseapp.com",
  projectId: "wrestling-stats",
  storageBucket: "wrestling-stats.appspot.com",
  messagingSenderId: "623977862518",
  appId: "1:623977862518:web:12acdb36aa08f8fc791657",
  measurementId: "G-1PZ81R4GGF",
};

firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wrestling-stats-default-rtdb.firebaseio.com",
});

module.exports = { firebase, admin };

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const fbAuthMW = (req, res, next) => {
//   const token = req.header("Authorization").replace("Bearer", "").trim();
//   var user = firebase.auth().currentUser;
//   if (user) {
//     admin
//       .auth()
//       .verifyIdToken(token)
//       .then(function (decodedToken) {
//         if (decodedToken.uid === user.uid) {
//           req.user = user.uid;
//           return next();
//         }
//       })
//       .catch(function (error) {
//         //Handle error
//       });
//   } else {
//     console.log("There is no current user.");
//   }
// };

// exports.fbAuthMW = fbAuthMW;

//create User

// admin
//   .auth()
//   .createUser({
//     uid: "some-uid",
//     email: "user@example.com",
//     phoneNumber: "+11234567890",
//   })
//   .then(userRecord => {
//     // See the UserRecord reference doc for the contents of userRecord.
//     console.log("Successfully created new user:", userRecord.uid);
//   })
//   .catch(error => {
//     console.log("Error creating new user:", error);
//   });

// update user
// admin
//   .auth()
//   .updateUser(uid, {
//     email: 'modifiedUser@example.com',
//     phoneNumber: '+11234567890',
//     emailVerified: true,
//     password: 'newPassword',
//     displayName: 'Jane Doe',
//     photoURL: 'http://www.example.com/12345678/photo.png',
//     disabled: true,
//   })
//   .then((userRecord) => {
//     // See the UserRecord reference doc for the contents of userRecord.
//     console.log('Successfully updated user', userRecord.toJSON());
//   })
//   .catch((error) => {
//     console.log('Error updating user:', error);
//   });

//delete user
// admin
//   .auth()
//   .deleteUser(uid)
//   .then(() => {
//     console.log('Successfully deleted user');
//   })
//   .catch((error) => {
//     console.log('Error deleting user:', error);
//   });

//delete multiple
// admin
//   .auth()
//   .deleteUsers([uid1, uid2, uid3])
//   .then((deleteUsersResult) => {
//     console.log(`Successfully deleted ${deleteUsersResult.successCount} users`);
//     console.log(`Failed to delete ${deleteUsersResult.failureCount} users`);
//     deleteUsersResult.errors.forEach((err) => {
//       console.log(err.error.toJSON());
//     });
//   })
//   .catch((error) => {
//     console.log('Error deleting users:', error);
//   });

// const userId = 'some-uid';
// const additionalClaims = {
//   premiumAccount: true,
// };

// admin
//   .auth()
//   .createCustomToken(userId, additionalClaims)
//   .then((customToken) => {
//     // Send token back to client
//   })
//   .catch((error) => {
//     console.log('Error creating custom token:', error);
//   });

// firebase.auth().signInWithCustomToken(token)
//   .then((userCredential) => {
//     // Signed in
//     var user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // ...
//   });
