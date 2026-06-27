// report.js
import { db } from "./firebase-config.js";
import { push, ref } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { navigateTo } from "./router.js";

export function initReport() {
  const btn = document.getElementById("report-submit-btn");
  if (btn) btn.addEventListener("click", submitReport);
}

async function submitReport() {
  const email    = document.getElementById("report-email")?.value.trim();
  const name     = document.getElementById("report-name")?.value.trim();
  const district = document.getElementById("report-district")?.value.trim();
  const message  = document.getElementById("report-message")?.value.trim();

  if (!email || !name || !district || !message) {
    window.showToast?.("সব ঘর পূরণ করুন");
    return;
  }

  await push(ref(db, "reports"), {
    email, name, district, message, createdAt: Date.now()
  });

  window.showToast?.("রিপোর্ট পাঠানো হয়েছে ✅");
  document.getElementById("report-email").value    = "";
  document.getElementById("report-name").value     = "";
  document.getElementById("report-district").value = "";
  document.getElementById("report-message").value  = "";

  setTimeout(() => navigateTo("home"), 1500);
}
