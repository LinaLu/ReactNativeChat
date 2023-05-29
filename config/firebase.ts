
import firebase from "@firebase/app-compat";
import "firebase/compat/firestore";

const firebaseConfig = require("./firebaseCredentials.json");
firebase.initializeApp(firebaseConfig);

if (__DEV__) {
  console.log("Using an emulator");
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({ host: "localhost:8080", ssl: false });
}

export const firestoreDB = firebase.firestore();
