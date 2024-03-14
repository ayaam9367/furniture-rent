// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-vrent.firebaseapp.com",
  projectId: "mern-vrent",
  storageBucket: "mern-vrent.appspot.com",
  messagingSenderId: "2724464937",
  appId: "1:2724464937:web:85f71e7beae105d6e60f38"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);