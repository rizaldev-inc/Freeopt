const fs = require("fs");
const path = require("path");
const config = require("./config");

fs.mkdirSync(config.dataDir, { recursive: true });
const dbPath = path.join(config.dataDir, "db.json");

const empty = {
  users: {},
  orders: [],
  settings: {
    freeDailyLimit: config.freeDailyLimit,
    premiumPrice: config.premiumPrice,
    premiumLimit: config.premiumLimit,
    premiumDays: config.premiumDays,
    maintenance: false,
    welcomeText: ""
  }
};

function read() {
  try {
    if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify(empty, null, 2));
    const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    return {
      ...empty, ...data,
      users: data.users || {},
      orders: data.orders || [],
      settings: { ...empty.settings, ...(data.settings || {}) }
    };
  } catch (e) {
    throw new Error(`Database tidak bisa dibaca (${e.message}). Backup data/db.json sebelum memperbaiki.`);
  }
}
function write(data) {
  const temp = `${dbPath}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(data, null, 2));
  fs.renameSync(temp, dbPath);
}
function getUser(id, from = {}) {
  const db = read();
  const key = String(id);
  if (!db.users[key]) {
    db.users[key] = {
      id: key,
      firstName: from.first_name || "Pengguna",
      username: from.username || "",
      joinedAt: new Date().toISOString(),
      usedToday: 0,
      limitDate: dateKey(),
      premiumUntil: null,
      bonusLimit: 0,
      blocked: false,
      totalRequests: 0,
      successfulRequests: 0,
      referralBonus: 0,
      referralCount: 0,
      referralCredits: 0,
      referredBy: null,
      otpDate: null,
      otpToday: 0
    };
  } else {
    db.users[key].firstName = from.first_name || db.users[key].firstName;
    db.users[key].username = from.username || db.users[key].username;
  }
  write(db);
  return db.users[key];
}
function dateKey() {
  // Kunci harian mengikuti tanggal lokal yang dikonfigurasi pada server.
  return new Intl.DateTimeFormat("en-CA", { timeZone: config.timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
function refreshDaily(user) {
  const today = dateKey();
  if (user.limitDate !== today) {
    user.usedToday = 0;
    user.limitDate = today;
  }
  return user;
}
function saveUser(user) {
  const db = read();
  db.users[String(user.id)] = user;
  write(db);
}
function allUsers() { return Object.values(read().users); }
function settings() { return read().settings; }
function updateSettings(patch) {
  const db = read();
  db.settings = { ...db.settings, ...patch };
  write(db);
  return db.settings;
}
function addOrder(order) {
  const db = read();
  db.orders.unshift({ id: `ORD-${Date.now()}`, createdAt: new Date().toISOString(), ...order });
  db.orders = db.orders.slice(0, 5000);
  write(db);
}
function getStats() {
  const db = read();
  const users = Object.values(db.users);
  return {
    users: users.length,
    blocked: users.filter(u => u.blocked).length,
    premium: users.filter(u => u.premiumUntil && new Date(u.premiumUntil) > new Date()).length,
    requests: users.reduce((n, u) => n + (u.totalRequests || 0), 0),
    successful: users.reduce((n, u) => n + (u.successfulRequests || 0), 0),
    orders: db.orders.length
  };
}
module.exports = { getUser, saveUser, allUsers, settings, updateSettings, addOrder, getStats, refreshDaily };
