<div align="center">

# 👑 SM PREMIUM

### প্রিমিয়াম সার্ভিস মার্কেটপ্লেস

[![Deploy with Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://smpremiumplus.vercel.app)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com)
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)]()
[![Made in Bangladesh](https://img.shields.io/badge/Made%20in-Bangladesh%20🇧🇩-green?style=for-the-badge)]()

<br/>

> **সেরা প্রিমিয়াম সার্ভিস পাচ্ছেন একটাই জায়গায়**  
> YouTube • Netflix • Spotify • ChatGPT • Claude AI • Canva Pro & আরও অনেক কিছু

<br/>

![SM Premium Banner](https://img.shields.io/badge/SM%20PREMIUM-👑%20Premium%20Service%20Marketplace-7c5cfc?style=for-the-badge)

</div>

---

## ✨ Features

| Feature | Details |
|---|---|
| 🛍️ **অফার মার্কেটপ্লেস** | Category অনুযায়ী সাজানো প্রিমিয়াম অফার |
| 📲 **One-Tap Contact** | Telegram / WhatsApp / Facebook এ অটো-message |
| 🗞️ **নিউজ ফিড** | React ও Comment সহ Live আপডেট |
| 👤 **প্রোফাইল** | Google Sign-in, ছবি ও নাম এডিট |
| 🗳️ **রিপোর্ট সিস্টেম** | ইউজার মতামত সরাসরি Admin এ |
| 👑 **Admin Panel** | সব কিছু Firebase থেকে কন্ট্রোল |
| 📱 **App-like Experience** | Back button, Bottom Nav, iOS-level UI |
| ⚡ **Realtime Database** | Firebase Realtime DB দিয়ে Live Sync |

---

## 🖥️ Preview

```
┌─────────────────────────┐
│  SM PREMIUM  👑   🔑    │  ← Header
├─────────────────────────┤
│                         │
│   🎬 বিনোদন সাবস্ক্রিপশন │
│   ┌───┐ ┌───┐ ┌───┐    │
│   │YT │ │NF │ │SP │    │  ← Offer Cards
│   └───┘ └───┘ └───┘    │
│                         │
│   🤖 AI সাবস্ক্রিপশনস   │
│   ┌───┐ ┌───┐           │
│   │GPT│ │AI │           │
│   └───┘ └───┘           │
│                         │
├─────────────────────────┤
│ 🏠  🛍️  🗳️  🗞️  👤    │  ← Bottom Nav
└─────────────────────────┘
```

---

## 🗂️ Project Structure

```
Sm-Premium/
│
├── 📄 index.html          # Main SPA App
├── 📄 admin.html          # Admin Panel
├── 📄 vercel.json         # Vercel Routing Config
│
├── 📁 css/
│   ├── 🎨 app.css         # iOS-style Premium Theme
│   └── 🎨 admin.css       # Admin Panel Styles
│
├── 📁 js/
│   ├── 🔥 firebase-config.js   # Firebase Init
│   ├── 🔐 auth.js              # Google Auth
│   ├── 🧭 router.js            # SPA Routing + Back Button
│   ├── 🛍️ offers.js            # Offer Logic + Contact Modal
│   ├── 🗞️ news.js              # News Feed + React + Comment
│   ├── 👤 profile.js           # User Profile
│   ├── 🗳️ report.js            # Report Form
│   ├── 💻 developer.js         # Developer Info
│   └── 👑 admin.js             # Admin Panel Logic
│
└── 📁 assets/
    └── 🖼️ default-avatar.svg   # Default Profile Picture
```

---

## 🚀 Tech Stack

```
Frontend    →  HTML5 + CSS3 + Vanilla JavaScript (ES Modules)
Backend     →  Firebase Realtime Database
Auth        →  Firebase Authentication (Google Sign-in)
Hosting     →  Vercel (Free)
```

---

## 🔥 Firebase Structure

```
📦 Realtime Database
├── 🛍️ offers/
│   └── {offerId}/  →  name, category, price, discount, pic, stockOut
├── 🗞️ news/
│   └── {newsId}/   →  text, imageUrl, link, reactions/, comments/
├── 👤 users/
│   └── {uid}/      →  displayName, email, photoURL
├── 🗳️ reports/
│   └── {reportId}/ →  name, email, district, message
├── 👑 admins/
│   └── {uid}/      →  email, role
└── ⚙️ settings/
    ├── contact/    →  telegram, whatsapp, facebook
    └── developer/  →  name, pic, district, bio, telegram, facebook
```

---

## ⚙️ Setup Guide

### ১. Firebase Setup
```bash
# Firebase Console এ যাও
# Realtime Database → Create
# Authentication → Google Enable করো
# admins/{your-uid} → role: superadmin দাও
```

### ২. Deploy on Vercel
```bash
# Vercel.com → Import GitHub Repo
# Project Name: smpremiumplus
# Deploy চাপো — শেষ!
```

### ৩. Admin Panel Access
```
https://smpremiumplus.vercel.app/admin
Email: Firebase Auth Email
Password: Firebase Auth Password
```

---

## 📱 Pages

| Page | Route | Description |
|---|---|---|
| 🏠 Home | `/` | অফার overview |
| 🛍️ Offers | `/` → offers tab | সব অফার category অনুযায়ী |
| 🗞️ News | `/` → news tab | আপডেট ও নিউজ |
| 🗳️ Report | `/` → report tab | মতামত পাঠান |
| 👤 Profile | `/` → profile tab | User প্রোফাইল |
| 👑 Admin | `/admin` | Admin Dashboard |

---

## 👑 Developer

<div align="center">

**SM MEHMUD**

[![Telegram](https://img.shields.io/badge/Telegram-@SmMehmud-blue?style=flat-square&logo=telegram)](https://t.me/SmMehmud)
[![Facebook](https://img.shields.io/badge/Facebook-SM%20MEHMUD-1877f2?style=flat-square&logo=facebook)](#)

📍 Atulia, Kalaroa, Satkhira, Bangladesh 🇧🇩

</div>

---

<div align="center">

**© 2025 SM MEHMUD. All Rights Reserved.**

*Made with ❤️ in Bangladesh*

</div>
