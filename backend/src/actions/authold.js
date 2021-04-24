// const User = require("../db/models/user");
const { firebase } = require("../auth/firebase");
const admin = require("firebase-admin");

const signup = (req, res) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then(function () {
      firebase
        .auth()
        .currentUser.getIdToken(true)
        .then(function (idToken) {
          res.send(idToken);
          res.end();
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      //Handle error
    });
};

const login = (req, res) => {
  // const userInfo = {
  //     email: "example@exapmle.com",
  //     password: "example"
  // }
  firebase
    .auth()
    .signInWithEmailAndPassword(
      /*userInfo.email, userInfo.password*/ req.body.email,
      req.body.password
    )
    .then(function () {
      firebase
        .auth()
        .currentUser.getIdToken(true)
        .then(function (idToken) {
          res.send(idToken);
          res.end();
        })
        .catch(function (error) {
          //Handle error
        });
      // admin.auth().createCustomToken(uid)
      //     .then(function (customToken) {
      //         res.send(customToken)
      //         res.end()
      //     })
      //     .catch(function (error) {
      //         console.log('Error creating custom token:', error);
      //     });
    })
    .catch(function (error) {
      //Handle error
    });
};

const logout = (req, res) => {
  firebase
    .auth()
    .signOut()
    .then(function () {
      res.send(null);
      res.end();
    })
    .catch(function (error) {
      //Handle error
    });
};

const isAuth = (req, res) => {
  var user = firebase.auth().currentUser;
  if (user) {
    user
      .getIdToken(true)
      .then(function (idToken) {
        res.send(idToken);
        res.end();
      })
      .catch(function (error) {
        // Handle error
      });
  } else {
    //Handle error
  }
};

const userBasedFunc = (req, res) => {
  //logs user id
  console.log(req.user);
};

exports.login = login;
exports.logout = logout;
exports.signup = signup;
exports.isAuth = isAuth;
exports.userBasedFunc = userBasedFunc;
