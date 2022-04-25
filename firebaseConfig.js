// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
console.log(process.env.API_KEY, process.env.AUTH_DOMAIN);
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2k_DbkrEtyKLS4cGO_te6kkFgjROWJ5w",
  authDomain: "instagram-3e52f.firebaseapp.com",
  projectId: "instagram-3e52f",
  storageBucket: "instagram-3e52f.appspot.com",
  messagingSenderId: "701917918836",
  appId: "1:701917918836:web:8c7e3362e2d04db4708321",
  measurementId: "G-9T578CYXJ8",
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const db = getFirestore(firebase);

export { auth, firebase, db };
