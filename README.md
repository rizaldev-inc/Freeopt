⚡ FREEOTP BOT — NOKOS MURAH

Virtual Number & OTP Management Platform

""FREEOTP" (https://img.shields.io/badge/PROVIDER-FREEOTP-087FDB?style=flat-square)" (https://www.rizaldev.cloud/freeotp)
""Node.js" (https://img.shields.io/badge/NODE.JS-22-339933?style=flat-square&logo=nodedotjs)" (https://nodejs.org/)
""Telegraf" (https://img.shields.io/badge/FRAMEWORK-TELEGRAF-26A5E4?style=flat-square)" (https://telegraf.js.org/)
""API" (https://img.shields.io/badge/API-LIVE-00C853?style=flat-square)" (https://www.rizaldev.cloud/freeotp)

Bot Telegram berbasis Node.js + Telegraf untuk mengelola nomor virtual, melakukan request nomor, monitoring OTP, dan mengintegrasikan FREEOTP API.

Informasi| Detail
Project| Nokos Murah
Provider| FREEOTP
Runtime| Node.js 22
Framework| Telegraf
API Protocol| REST API
Response| JSON
Hosting| Pterodactyl
Developer| Rizaldev
Version| 2.0

Official Links

- 🌐 Dashboard OTP: https://www.rizaldev.cloud/freeotp
- 👨‍💻 Developer: https://www.rizaldev.cloud
- 🔌 Provider API: https://nokosproxy.riezallofficial.workers.dev

---

📑 TABLE OF CONTENTS

No.| Section| Description
01| "Overview" (#-overview)| Pengenalan project
02| "Features" (#-features)| Fitur bot
03| "Architecture" (#-system-architecture)| Arsitektur sistem
04| "Provider API" (#-provider-api)| Integrasi API
05| "Structure" (#-project-structure)| Struktur file
06| "Installation" (#-installation)| Instalasi Pterodactyl
07| "Configuration" (#-configuration)| Konfigurasi bot
08| "Commands" (#-bot-commands)| Perintah bot
09| "OTP Workflow" (#-otp-workflow)| Alur OTP
10| "Integration" (#-api-integration)| Contoh kode
11| "Troubleshooting" (#-troubleshooting)| Solusi error
12| "Security" (#-security)| Keamanan
13| "Developer" (#-developer)| Informasi developer

---

🚀 OVERVIEW

FREEOTP Bot merupakan aplikasi Telegram otomatis yang menggunakan FREEOTP API sebagai provider utama.

Sistem memungkinkan pengguna untuk memilih layanan, memilih negara, meminta nomor virtual, serta memantau kode OTP melalui Telegram.

Core System

Module| Function
Number Manager| Mengelola nomor virtual
Service Manager| Mengambil daftar layanan
Country Manager| Mengambil daftar negara
OTP Monitor| Memantau OTP otomatis
User Manager| Mengelola pengguna
Referral System| Sistem referral
Premium System| Pengelolaan premium
Admin Manager| Administrasi bot
Database| Penyimpanan data

✨ FEATURES

📱 Virtual Number

- Request nomor virtual.
- Multi-service.
- Multi-country.
- Dynamic country selection.
- Change number.
- Release number.
- Active number management.

🔐 OTP Management

- Automatic OTP polling.
- Latest OTP checking.
- OTP history.
- Live OTP feed.
- OTP notifications.
- Error handling.

👤 User System

- User profile.
- Referral system.
- Premium package.
- Leaderboard.
- User history.

🛡️ Admin System

- Admin panel.
- User management.
- Broadcast messages.
- Bot statistics.
- Maintenance mode.

📄 Additional Features

- Export nomor aktif ke TXT.
- Database lokal.
- API timeout.
- JSON response validation.
- Automatic error handling.

---

🏗️ SYSTEM ARCHITECTURE

flowchart TD
    A[Telegram User] --> B[Telegram Bot]
    B --> C[Node.js / Telegraf]
    C --> D[FREEOTP API]
    C --> E[Local Database]
    C --> F[Admin System]

    D --> G[Services]
    D --> H[Countries]
    D --> I[Request Number]
    I --> J[Active Numbers]
    J --> K[OTP Monitoring]
    K --> L[Latest OTP]
    L --> M[Telegram Notification]

---

🔌 PROVIDER API

FREEOTP API

Configuration| Value
Provider| FREEOTP
Base URL| "https://nokosproxy.riezallofficial.workers.dev"
Authentication| Public API
API Key| Tidak diperlukan menurut dokumentasi
HTTP Methods| GET / POST
Content Type| application/json
Response Format| JSON

API Endpoint Reference

Method| Endpoint| Description
GET| "/api/services"| Daftar layanan
GET| "/api/countries"| Daftar negara
POST| "/api/request_number"| Request nomor
GET| "/api/my_numbers"| Nomor aktif
POST| "/api/release_number"| Lepas nomor
GET| "/api/latest_otp"| OTP terbaru
GET| "/api/my_otps"| Riwayat OTP
GET| "/api/otp"| Live OTP feed
GET| "/api/stats/detailed"| Statistik provider

1. Get Services

Mengambil daftar layanan yang tersedia.

Request

GET /api/services

Example Response

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

2. Get Countries

Mengambil negara berdasarkan layanan.

Request

GET /api/countries?service=WhatsApp

Example Response

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

Meminta nomor virtual berdasarkan layanan dan negara.

Request

POST /api/request_number
Content-Type: application/json

Request Body

{
  "service": "WhatsApp",
  "country": "Indonesia"
}

Example Response

{
  "success": true,
  "number": "6281234567890",
  "id": "transaction_id"
}

4. My Numbers

Mengambil nomor aktif.

GET /api/my_numbers

5. Release Number

Melepaskan nomor aktif.

POST /api/release_number
Content-Type: application/json

{
  "number": "6281234567890"
}

6. Latest OTP

Mengambil kode OTP terbaru.

GET /api/latest_otp?number=6281234567890

7. OTP History

Mengambil riwayat OTP.

GET /api/my_otps?limit=10

Filter berdasarkan nomor:

GET /api/my_otps?number=6281234567890&limit=10

8. Live OTP Feed

Mengambil feed OTP publik.

GET /api/otp?count=10

9. Detailed Statistics

Mengambil statistik provider.

GET /api/stats/detailed?period=daily

«Catatan: contoh respons di atas merupakan ilustrasi dokumentasi API. Struktur respons aktual harus mengikuti data yang dikembalikan provider.»

---

📂 PROJECT STRUCTURE

NOKOS-MURAH/
│
├── .env
├── .gitignore
├── package.json
├── README.md
│
├── config.js
├── database.js
├── api.js
├── index.js
├── otp.js
│
└── node_modules/

File| Function
".env"| Konfigurasi environment
"package.json"| Dependencies dan scripts
"config.js"| Konfigurasi bot
"database.js"| Database management
"api.js"| FREEOTP API integration
"index.js"| Main application
"otp.js"| OTP management
"README.md"| Dokumentasi project

---

⚙️ INSTALLATION

Requirements

Sebelum instalasi, siapkan:

- Pterodactyl Panel.
- Node.js 22.
- Telegram Bot Token.
- Telegram User ID Admin.
- Source code FREEOTP Bot.

STEP 01 — Upload Project

1. Login ke Pterodactyl Panel.
2. Pilih server bot.
3. Buka menu Files.
4. Upload ZIP project.
5. Extract ZIP.
6. Pastikan "package.json" berada di direktori utama.

STEP 02 — Configure Environment

Buka file ".env".

Isi konfigurasi berikut:

BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
ADMIN_ID=YOUR_TELEGRAM_USER_ID

OTP_API_BASE_URL=https://nokosproxy.riezallofficial.workers.dev

OTP_GROUP_ID=

DATABASE_PATH=./database.json

Environment Reference

Variable| Description
"BOT_TOKEN"| Token Telegram Bot
"ADMIN_ID"| ID Telegram Admin
"OTP_API_BASE_URL"| FREEOTP API URL
"OTP_GROUP_ID"| Grup notifikasi OTP
"DATABASE_PATH"| Lokasi database

Pertahankan konfigurasi tambahan yang memang dibutuhkan oleh source code.

STEP 03 — Install Dependencies

Buka menu Console.

Jalankan:

npm install

Tunggu hingga proses instalasi selesai.

STEP 04 — Start Bot

Jalankan:

npm start

Jika konfigurasi benar, bot akan mulai berjalan.

STEP 05 — Startup Configuration

Gunakan startup command:

npm start

Pastikan server menggunakan Node.js 22 dan direktori kerja project sudah benar.

---

🤖 BOT COMMANDS

User Commands

Command| Description
"/start"| Membuka menu utama
"/menu"| Menampilkan menu
"/profile"| Profil pengguna
"/referral"| Informasi referral
"/history"| Riwayat OTP
"/numbers"| Nomor aktif
"/help"| Bantuan

Admin Commands

Command| Description
"/admin"| Admin panel
"/broadcast"| Broadcast pengguna
"/stats"| Statistik bot
"/maintenance"| Maintenance mode

«Daftar perintah mengikuti implementasi aktual source code.»

---

🔄 OTP WORKFLOW

flowchart TD
    A([START]) --> B[Main Menu]
    B --> C[Select Service]
    C --> D[Select Country]
    D --> E[Request Number]
    E --> F{API Success?}
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

💻 API INTEGRATION

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
<summary><strong>Bot tidak bisa dijalankan</strong></summary>Jalankan ulang:

npm install
npm start

Periksa versi Node.js dan konfigurasi startup.

</details><details>
<summary><strong>BOT_TOKEN Invalid</strong></summary>Pastikan token Telegram pada ".env" benar dan masih aktif. Jika token bocor, segera regenerasi melalui BotFather.

</details><details>
<summary><strong>Provider API tidak merespons</strong></summary>Tes endpoint berikut:

https://nokosproxy.riezallofficial.workers.dev/api/services

Periksa koneksi server dan respons JSON.

</details><details>
<summary><strong>Negara tidak muncul</strong></summary>Pastikan nama layanan yang dikirim sama persis dengan data dari "/api/services".

</details><details>
<summary><strong>OTP tidak diterima</strong></summary>Periksa status nomor, layanan, negara, dan respons "/api/latest_otp".

</details><details>
<summary><strong>Database Error</strong></summary>Periksa permission direktori dan pastikan proses Node.js dapat membaca serta menulis database.

</details>---

🛡️ SECURITY & BEST PRACTICES

- Jangan membagikan ".env".
- Jangan mempublikasikan BOT_TOKEN.
- Validasi seluruh input pengguna.
- Gunakan HTTPS.
- Terapkan rate limiting.
- Gunakan timeout untuk API request.
- Batasi akses admin berdasarkan Telegram ID.
- Lindungi data pengguna.
- Buat backup database secara berkala.

Security Notice: Public API tidak berarti semua data yang dikembalikan boleh disebarluaskan. Lindungi nomor dan informasi OTP pengguna.

---

🌐 OFFICIAL RESOURCES

Resource| URL
FREEOTP Dashboard| "Open Dashboard" (https://www.rizaldev.cloud/freeotp)
Developer Website| "Rizaldev.cloud" (https://www.rizaldev.cloud)
Provider API| "FREEOTP API" (https://nokosproxy.riezallofficial.workers.dev)

---

👨‍💻 DEVELOPER

RIZALDEV

Backend Developer · API Integration · Telegram Bot Developer

- Website: https://www.rizaldev.cloud
- Dashboard: https://www.rizaldev.cloud/freeotp

---

<div align="center">FREEOTP BOT — NOKOS MURAH

Powered by FREEOTP API

Developed with ❤️ by Rizaldev

© 2026 Rizaldev. All Rights Reserved.

</div>