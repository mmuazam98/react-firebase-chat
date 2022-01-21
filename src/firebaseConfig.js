import { initializeApp } from "firebase/app";

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
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
