// router.patch("/tasks/:id", auth, async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["description", "completed"];
//   const isValidOperation = updates.every(update =>
//     allowedUpdates.includes(update)
//   );

//   if (!isValidOperation) {
//     return res.status(400).send({ error: "Invalid updates!" });
//   }

//   try {
//     const task = await Task.findOne({
//       _id: req.params.id,
//       creator: req.user._id,
//     });

//     if (!task) {
//       return res.status(404).send();
//     }

//     updates.forEach(update => (task[update] = req.body[update]));
//     await task.save();
//     res.send(task);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });
// // router.patch("/tasks/:id", auth, async (req, res) => {
// //   const updates = Object.keys(req.body);
// //   const allowedUpdates = ["description", "completed"];
// //   const isValidOperation = updates.every(update =>
// //     allowedUpdates.includes(update)
// //   );

// //   if (!isValidOperation) {
// //     return res.status(400).send({ error: "invalid update parameter" });
// //   }

// //   try {
// //     const task = await Task.findOne({
// //       _id: req.params.id,
// //       creator: req.user._id,
// //     });

// //     if (!task) {
// //       res.status(404).send();
// //     }
// //     // const task = await Task.findByIdAndUpdate(req.params.id);
// //     updates.forEach(update => {
// //       user[update] = req.body[update];
// //     });

// //     await task.save();
// //     // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
// //     //   new: true,
// //     //   runValidators: true,
// //     // });
// //     res.status(200).send(task);
// //   } catch (e) {
// //     res.status(400).send(e);
// //   }
// // });

// router.delete("/tasks/:id", auth, async (req, res) => {
//   try {
//     const task = await Task.findOneAndDelete({
//       _id: req.params.id,
//       creator: req.user._id,
//     });

//     if (!task) {
//       return res.status(404).send();
//     }
//     res.status(200).send(task);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

const express = require("express");
const router = new express.Router();

//create User

// router.put("/signup", async (req, res) => {
//   try {
//     const user = await User.findOneAndUpdate(
//       {
//         email: req.body.email,
//         username: req.body.username,
//       },
//       {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         auth: 1,
//       },
//       { upsert: true, new: true, setDefaultsOnInsert: true },
//       function (error, result) {
//         if (error) console.log(error);
//       }
//     );
//     const userData = await user;

//     const userCreate = await admin.auth().createUser({
//       uid: userData._id,
//       email: userData._id,
//       password: userData.password,
//       auth: 1,
//     });
//     res.send("Successfully created new user:", userRecord.uid);
//   } catch (e) {
//     res.status(400).send();
//   }
// });

router.post("/signup", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        email: req.body.email,
        username: req.body.username,
      },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        auth: 1,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
      function (error, result) {
        if (error) console.log(error);
      }
    );
    const userData = await user;

    // const userCreate = await admin.auth().createUser({
    //   uid: userData._id,
    //   email: userData._id,
    //   password: userData.password,
    //   auth: 1,
    // });
    res.send("Successfully created new user:", userRecord.uid);
  } catch (e) {
    res.status(400).send();
  }
});

// router.get("/signin", async (req, res) => {
//   firebase
//     .auth()
//     .signInWithEmailAndPassword(req.body.email, req.body.password)
//     .then(function () {
//       firebase
//         .auth()
//         .currentUser.getIdToken(true)
//         .then(function (idToken) {
//           res.send(idToken);
//           res.end();
//         })
//         .catch(function (error) {
//           //Handle error
//         });
//     })
//     .catch(function (error) {
//       //Handle error
//     });
// });
// module.exports = router;

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
