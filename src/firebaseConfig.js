import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgdSXkHNUNyqanI81puXbUjmYFsuIkQcM",
  authDomain: "react-firebase-chat-9f5b1.firebaseapp.com",
  projectId: "react-firebase-chat-9f5b1",
  storageBucket: "react-firebase-chat-9f5b1.appspot.com",
  messagingSenderId: "12356904407",
  appId: "1:12356904407:web:76ebbab6de9315c91e5792",
  measurementId: "G-BZCC7F2RND",
};

// Establish a connection
// const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
// export const db = getFirestore(app);
export const db = firebase.firestore();
