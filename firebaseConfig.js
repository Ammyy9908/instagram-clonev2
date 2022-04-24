// Import the functions you need from the SDKs you need
import dotenv from "next/dotenv";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
dotenv.config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGE_ID,
  appId: process.env.APP_ID,
  measurementId: "G-9T578CYXJ8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
