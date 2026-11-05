
🚀 FREEOTP BOT — NOKOS MURAH

<p align="center">  <img src="https://img.shields.io/badge/FREEOTP-API%20INTEGRATION-087FDB?style=for-the-badge" />
  <img src="https://img.shields.io/badge/NODE.JS-22.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TELEGRAF-TELEGRAM%20BOT-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" />
  <img src="https://img.shields.io/badge/STATUS-LIVE-00C853?style=for-the-badge" /></p><p align="center">Platform Telegram Bot Virtual Number & OTP

Bot Telegram otomatis untuk mendapatkan nomor virtual, menerima kode OTP, mengelola nomor aktif, dan memantau aktivitas OTP menggunakan FREEOTP API.

  <br>🌐 Dashboard OTP: https://www.rizaldev.cloud/freeotp

👨‍💻 Developer: "Rizaldev" (https://www.rizaldev.cloud)

</p>---

📸 PREVIEW & DASHBOARD

<p align="center">  <a href="https://www.rizaldev.cloud/freeotp">
    <img src="https://img.shields.io/badge/OPEN-FREEOTP%20DASHBOARD-087FDB?style=for-the-badge&logo=googlechrome&logoColor=white" />
  </a></p>Dashboard FREEOTP menyediakan dokumentasi dan informasi API untuk developer yang ingin mengintegrasikan provider ke website atau aplikasi mereka sendiri.

---

✨ FITUR UTAMA

Fitur| Keterangan
📱 Request Number| Meminta nomor virtual otomatis
🌍 Multi Country| Memilih negara berdasarkan API
📦 Multi Service| Memilih layanan yang tersedia
🔐 Auto OTP| Monitoring OTP otomatis
🔄 Change Number| Mengganti nomor aktif
🌎 Change Country| Mengganti negara
🗑️ Release Number| Melepaskan nomor
📄 Get File| Export nomor aktif ke TXT
📊 Statistics| Statistik provider
📜 OTP History| Riwayat OTP
👤 User Profile| Profil pengguna
🎁 Referral| Sistem referral
⭐ Premium| Sistem paket premium
🏆 Leaderboard| Peringkat pengguna
🛡️ Admin Panel| Panel administrasi
📢 Broadcast| Mengirim pesan massal
🔧 Maintenance| Mengaktifkan maintenance

---

🔌 PROVIDER API

FREEOTP API — Official Integration

BASE URL:
https://nokosproxy.riezallofficial.workers.dev

Pengaturan| Nilai
Provider| FREEOTP
Authentication| Public API
API Key| Tidak diperlukan menurut dokumentasi
Request Format| JSON
Response Format| JSON
Protocol| HTTPS
Connection| REST API

Daftar Endpoint

Method| Endpoint| Fungsi
GET| "/api/services"| Daftar layanan
GET| "/api/countries"| Daftar negara
POST| "/api/request_number"| Request nomor
GET| "/api/my_numbers"| Nomor aktif
POST| "/api/release_number"| Lepas nomor
GET| "/api/latest_otp"| OTP terbaru
GET| "/api/my_otps"| Riwayat OTP
GET| "/api/otp"| Live OTP Feed
GET| "/api/stats/detailed"| Statistik provider

Contoh Request Nomor

POST /api/request_number
Content-Type: application/json

{
  "service": "WhatsApp",
  "country": "Indonesia"
}

Contoh respons:

{
  "success": true,
  "number": "6281234567890",
  "id": "transaction_id"
}

Contoh Cek OTP

GET /api/latest_otp?number=6281234567890

Contoh respons:

{
  "success": true,
  "has_otp": true,
  "otp_code": "123456"
}

---

📂 STRUKTUR PROJECT

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

«Struktur dapat berbeda mengikuti versi source code yang digunakan. Jangan menghapus file yang dibutuhkan oleh project.»

---

⚙️ INSTALASI PTERODACTYL

1. Persiapan

Pastikan kamu memiliki:

- Panel Pterodactyl.
- Telegram Bot Token.
- Telegram User ID untuk admin.
- Node.js versi 22.
- File source code FREEOTP Bot.

2. Upload Source Code

1. Buka panel Pterodactyl.
2. Pilih server bot.
3. Masuk ke menu Files.
4. Upload ZIP project.
5. Extract ZIP.
6. Pastikan "package.json", "index.js", dan ".env" berada di direktori utama.

3. Konfigurasi Environment

Buka file ".env" dan sesuaikan konfigurasi:

# TELEGRAM BOT
BOT_TOKEN=MASUKKAN_TOKEN_BOT
ADMIN_ID=MASUKKAN_TELEGRAM_ID

# FREEOTP PROVIDER
OTP_API_BASE_URL=https://nokosproxy.riezallofficial.workers.dev

# OTP GROUP
OTP_GROUP_ID=

# DATABASE
DATABASE_PATH=./database.json

Keterangan:

Variable| Fungsi
"BOT_TOKEN"| Token Telegram Bot
"ADMIN_ID"| Telegram ID admin utama
"OTP_API_BASE_URL"| URL provider FREEOTP
"OTP_GROUP_ID"| ID grup notifikasi OTP
"DATABASE_PATH"| Lokasi database lokal

«Pertahankan konfigurasi tambahan yang sudah ada pada ".env" project kamu. Jangan menghapus environment variable yang masih digunakan source code.»

4. Install Dependencies

Masuk ke menu Console Pterodactyl.

Jalankan:

npm install

Tunggu hingga proses instalasi selesai.

5. Menjalankan Bot

npm start

Jika konfigurasi benar, bot akan terhubung ke Telegram dan siap digunakan.

6. Startup Configuration

Pastikan Startup Command menggunakan:

npm start

Pastikan egg menggunakan Node.js 22 yang kompatibel dengan project.

---

🤖 PERINTAH BOT

User Commands

Command| Fungsi
"/start"| Membuka menu utama
"/menu"| Menampilkan menu
"/profile"| Melihat profil
"/referral"| Informasi referral
"/history"| Riwayat OTP
"/numbers"| Nomor aktif
"/help"| Bantuan

Admin Commands

Command| Fungsi
"/admin"| Membuka admin panel
"/broadcast"| Broadcast pengguna
"/stats"| Statistik bot
"/maintenance"| Maintenance mode

«Perintah di atas merupakan dokumentasi menu yang dituju. Ketersediaannya mengikuti implementasi source code.»

---

🔄 ALUR SISTEM OTP

flowchart TD
    A([User Start Bot]) --> B[Main Menu]
    B --> C[Pilih Layanan]
    C --> D[Ambil Daftar Negara]
    D --> E[Pilih Negara]
    E --> F[Request Number]
    F --> G{API Success?}
    G -->|Tidak| H[Tampilkan Error]
    H --> B
    G -->|Ya| I[Tampilkan Nomor]
    I --> J[Monitoring OTP]
    J --> K{OTP Diterima?}
    K -->|Belum| J
    K -->|Sudah| L[Tampilkan Kode OTP]
    L --> M[Release Number]
    M --> B

---

🛡️ SECURITY & PROTECTION

Keamanan merupakan bagian penting dari sistem.

- Jangan membagikan ".env".
- Jangan mempublikasikan BOT_TOKEN.
- Jangan memasukkan token ke repository publik.
- Gunakan validasi input pengguna.
- Gunakan timeout untuk request API.
- Tangani error provider dengan benar.
- Batasi request agar tidak terjadi spam.
- Lindungi perintah admin dengan ADMIN_ID.
- Jangan menyimpan data sensitif tanpa perlindungan.

PENTING: Jika token Telegram pernah bocor atau masuk ke ZIP publik, segera revoke dan buat token baru melalui BotFather.

---

🧰 TROUBLESHOOTING

1. Bot tidak bisa dijalankan

Coba:

npm install
npm start

Pastikan Node.js sesuai dengan versi yang dibutuhkan.

2. BOT_TOKEN Invalid

Periksa token pada ".env".

Pastikan tidak ada spasi tambahan.

3. Provider tidak merespons

Periksa koneksi server dan URL API:

https://nokosproxy.riezallofficial.workers.dev/api/services

4. Negara tidak muncul

Pastikan nama layanan berasal dari respons "/api/services", kemudian gunakan nama layanan tersebut untuk mengambil daftar negara.

5. OTP tidak masuk

Pastikan nomor masih aktif dan provider mendukung layanan serta negara yang dipilih.

6. Database Error

Periksa permission direktori project dan lokasi penyimpanan database.

---

📡 API DOCUMENTATION

Developer dapat mempelajari integrasi FREEOTP melalui dashboard resmi:

<p align="center">  <a href="https://www.rizaldev.cloud/freeotp">
    <img src="https://img.shields.io/badge/FREEOTP-API%20DOCUMENTATION-087FDB?style=for-the-badge&logo=readthedocs&logoColor=white" />
  </a></p>Dashboard: https://www.rizaldev.cloud/freeotp

Dokumentasi mencakup:

- Daftar layanan.
- Daftar negara.
- Request nomor.
- Nomor aktif.
- Release nomor.
- Latest OTP.
- OTP History.
- Live OTP Feed.
- Statistik provider.
- Contoh integrasi JavaScript, PHP, dan cURL.

---

👨‍💻 DEVELOPER

<p align="center">  <img src="https://www.rizaldev.cloud/logo.png" width="110" alt="Rizaldev Logo" />  <br>RIZALDEV

Developer & API Integration

🌐 https://www.rizaldev.cloud

📡 https://www.rizaldev.cloud/freeotp

</p>---

<p align="center">FREEOTP BOT — NOKOS MURAH

Powered by FREEOTP API

Developed with ❤️ by Rizaldev

© 2026 Rizaldev. All Rights Reserved.

</p>