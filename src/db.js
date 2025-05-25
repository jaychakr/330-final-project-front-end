// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAB7jyHO7hpf_EY-N_KgrGfaPpBH_cRLWA",
  authDomain: "instagram2-ee1b3.firebaseapp.com",
  projectId: "instagram2-ee1b3",
  storageBucket: "instagram2-ee1b3.firebasestorage.app",
  messagingSenderId: "72846767981",
  appId: "1:72846767981:web:2cabce8d5722921adf0c64",
  measurementId: "G-YDXMWE2Z89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;