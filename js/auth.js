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
        showToast("লগইন ব্যর্থ হয়েছে");
    }
}

export async function logoutUser() {
    await signOut(auth);
    showToast("লগআউট হয়েছে");
}

export function initAuth(onUserChange) {
    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        
        if (user) {
            // ১. ইউজার ডাটাবেজে না থাকলে নতুন ইউজার হিসেবে সেভ করা
            const snap = await get(ref(db, `users/${user.uid}`));
            if (!snap.exists()) {
                await set(ref(db, `users/${user.uid}`), {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: Date.now()
                });
            }

            // ২. অ্যাডমিন রোল চেক করার মূল লজিক (যা আগে ছিল না)
            try {
                const adminSnap = await get(ref(db, `admins/${user.uid}`));
                if (adminSnap.exists() && adminSnap.val().role === 'superadmin') {
                    // ইউজার যদি অ্যাডমিন হয়, তবে তাকে সরাসরি অ্যাডমিন ড্যাশবোর্ডে পাঠানো হবে
                    if (!window.location.href.includes('admin.html')) {
                        window.location.href = 'admin.html';
                    }
                }
            } catch (err) {
                console.error("Admin check failed:", err);
            }
        }
        
        onUserChange(user);
    });
}

function showToast(msg) {
    window.showToast?.(msg);
}
