require("dotenv").config();

const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {

  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

module.exports = app;

  /*apiKey: "AIzaSyC18KpVUjpNjyls1QwF3CvwrQU6AWkM8C0",
  authDomain: "condor-6efb0.firebaseapp.com",
  projectId: "condor-6efb0",
  storageBucket: "condor-6efb0.appspot.com",
  messagingSenderId: "458629740401",
  appId: "1:458629740401:web:d436d16e9a989762a8a8d0",
  */