// auth.js
import { auth, db } from "./firebase-config.js";
import {
  GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  ref, get, set
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const provider = new GoogleAuthProvider();
export let currentUser = null;

export async function loginWithGoogle() {
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    showToast("লগইন ব্যর্থ হয়েছে");
  }
}

export async function logoutUser() {
  await signOut(auth);
  showToast("লগআউট হয়েছে");
}

export function initAuth(onUserChange) {
  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
      // Save user to DB if new
      const snap = await get(ref(db, `users/${user.uid}`));
      if (!snap.exists()) {
        await set(ref(db, `users/${user.uid}`), {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: Date.now()
        });
      }
    }
    onUserChange(user);
  });
}

function showToast(msg) {
  window.showToast?.(msg);
}
