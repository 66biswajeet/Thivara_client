// Firebase configuration
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAh2GuVNAncg2as2QSsCqeD2j8mOk3mpi0",
  authDomain: "thivara.firebaseapp.com",
  projectId: "thivara",
  storageBucket: "thivara.firebasestorage.app",
  messagingSenderId: "72446607683",
  appId: "1:72446607683:web:f474aef82ab165af34aff6",
  measurementId: "G-2VLXFE4E0R",
};

// Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Auth
const auth = getAuth(app);

export { app, auth, firebaseConfig };
