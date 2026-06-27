// developer.js
import { db } from "./firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

export function loadDeveloper() {
  const container = document.getElementById("developer-content");
  if (!container) return;

  onValue(ref(db, "settings/developer"), (snap) => {
    const d = snap.val() || {};
    container.innerHTML = `
      <div class="profile-card">
        <div class="profile-avatar-wrap">
          <div class="avatar-ring gold">
            ${d.pic
              ? `<img src="${d.pic}" class="profile-avatar" />`
              : `<div class="avatar-placeholder gold">👑</div>`}
          </div>
          <div class="verified-badge gold">✓</div>
        </div>
        <h2 class="profile-name">${d.name || "SM MEHMUD"}</h2>
        ${d.district ? `<p class="profile-district">📍 ${d.district}</p>` : ""}
        ${d.bio ? `<p class="profile-bio">${d.bio}</p>` : ""}
        <div class="dev-links">
          ${d.telegram ? `<a href="${d.telegram}" class="dev-link tg" target="_blank">✈️ Telegram</a>` : ""}
          ${d.facebook ? `<a href="${d.facebook}" class="dev-link fb" target="_blank">👤 Facebook</a>` : ""}
        </div>
        <p class="dev-label">💻 Developer of SM Premium</p>
      </div>`;
  }, { onlyOnce: true });
}
