// admin.js — SM Premium Admin Panel Logic
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getDatabase, ref, onValue, push, set, update, remove, get
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getDatabase(app);

// ── Auth ──────────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const snap = await get(ref(db, `admins/${user.uid}`));
    if (snap.exists()) {
      showPanel();
      loadDashboard();
      loadAdminOffers();
    } else {
      await signOut(auth);
      toast("অ্যাডমিন অ্যাক্সেস নেই ❌");
      showLogin();
    }
  } else {
    showLogin();
  }
});

window.adminLogin = async function () {
  const email = document.getElementById("admin-email")?.value.trim();
  const pass  = document.getElementById("admin-pass")?.value;
  if (!email || !pass) { toast("সব ঘর পূরণ করুন"); return; }
  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (e) {
    toast("লগইন ব্যর্থ: " + (e.code === "auth/wrong-password" ? "ভুল পাসওয়ার্ড" : "ভুল ইমেইল বা পাসওয়ার্ড"));
  }
};

window.adminLogout = async function () {
  await signOut(auth);
};

function showLogin() {
  document.getElementById("admin-login").style.display = "flex";
  document.getElementById("admin-panel").style.display = "none";
}
function showPanel() {
  document.getElementById("admin-login").style.display = "none";
  document.getElementById("admin-panel").style.display  = "block";
}

// ── Tab ───────────────────────────────────────────────
window.showTab = function (tab) {
  document.querySelectorAll(".admin-tab-content").forEach((t) => t.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  document.getElementById("tab-" + tab)?.classList.add("active");
  document.querySelector(`.tab-btn[data-tab="${tab}"]`)?.classList.add("active");

  if (tab === "offers")   loadAdminOffers();
  if (tab === "news")     loadAdminNews();
  if (tab === "reports")  loadReports();
  if (tab === "settings") loadAdminSettings();
};

// ── Dashboard ─────────────────────────────────────────
function loadDashboard() {
  [["offers","stat-offers"],["reports","stat-reports"],["users","stat-users"],["news","stat-news"]]
    .forEach(([node, id]) => {
      onValue(ref(db, node), (s) => {
        const el = document.getElementById(id);
        if (el) el.textContent = s.exists() ? Object.keys(s.val()).length : 0;
      });
    });
}

// ── Offers ────────────────────────────────────────────
function loadAdminOffers() {
  onValue(ref(db, "offers"), (snap) => {
    const data = snap.val() || {};
    const offers = Object.entries(data).map(([id, o]) => ({ id, ...o }));
    const container = document.getElementById("admin-offers-list");
    if (!container) return;
    container.innerHTML = offers.length
      ? offers.map((o) => `
          <div class="admin-card">
            <div class="admin-card-left">
              ${o.pic
                ? `<img src="${o.pic}" class="admin-offer-img" />`
                : `<div class="admin-offer-img-placeholder">📦</div>`}
              <div>
                <p class="admin-card-title">${o.name}</p>
                <p class="admin-card-sub">${o.category || ""} ${o.price ? "• ৳" + o.price : ""} ${o.discount ? "• -" + o.discount + "%" : ""}</p>
                <span class="admin-badge ${o.stockOut ? "badge-danger" : "badge-success"}">${o.stockOut ? "STOCK OUT" : "ACTIVE"}</span>
              </div>
            </div>
            <div class="admin-card-actions">
              <button class="admin-btn edit"   onclick="editOffer('${o.id}')">✏️</button>
              <button class="admin-btn danger" onclick="deleteOffer('${o.id}')">🗑️</button>
            </div>
          </div>`).join("")
      : '<p class="empty">কোনো অফার নেই</p>';
  }, { onlyOnce: true });
}

window.showAddOfferForm = function () {
  document.getElementById("offer-form-modal")?.classList.add("active");
  document.getElementById("offer-form-title").textContent = "নতুন অফার যোগ করুন";
  document.getElementById("offer-form")?.reset();
  document.getElementById("offer-edit-id").value = "";
};

window.editOffer = async function (id) {
  const snap = await get(ref(db, `offers/${id}`));
  const o = snap.val();
  document.getElementById("offer-form-modal")?.classList.add("active");
  document.getElementById("offer-form-title").textContent = "অফার এডিট করুন";
  document.getElementById("offer-edit-id").value  = id;
  document.getElementById("f-name").value          = o.name || "";
  document.getElementById("f-category").value      = o.category || "entertainment";
  document.getElementById("f-price").value         = o.price || "";
  document.getElementById("f-discount").value      = o.discount || "";
  document.getElementById("f-pic").value           = o.pic || "";
  document.getElementById("f-desc").value          = o.description || "";
  document.getElementById("f-stock").checked       = o.stockOut || false;
};

window.saveOffer = async function () {
  const id   = document.getElementById("offer-edit-id").value;
  const data = {
    name:        document.getElementById("f-name").value.trim(),
    category:    document.getElementById("f-category").value,
    price:       document.getElementById("f-price").value || "",
    discount:    document.getElementById("f-discount").value || "",
    pic:         document.getElementById("f-pic").value.trim(),
    description: document.getElementById("f-desc").value.trim(),
    stockOut:    document.getElementById("f-stock").checked,
    updatedAt:   Date.now(),
  };
  if (!data.name) { toast("অফারের নাম দিন"); return; }
  if (id) { await update(ref(db, `offers/${id}`), data); }
  else    { data.createdAt = Date.now(); await push(ref(db, "offers"), data); }
  toast("অফার সেভ হয়েছে ✅");
  closeOfferForm();
  loadAdminOffers();
};

window.deleteOffer = async function (id) {
  if (!confirm("এই অফার ডিলেট করবেন?")) return;
  await remove(ref(db, `offers/${id}`));
  toast("অফার ডিলেট হয়েছে");
  loadAdminOffers();
};

window.closeOfferForm = function () {
  document.getElementById("offer-form-modal")?.classList.remove("active");
};

// ── News ──────────────────────────────────────────────
function loadAdminNews() {
  onValue(ref(db, "news"), (snap) => {
    const data = snap.val() || {};
    const posts = Object.entries(data)
      .map(([id, n]) => ({ id, ...n }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const container = document.getElementById("admin-news-list");
    if (!container) return;
    container.innerHTML = posts.length
      ? posts.map((p) => `
          <div class="admin-card">
            <div class="admin-card-left">
              <div>
                <p class="admin-card-title">${(p.text || "").substring(0, 60)}...</p>
                ${p.imageUrl ? `<img src="${p.imageUrl}" class="admin-news-thumb" />` : ""}
              </div>
            </div>
            <button class="admin-btn danger" onclick="deleteNews('${p.id}')">🗑️</button>
          </div>`).join("")
      : '<p class="empty">কোনো নিউজ নেই</p>';
  }, { onlyOnce: true });
}

window.postNews = async function () {
  const text     = document.getElementById("news-text")?.value.trim();
  const imageUrl = document.getElementById("news-img-url")?.value.trim();
  const link     = document.getElementById("news-link")?.value.trim();
  if (!text) { toast("নিউজ টেক্সট লিখুন"); return; }
  await push(ref(db, "news"), { text, imageUrl, link, createdAt: Date.now() });
  toast("নিউজ পোস্ট হয়েছে ✅");
  document.getElementById("news-text").value     = "";
  document.getElementById("news-img-url").value  = "";
  document.getElementById("news-link").value     = "";
  loadAdminNews();
};

window.deleteNews = async function (id) {
  if (!confirm("এই নিউজ ডিলেট করবেন?")) return;
  await remove(ref(db, `news/${id}`));
  toast("নিউজ ডিলেট হয়েছে");
  loadAdminNews();
};

// ── Reports ───────────────────────────────────────────
function loadReports() {
  onValue(ref(db, "reports"), (snap) => {
    const data = snap.val() || {};
    const reports = Object.entries(data)
      .map(([id, r]) => ({ id, ...r }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const container = document.getElementById("admin-reports-list");
    if (!container) return;
    container.innerHTML = reports.length
      ? reports.map((r) => `
          <div class="admin-card report-card">
            <div>
              <p class="report-name">👤 ${r.name} — 📍 ${r.district}</p>
              <p class="report-email">📧 ${r.email}</p>
              <p class="report-msg">${r.message}</p>
            </div>
            <button class="admin-btn danger" onclick="deleteReport('${r.id}')">🗑️</button>
          </div>`).join("")
      : '<p class="empty">কোনো রিপোর্ট নেই</p>';
  }, { onlyOnce: true });
}

window.deleteReport = async function (id) {
  await remove(ref(db, `reports/${id}`));
  toast("রিপোর্ট ডিলেট হয়েছে");
  loadReports();
};

// ── Settings ──────────────────────────────────────────
function loadAdminSettings() {
  onValue(ref(db, "settings"), (snap) => {
    const data = snap.val() || {};
    const c = data.contact   || {};
    const d = data.developer || {};
    document.getElementById("s-telegram").value     = c.telegram || "";
    document.getElementById("s-whatsapp").value     = c.whatsapp || "";
    document.getElementById("s-facebook").value     = c.facebook || "";
    document.getElementById("s-dev-name").value     = d.name     || "";
    document.getElementById("s-dev-pic").value      = d.pic      || "";
    document.getElementById("s-dev-district").value = d.district || "";
    document.getElementById("s-dev-bio").value      = d.bio      || "";
    document.getElementById("s-dev-telegram").value = d.telegram || "";
    document.getElementById("s-dev-facebook").value = d.facebook || "";
  }, { onlyOnce: true });
}

window.saveSettings = async function () {
  await update(ref(db, "settings/contact"), {
    telegram: document.getElementById("s-telegram").value.trim(),
    whatsapp: document.getElementById("s-whatsapp").value.trim(),
    facebook: document.getElementById("s-facebook").value.trim(),
    name: "SM MEHMUD",
  });
  await update(ref(db, "settings/developer"), {
    name:     document.getElementById("s-dev-name").value.trim(),
    pic:      document.getElementById("s-dev-pic").value.trim(),
    district: document.getElementById("s-dev-district").value.trim(),
    bio:      document.getElementById("s-dev-bio").value.trim(),
    telegram: document.getElementById("s-dev-telegram").value.trim(),
    facebook: document.getElementById("s-dev-facebook").value.trim(),
  });
  toast("সেটিংস সেভ হয়েছে ✅");
};

// ── Toast ─────────────────────────────────────────────
function toast(msg) {
  const t = document.getElementById("admin-toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}
