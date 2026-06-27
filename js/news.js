// news.js
import { db } from "./firebase-config.js";
import { currentUser } from "./auth.js";
import {
  ref, onValue, push, set, remove, get
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

export function loadNews() {
  onValue(ref(db, "news"), (snap) => {
    const data = snap.val() || {};
    const posts = Object.entries(data)
      .map(([id, n]) => ({ id, ...n }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    renderNews(posts);
  }, { onlyOnce: true });
}

function renderNews(posts) {
  const container = document.getElementById("news-list");
  if (!container) return;
  container.innerHTML = posts.length
    ? posts.map(newsCard).join("")
    : '<p class="empty">কোনো নিউজ নেই</p>';
}

function newsCard(p) {
  const date = p.createdAt
    ? new Date(p.createdAt).toLocaleDateString("bn-BD")
    : "";
  const reactCount = Object.keys(p.reactions || {}).length;
  const commentCount = Object.keys(p.comments || {}).length;

  return `
    <div class="news-card" id="news-${p.id}">
      <div class="news-header">
        <span class="news-badge">📢 আপডেট</span>
        <span class="news-date">${date}</span>
      </div>
      <p class="news-text">${p.text || ""}</p>
      ${p.imageUrl ? `<img src="${p.imageUrl}" class="news-img" alt="news" loading="lazy" />` : ""}
      ${p.link ? `<a href="${p.link}" class="news-link" target="_blank">🔗 বিস্তারিত দেখুন</a>` : ""}
      <div class="news-actions">
        <button class="react-btn" onclick="toggleReact('${p.id}')">
          ❤️ <span id="react-count-${p.id}">${reactCount}</span>
        </button>
        <button class="comment-btn" onclick="toggleComments('${p.id}')">
          💬 <span id="comment-count-${p.id}">${commentCount}</span>
        </button>
      </div>
      <div class="comments-section" id="comments-${p.id}" style="display:none;">
        <div class="comments-list" id="comments-list-${p.id}"></div>
        <div id="comment-input-area-${p.id}"></div>
      </div>
    </div>`;
}

window.toggleReact = async function (newsId) {
  if (!currentUser) { window.showToast?.("রিয়েক্ট করতে লগইন করুন"); return; }
  const rRef = ref(db, `news/${newsId}/reactions/${currentUser.uid}`);
  const snap = await get(rRef);
  snap.exists() ? await remove(rRef) : await set(rRef, true);
  // Update count live
  const cSnap = await get(ref(db, `news/${newsId}/reactions`));
  const el = document.getElementById(`react-count-${newsId}`);
  if (el) el.textContent = cSnap.exists() ? Object.keys(cSnap.val()).length : 0;
};

window.toggleComments = function (newsId) {
  const sec = document.getElementById(`comments-${newsId}`);
  if (!sec) return;
  const isOpen = sec.style.display !== "none";
  sec.style.display = isOpen ? "none" : "block";
  if (!isOpen) {
    loadComments(newsId);
    renderCommentInput(newsId);
  }
};

function renderCommentInput(newsId) {
  const area = document.getElementById(`comment-input-area-${newsId}`);
  if (!area) return;
  area.innerHTML = currentUser
    ? `<div class="comment-input-row">
        <input type="text" placeholder="মন্তব্য লিখুন..." id="comment-input-${newsId}" class="comment-input" />
        <button onclick="postComment('${newsId}')" class="comment-send">➤</button>
       </div>`
    : '<p class="login-prompt">মন্তব্য করতে লগইন করুন</p>';
}

function loadComments(newsId) {
  onValue(ref(db, `news/${newsId}/comments`), (snap) => {
    const data = snap.val() || {};
    const list = document.getElementById(`comments-list-${newsId}`);
    if (!list) return;
    const items = Object.values(data);
    list.innerHTML = items.length
      ? items.map((c) => `
          <div class="comment-item">
            <span class="comment-name">${c.name}</span>
            <span class="comment-text">${c.text}</span>
          </div>`).join("")
      : '<p class="empty-small">কোনো মন্তব্য নেই</p>';
  }, { onlyOnce: true });
}

window.postComment = async function (newsId) {
  if (!currentUser) return;
  const input = document.getElementById(`comment-input-${newsId}`);
  const text = input?.value.trim();
  if (!text) return;
  await push(ref(db, `news/${newsId}/comments`), {
    text,
    name: currentUser.displayName || "ব্যবহারকারী",
    userId: currentUser.uid,
    createdAt: Date.now(),
  });
  input.value = "";
  loadComments(newsId);
  // Update comment count
  const cSnap = await get(ref(db, `news/${newsId}/comments`));
  const el = document.getElementById(`comment-count-${newsId}`);
  if (el) el.textContent = cSnap.exists() ? Object.keys(cSnap.val()).length : 0;
};
