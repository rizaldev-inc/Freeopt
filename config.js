require("dotenv").config();

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Konfigurasi ${name} belum diisi di .env`);
  return value;
}

const config = {
  botName: process.env.BOT_NAME || "Nokos Murah",
  botToken: required("BOT_TOKEN"),
  botUsername: (process.env.BOT_USERNAME || "").replace(/^@/, ""),
  adminId: String(required("ADMIN_ID")),
  apiBaseUrl: (process.env.OTP_API_BASE_URL || "https://nokosproxy.riezallofficial.workers.dev").replace(/\/+$/, ""),
  otpGroupId: process.env.OTP_GROUP_ID || "",
  supportUsername: (process.env.SUPPORT_USERNAME || "rizaldev").replace(/^@/, ""),
  freeDailyLimit: Math.max(0, Number(process.env.FREE_DAILY_LIMIT || 3)),
  timezone: process.env.TIMEZONE || "Asia/Jakarta",
  premiumPrice: Math.max(0, Number(process.env.PREMIUM_PRICE || 15000)),
  premiumLimit: Math.max(0, Number(process.env.PREMIUM_LIMIT || 50)),
  premiumDays: Math.max(1, Number(process.env.PREMIUM_DAYS || 30)),
  dataDir: process.env.DATA_DIR || "./data",
  otpWaitSeconds: Math.max(15, Number(process.env.OTP_WAIT_SECONDS || 180)),
  otpPollIntervalSeconds: Math.max(3, Number(process.env.OTP_POLL_INTERVAL_SECONDS || 5)),
  pollIntervalSeconds: Math.max(5, Number(process.env.POLL_INTERVAL_SECONDS || 10))
};

module.exports = config;
