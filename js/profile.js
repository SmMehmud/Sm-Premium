// profile.js
import { db } from "./firebase-config.js";
import { currentUser, logoutUser } from "./auth.js";
import {
  ref, onValue, update, get
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

export function loadProfile() {
  const container = document.getElementById("profile-content");
  if (!container) return;

  if (!currentUser) {
    container.innerHTML = `
      <div class="login-wall">
        <div class="login-wall-icon">👤</div>
        <p>প্রোফাইল দেখতে লগইন করুন</p>
        <button class="glow-btn" onclick="window.loginWithGoogle()">Google দিয়ে লগইন</button>
      </div>`;
    return;
  }

  onValue(ref(db, `users/${currentUser.uid}`), (snap) => {
    const data = snap.val() || {};
    const pic  = data.photoURL || currentUser.photoURL || "";
    const name = data.displayName || currentUser.displayName || "ব্যবহারকারী";
    const isCustomPic = data.photoURL && data.photoURL !== currentUser.photoURL;

    container.innerHTML = `
      <div class="profile-card">
        <div class="profile-avatar-wrap">
          <div class="avatar-ring">
            ${pic
              ? `<img src="${pic}" class="profile-avatar" />`
              : `<div class="avatar-placeholder">${name.charAt(0)}</div>`}
          </div>
          <div class="verified-badge">✓</div>
        </div>
        <h2 class="profile-name">${name}</h2>
        <p class="profile-email">${currentUser.email}</p>
        <div class="profile-actions">
          <button class="profile-edit-btn" onclick="editName()">✏️ নাম পরিবর্তন</button>
          <button class="profile-edit-btn" onclick="editPic()">🖼️ ছবি পরিবর্তন</button>
          ${isCustomPic
            ? `<button class="profile-edit-btn danger" onclick="resetPic()">🔄 ডিফল্ট ছবি</button>`
            : ""}
        </div>
        <button class="logout-btn" onclick="handleLogout()">🚪 লগআউট</button>
      </div>`;
  }, { onlyOnce: true });
}

window.editName = function () {
  const newName = prompt("নতুন নাম লিখুন:");
  if (!newName?.trim()) return;
  update(ref(db, `users/${currentUser.uid}`), { displayName: newName.trim() });
  window.showToast?.("নাম আপডেট হয়েছে ✅");
  setTimeout(loadProfile, 500);
};

window.editPic = function () {
  const url = prompt("ছবির URL লিখুন (Imgur / imgbb লিংক):");
  if (!url?.trim()) return;
  update(ref(db, `users/${currentUser.uid}`), { photoURL: url.trim() });
  window.showToast?.("ছবি আপডেট হয়েছে ✅");
  setTimeout(loadProfile, 500);
};

window.resetPic = function () {
  update(ref(db, `users/${currentUser.uid}`), { photoURL: "" });
  window.showToast?.("ডিফল্ট ছবিতে ফিরে গেছে");
  setTimeout(loadProfile, 500);
};

window.handleLogout = async function () {
  await logoutUser();
  setTimeout(loadProfile, 500);
};
