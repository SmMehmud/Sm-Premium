// offers.js
import { db } from "./firebase-config.js";
import { ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { navigateTo } from "./router.js";

let allOffers = [];
let contactInfo = {};

export function initOffers() {
  onValue(ref(db, "settings/contact"), (snap) => {
    contactInfo = snap.val() || {};
  });
}

export function loadOffers(containerId) {
  onValue(ref(db, "offers"), (snap) => {
    const data = snap.val() || {};
    allOffers = Object.entries(data).map(([id, o]) => ({ id, ...o }));
    renderOffers(allOffers, containerId);
  }, { onlyOnce: true });
}

const CATEGORIES = {
  facebook:      { label: "ফেসবুক সার্ভিস",          icon: "📘" },
  entertainment: { label: "বিনোদনমূলক সাবস্ক্রিপশন", icon: "🎬" },
  ai:            { label: "AI সাবস্ক্রিপশনস",         icon: "🤖" },
  other:         { label: "অন্যান্য সার্ভিস",          icon: "⚡" },
};

function renderOffers(offers, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = "";
  Object.entries(CATEGORIES).forEach(([cat, info]) => {
    const catOffers = offers.filter((o) => o.category === cat);
    if (!catOffers.length) return;
    html += `
      <div class="category-section">
        <h2 class="category-title">${info.icon} ${info.label}</h2>
        <div class="offers-grid">
          ${catOffers.map(offerCard).join("")}
        </div>
      </div>`;
  });

  container.innerHTML = html || '<p class="empty">কোনো অফার নেই</p>';
}

function offerCard(o) {
  const stockBadge = o.stockOut ? '<span class="badge stock-out">STOCK OUT</span>' : "";
  const discountBadge = o.discount ? `<span class="badge discount">-${o.discount}%</span>` : "";
  return `
    <div class="offer-card" onclick="openOffer('${o.id}')">
      <div class="offer-img-wrap">
        ${o.pic
          ? `<img src="${o.pic}" alt="${o.name}" loading="lazy" />`
          : `<div class="offer-img-placeholder">${o.name?.charAt(0) || "?"}</div>`}
        ${stockBadge}${discountBadge}
      </div>
      <p class="offer-name">${o.name || ""}</p>
    </div>`;
}

window.openOffer = async function (id) {
  const snap = await get(ref(db, `offers/${id}`));
  const o = { id, ...snap.val() };
  allOffers = allOffers.some((x) => x.id === id)
    ? allOffers.map((x) => (x.id === id ? o : x))
    : [...allOffers, o];

  let price = "";
  if (o.price && o.discount) {
    const disc = Math.round(o.price * (1 - o.discount / 100));
    price = `<span class="old-price">৳${o.price}</span> <span class="new-price">৳${disc}</span>`;
  } else if (o.price) {
    price = `<span class="new-price">৳${o.price}</span>`;
  }

  document.getElementById("offer-detail-content").innerHTML = `
    <div class="offer-detail-hero">
      ${o.pic
        ? `<img src="${o.pic}" alt="${o.name}" class="detail-img" />`
        : `<div class="detail-img-placeholder">${o.name?.charAt(0)}</div>`}
    </div>
    <div class="offer-detail-info">
      <h1 class="detail-title">${o.name}</h1>
      ${price ? `<div class="detail-price">${price}</div>` : ""}
      ${o.description ? `<p class="detail-desc">${o.description}</p>` : ""}
      ${o.stockOut
        ? '<div class="stock-out-banner">⚠️ স্টক আউট</div>'
        : `<button class="contact-btn glow-btn" onclick="showContactModal('${o.id}','${o.name}')">📲 Contact for Buy</button>`}
    </div>`;

  navigateTo("offer-detail");
};

window.showContactModal = function (offerId, offerName) {
  window._currentOfferName = offerName;
  document.getElementById("contact-offer-name").textContent = offerName;
  document.getElementById("contact-modal").classList.add("active");
};

window.closeContactModal = function () {
  document.getElementById("contact-modal").classList.remove("active");
  document.getElementById("links-modal").classList.remove("active");
};

window.showContactLinks = function () {
  document.getElementById("contact-modal").classList.remove("active");
  const c = contactInfo;
  const msg = encodeURIComponent(
    `আসসালামু আলাইকুম, আমি "${window._currentOfferName}" নিতে চাই। দয়া করে বিস্তারিত জানান।`
  );
  const tgUser = c.telegram ? c.telegram.replace("https://t.me/", "") : "";
  const waNum  = c.whatsapp ? c.whatsapp.replace(/\D/g, "") : "";

  const modal = document.getElementById("links-modal");
  modal.innerHTML = `
    <div class="links-modal-box">
      <button class="modal-close" onclick="closeContactModal()">✕</button>
      <div class="links-modal-title">📲 যোগাযোগ করুন</div>
      <p class="links-modal-sub">SM MEHMUD</p>
      <div class="contact-links">
        ${tgUser ? `<a class="contact-link tg" href="https://t.me/${tgUser}?text=${msg}" target="_blank">✈️ Telegram</a>` : ""}
        ${waNum  ? `<a class="contact-link wa" href="https://wa.me/${waNum}?text=${msg}" target="_blank">💬 WhatsApp</a>` : ""}
        ${c.facebook ? `<a class="contact-link fb" href="${c.facebook}" target="_blank">👤 Facebook</a>` : ""}
      </div>
    </div>`;
  modal.classList.add("active");
};
