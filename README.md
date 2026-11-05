<div align="center"><img src="https://img.shields.io/badge/FREEOTP-PLATFORM-087FDB?style=for-the-badge" />
<img src="https://img.shields.io/badge/API-LIVE-00C853?style=for-the-badge" />
<img src="https://img.shields.io/badge/NODE.JS-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />⚡ FREEOTP BOT

NOKOS MURAH — VIRTUAL NUMBER & OTP PLATFORM

Platform Telegram Bot untuk mengelola nomor virtual, mendapatkan kode OTP secara otomatis, dan mengintegrasikan provider FREEOTP API.

POWERED BY FREEOTP API · DEVELOPED BY RIZALDEV

"🌐 Dashboard OTP" (https://www.rizaldev.cloud/freeotp) · "👨‍💻 Developer" (https://www.rizaldev.cloud)

</div>---

📌 TABLE OF CONTENTS

No.| Dokumentasi
01| "Overview" (#-overview)
02| "Features" (#-features)
03| "System Architecture" (#-system-architecture)
04| "Provider API" (#-provider-api)
05| "Project Structure" (#-project-structure)
06| "Installation" (#-installation)
07| "Configuration" (#-configuration)
08| "Bot Commands" (#-bot-commands)
09| "OTP Workflow" (#-otp-workflow)
10| "API Integration" (#-api-integration)
11| "Troubleshooting" (#-troubleshooting)
12| "Security" (#-security)
13| "Developer" (#-developer)

---

🚀 OVERVIEW

FREEOTP Bot adalah aplikasi Telegram berbasis Node.js yang menggunakan FREEOTP API sebagai provider utama.

Sistem dirancang untuk mempermudah pengguna dalam:

- Memilih layanan virtual number.
- Memilih negara yang tersedia.
- Meminta nomor secara otomatis.
- Menerima OTP melalui monitoring.
- Mengelola nomor aktif.
- Melihat riwayat OTP.
- Mengakses fitur akun dan referral.

System Information

Information| Details
Project| Nokos Murah
Provider| FREEOTP
Runtime| Node.js 22
Framework| Telegraf
API Protocol| REST API
Response| JSON
Database| Local Database
Hosting| Pterodactyl
Developer| Rizaldev
Version| 2.0

---

✨ FEATURES

<div align="center">📱 VIRTUAL NUMBER| 🔐 OTP SYSTEM
Request Number| Automatic OTP Polling
Multi Service| Latest OTP
Multi Country| OTP History
Change Number| Live OTP Feed
Release Number| OTP Notifications

👤 USER SYSTEM| 🛡️ ADMIN SYSTEM
User Profile| Admin Dashboard
Referral System| Broadcast
Premium Package| User Management
Leaderboard| Maintenance Mode
Number History| Bot Statistics

</div>Feature Details

1. Virtual Number Management

- Mengambil daftar layanan dari provider.
- Menampilkan negara berdasarkan layanan.
- Meminta nomor berdasarkan negara.
- Menampilkan nomor yang berhasil diperoleh.
- Mengganti atau melepaskan nomor.

2. OTP Management

- Monitoring OTP otomatis.
- Mengecek kode OTP terbaru.
- Menampilkan riwayat OTP.
- Notifikasi ketika OTP diterima.
- Menangani timeout dan kegagalan provider.

3. User Management

- Profil pengguna.
- Referral.
- Premium.
- Leaderboard.
- Riwayat aktivitas.

4. Admin Management

- Admin panel.
- Broadcast.
- Statistik.
- Maintenance.
- Pengelolaan pengguna.

---

🏗️ SYSTEM ARCHITECTURE

flowchart TD
    A[Telegram User] --> B[Telegram Bot]
    B --> C[Node.js / Telegraf]
    C --> D[FREEOTP API]
    D --> E[Services]
    D --> F[Countries]
    D --> G[Request Number]
    G --> H[Active Number]
    H --> I[OTP Monitoring]
    I --> J[Latest OTP]
    J --> K[Telegram Notification]
    C --> L[Local Database]
    C --> M[Admin System]

---

🔌 PROVIDER API

FREEOTP API Configuration

Configuration| Value
Provider| FREEOTP
Base URL| "https://nokosproxy.riezallofficial.workers.dev"
Authentication| Public API
API Key| Not Required
Request| GET / POST
Content Type| application/json
Response| JSON

API Base URL

https://nokosproxy.riezallofficial.workers.dev

API Endpoint Reference

Method| Endpoint| Description
GET| "/api/services"| Daftar layanan
GET| "/api/countries"| Daftar negara
POST| "/api/request_number"| Request nomor
GET| "/api/my_numbers"| Nomor aktif
POST| "/api/release_number"| Release nomor
GET| "/api/latest_otp"| OTP terbaru
GET| "/api/my_otps"| Riwayat OTP
GET| "/api/otp"| Live OTP feed
GET| "/api/stats/detailed"| Statistik provider

1. Services

GET /api/services

Contoh respons:

{
  "success": true,
  "services": [
    {
      "name": "WhatsApp",
      "count": 120
    },
    {
      "name": "Telegram",
      "count": 45
    }
  ]
}

2. Countries

GET /api/countries?service=WhatsApp

Contoh respons:

{
  "success": true,
  "countries": [
    {
      "name": "Indonesia",
      "count": 20
    },
    {
      "name": "Malaysia",
      "count": 12
    }
  ]
}

3. Request Number

POST /api/request_number
Content-Type: application/json

Request Body:

{
  "service": "WhatsApp",
  "country": "Indonesia"
}

4. My Numbers

GET /api/my_numbers

5. Release Number

POST /api/release_number
Content-Type: application/json

{
  "number": "6281234567890"
}

6. Latest OTP

GET /api/latest_otp?number=6281234567890

7. OTP History

GET /api/my_otps?limit=10

Filter nomor:

GET /api/my_otps?number=6281234567890&limit=10

8. Live OTP Feed

GET /api/otp?count=10

9. Statistics

GET /api/stats/detailed?period=daily

«Contoh JSON merupakan ilustrasi dari dokumentasi provider. Implementasi harus menyesuaikan respons aktual API.»

---

📂 PROJECT STRUCTURE

NOKOS-MURAH/
│
├── 📁 node_modules/
│
├── 📄 .env
├── 📄 .gitignore
├── 📄 package.json
├── 📄 README.md
│
├── 📄 config.js
├── 📄 database.js
├── 📄 api.js
├── 📄 index.js
│
└── 📄 otp.js

File tambahan dapat tersedia sesuai versi project.

---

⚙️ INSTALLATION

Requirements

Sebelum menjalankan bot, persiapkan:

- Pterodactyl Panel.
- Node.js 22.
- Telegram Bot Token.
- Telegram User ID Admin.
- Source Code Nokos Murah.

STEP 01 — Upload Project

1. Login ke Pterodactyl Panel.
2. Pilih server bot.
3. Buka menu Files.
4. Upload file ZIP.
5. Extract ZIP.
6. Pastikan file "package.json" berada di root directory.

STEP 02 — Configure Environment

Buka ".env" dan isi konfigurasi:

BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
ADMIN_ID=YOUR_TELEGRAM_USER_ID

OTP_API_BASE_URL=https://nokosproxy.riezallofficial.workers.dev

OTP_GROUP_ID=

DATABASE_PATH=./database.json

Configuration Reference

Variable| Description
"BOT_TOKEN"| Token Telegram Bot
"ADMIN_ID"| ID Telegram Admin
"OTP_API_BASE_URL"| FREEOTP API URL
"OTP_GROUP_ID"| Grup notifikasi OTP
"DATABASE_PATH"| Lokasi database

Pertahankan variabel konfigurasi lain yang memang digunakan oleh source code.

STEP 03 — Install Dependencies

Buka Console Pterodactyl:

npm install

Tunggu hingga proses instalasi selesai.

STEP 04 — Start Bot

npm start

Jika konfigurasi benar, bot akan mulai berjalan.

STEP 05 — Startup Configuration

Gunakan startup command:

npm start

Pastikan server menggunakan Node.js 22.

---

🤖 BOT COMMANDS

User Commands

Command| Description
"/start"| Menu utama
"/menu"| Menu bot
"/profile"| Profil pengguna
"/referral"| Referral
"/history"| Riwayat OTP
"/numbers"| Nomor aktif
"/help"| Bantuan

Admin Commands

Command| Description
"/admin"| Admin panel
"/broadcast"| Broadcast
"/stats"| Statistik
"/maintenance"| Maintenance

Ketersediaan perintah mengikuti implementasi source code.

---

🔄 OTP WORKFLOW

flowchart TD
    A([START]) --> B[Main Menu]
    B --> C[Select Service]
    C --> D[Select Country]
    D --> E[Request Number]
    E --> F{Success?}
    F -->|No| G[Show Error]
    G --> B
    F -->|Yes| H[Display Number]
    H --> I[Monitor OTP]
    I --> J{OTP Received?}
    J -->|No| I
    J -->|Yes| K[Display OTP]
    K --> L[Release Number]
    L --> B

---

💻 API INTEGRATION EXAMPLE

JavaScript Fetch

const API_BASE =
  "https://nokosproxy.riezallofficial.workers.dev";

async function getServices() {
  const response = await fetch(
    `${API_BASE}/api/services`
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

getServices()
  .then(console.log)
  .catch(console.error);

PHP cURL

<?php

$base = "https://nokosproxy.riezallofficial.workers.dev";

$ch = curl_init($base . "/api/services");

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Accept: application/json"
    ],
    CURLOPT_TIMEOUT => 20
]);

$response = curl_exec($ch);

if ($response === false) {
    throw new RuntimeException(curl_error($ch));
}

$data = json_decode($response, true);

curl_close($ch);

print_r($data);

?>

---

🧰 TROUBLESHOOTING

<details>
<summary><b>❌ Bot tidak bisa dijalankan</b></summary>Jalankan:

npm install
npm start

Pastikan Node.js sesuai dengan kebutuhan project.

</details><details>
<summary><b>❌ BOT_TOKEN Invalid</b></summary>Periksa kembali token pada ".env".

Jika token pernah bocor, buat token baru melalui BotFather.

</details><details>
<summary><b>❌ Provider API tidak merespons</b></summary>Tes endpoint:

https://nokosproxy.riezallofficial.workers.dev/api/services

Periksa koneksi server, HTTP status, dan respons JSON.

</details><details>
<summary><b>❌ Negara tidak muncul</b></summary>Pastikan layanan yang dikirim ke "/api/countries" sama persis dengan nama layanan dari "/api/services".

</details><details>
<summary><b>❌ OTP tidak masuk</b></summary>Periksa status nomor, layanan, respons "/api/latest_otp", dan koneksi provider.

</details><details>
<summary><b>❌ Database Error</b></summary>Periksa permission direktori dan lokasi database. Pastikan proses Node.js dapat membaca dan menulis file.

</details>---

🛡️ SECURITY & BEST PRACTICES

- Jangan membagikan file ".env".
- Jangan mempublikasikan token bot.
- Validasi semua input pengguna.
- Gunakan timeout API.
- Terapkan rate limiting.
- Lindungi akses admin.
- Jangan menyimpan OTP sensitif tanpa perlindungan.
- Gunakan HTTPS.
- Simpan backup database secara berkala.

---

🌐 OFFICIAL RESOURCES

Resource| Link
FREEOTP Dashboard| https://www.rizaldev.cloud/freeotp
Developer Website| https://www.rizaldev.cloud
Provider API| https://nokosproxy.riezallofficial.workers.dev

---

<div align="center">👨‍💻 DEVELOPED BY

<img src="https://www.rizaldev.cloud/logo.png" width="100" alt="Rizaldev Logo" />RIZALDEV

Backend Developer · API Integration · Bot Developer

"🌐 rizaldev.cloud" (https://www.rizaldev.cloud)

"⚡ FREEOTP DASHBOARD" (https://www.rizaldev.cloud/freeotp)

---

<img src="https://img.shields.io/badge/POWERED%20BY-FREEOTP-087FDB?style=for-the-badge" />FREEOTP BOT — NOKOS MURAH

Built with ❤️ by Rizaldev

© 2026 Rizaldev. All Rights Reserved.

</div>