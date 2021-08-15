require("firebase/auth");
const admin = require("firebase-admin");
const firebase = require("firebase");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

const serviceInfo = {
  type: process.env.FB_TYPE,
  project_id: process.env.FB_PROJECT_ID,
  private_key_id: process.env.FB_PRIVATE_KEY_ID,
  // private_key: process.env.FB_PRIVATE_KEY,
  private_key: process.env.FB_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FB_CLIENT_EMAIL,
  client_id: process.env.FB_CLIENT_ID,
  auth_uri: process.env.FB_AUTH_URI,
  token_uri: process.env.FB_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FB_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FB_CLIENT_X509_CERT_URL,
};
admin.initializeApp({
  credential: admin.credential.cert(serviceInfo),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

module.exports = { firebase, admin };

// require("firebase/auth");
// const admin = require("firebase-admin");
// const firebase = require("firebase");
// const serviceAccount = require("../../keys.json");

// const firebaseConfig = {
//   apiKey: "AIzaSyBL8nsWGFcj8qBe70OQYCfN25FykRdMPGY",
//   authDomain: "wrestling-stats.firebaseapp.com",
//   projectId: "wrestling-stats",
//   storageBucket: "wrestling-stats.appspot.com",
//   messagingSenderId: "623977862518",
//   appId: "1:623977862518:web:12acdb36aa08f8fc791657",
//   measurementId: "G-1PZ81R4GGF",
// };

// firebase.initializeApp(firebaseConfig);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://wrestling-stats-default-rtdb.firebaseio.com",
// });

// module.exports = { firebase, admin };
