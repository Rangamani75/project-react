// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDr9ePrlWie4r1vEDTkJuEaeNLdEvcF3vI",
  authDomain: "personal-finance-tracker-557e8.firebaseapp.com",
  projectId: "personal-finance-tracker-557e8",
  storageBucket: "personal-finance-tracker-557e8.appspot.com",
  messagingSenderId: "259693976611",
  appId: "1:259693976611:web:177f26cdb717f9b7afa596",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
