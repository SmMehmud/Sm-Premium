// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-Jghs-vQjiCAxT1HPpixZd7tBRy_dy5c",
  authDomain: "sm-premium-697f2.firebaseapp.com",
  projectId: "sm-premium-697f2",
  storageBucket: "sm-premium-697f2.firebasestorage.app",
  messagingSenderId: "1043748679307",
  appId: "1:1043748679307:web:dd62fa7b134542f8792e8e",
  measurementId: "G-7DFZRDXQ99",
  databaseURL: "https://sm-premium-697f2-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
