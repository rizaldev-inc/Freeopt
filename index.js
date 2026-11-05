'use strict';
const { Telegraf, Markup } = require('telegraf');
const config = require('./config');
const db = require('./database');
const api = require('./api');
const bot = new Telegraf(config.botToken);
const sessions = new Map();
const activeNumbers = new Map();
const latestNumberByUser = new Map();
const serviceNames = { wa:'WhatsApp', whatsapp:'WhatsApp', tg:'Telegram', telegram:'Telegram', go:'Grab', sh:'Shopee', viber:'Viber', vi:'Viber', fb:'Facebook', ig:'Instagram', tw:'Twitter / X', tt:'TikTok' };
const activePolls = new Set();
const admin = ctx => String(ctx.from?.id) === String(config.adminId);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(Number(n || 0));
const premium = u => !!(u.premiumUntil && new Date(u.premiumUntil) > new Date());
const kb = Markup.inlineKeyboard;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Normalisasi label negara FREEOTP dan emoji bendera untuk tampilan Telegram.
const countryAliases = {
  ID:'Indonesia', IDN:'Indonesia', IN:'India', US:'Amerika Serikat', USA:'Amerika Serikat',
  GB:'Britania Raya', UK:'Britania Raya', UA:'Ukraina', RU:'Rusia', PK:'Pakistan', AF:'Afghanistan',
  SD:'Sudan', SN:'Senegal', TZ:'Tanzania', LK:'Sri Lanka', EC:'Ekuador', SA:'Arab Saudi',
  LA:'Laos', VN:'Vietnam', TH:'Thailand', MY:'Malaysia', SG:'Singapura', PH:'Filipina',
  BD:'Bangladesh', NP:'Nepal', CN:'Tiongkok', JP:'Jepang', KR:'Korea Selatan', DE:'Jerman',
  FR:'Prancis', ES:'Spanyol', IT:'Italia', BR:'Brasil', MX:'Meksiko', TR:'Turki', EG:'Mesir',
  NG:'Nigeria', KE:'Kenya', GH:'Ghana', ET:'Etiopia', MA:'Maroko', DZ:'Aljazair', AR:'Argentina',
  CL:'Cile', CO:'Kolombia', PE:'Peru', CA:'Kanada', AU:'Australia', NZ:'Selandia Baru',
  NL:'Belanda', BE:'Belgia', PL:'Polandia', PT:'Portugal', SE:'Swedia', NO:'Norwegia',
  FI:'Finlandia', DK:'Denmark', GR:'Yunani', RO:'Rumania', HU:'Hungaria', CZ:'Ceko',
  IL:'Israel', IR:'Iran', IQ:'Irak', AE:'Uni Emirat Arab', QA:'Qatar', KW:'Kuwait',
  MM:'Myanmar', KH:'Kamboja', TW:'Taiwan', HK:'Hong Kong', UZ:'Uzbekistan', KZ:'Kazakhstan',
  GE:'Georgia', AM:'Armenia', AZ:'Azerbaijan', BY:'Belarus', MD:'Moldova', RS:'Serbia',
  HR:'Kroasia', BG:'Bulgaria', CH:'Swiss', AT:'Austria', IE:'Irlandia', IS:'Islandia',
  BO:'Bolivia', VE:'Venezuela', PY:'Paraguay', UY:'Uruguay', CR:'Kosta Rika', PA:'Panama',
  DO:'Republik Dominika', CU:'Kuba', JM:'Jamaika', TN:'Tunisia', LY:'Libya', UG:'Uganda',
  CM:'Kamerun', CI:'Pantai Gading', AO:'Angola', MZ:'Mozambik', ZM:'Zambia', ZW:'Zimbabwe',
  SN:'Senegal', SO:'Somalia', YE:'Yaman', SY:'Suriah', JO:'Yordania', LB:'Lebanon', OM:'Oman'
};
const displayRegion = new Intl.DisplayNames(['id'], { type: 'region' });
function countryInfo(raw) {
  const value = String(raw?.name ?? raw?.country_name ?? raw?.country ?? raw?.code ?? raw?.iso2 ?? raw?.id ?? raw ?? '').trim();
  const codeRaw = String(raw?.iso2 ?? raw?.country_code ?? raw?.code ?? raw?.countryCode ?? '').trim().toUpperCase();
  let code = /^[A-Z]{2}$/.test(codeRaw) ? codeRaw : (/^[A-Z]{2}$/.test(value.toUpperCase()) ? value.toUpperCase() : '');
  let name = countryAliases[code] || '';
  if (!name && code) { try { name = displayRegion.of(code); } catch {} }
  if (!name || name === code) name = value;
  // Angka kode negara kadang dipakai provider; coba nama negara yang umum.
  const numeric = String(raw?.id ?? raw?.code ?? value);
  const numericMap = {'0':'Amerika Serikat','1':'Amerika Serikat','6':'Indonesia','7':'Rusia','16':'Britania Raya','36':'Australia','44':'Britania Raya','50':'Bangladesh','91':'India','92':'Pakistan','93':'Afghanistan','94':'Sri Lanka','98':'Iran'};
  if (/^\d+$/.test(numeric) && numericMap[numeric] && (!value || /^\d+$/.test(value))) name = numericMap[numeric];
  if (!name) name = value || 'Negara';
  if (name.toUpperCase() === 'UK') name = 'Britania Raya';
  if (name.toUpperCase() === 'USA') name = 'Amerika Serikat';
  const reverseFlags = {'Indonesia':'ID','Ukraina':'UA','Britania Raya':'GB','Amerika Serikat':'US','Pakistan':'PK','Afghanistan':'AF','Sudan':'SD','Senegal':'SN','Tanzania':'TZ','India':'IN','Rusia':'RU','Australia':'AU','Malaysia':'MY','Singapura':'SG','Thailand':'TH','Vietnam':'VN','Filipina':'PH','Bangladesh':'BD','Nepal':'NP','Sri Lanka':'LK','Arab Saudi':'SA','Uni Emirat Arab':'AE','Jepang':'JP','Korea Selatan':'KR','Tiongkok':'CN','Jerman':'DE','Prancis':'FR','Spanyol':'ES','Italia':'IT','Brasil':'BR','Meksiko':'MX','Turki':'TR','Mesir':'EG','Nigeria':'NG','Kenya':'KE','Kanada':'CA','Selandia Baru':'NZ','Belanda':'NL','Belgia':'BE','Portugal':'PT','Swedia':'SE','Norwegia':'NO','Finlandia':'FI','Denmark':'DK','Ukraina':'UA','Polandia':'PL','Iran':'IR','Irak':'IQ','Kamboja':'KH','Myanmar':'MM','Taiwan':'TW','Hong Kong':'HK','Uzbekistan':'UZ','Kazakhstan':'KZ','Maroko':'MA','Aljazair':'DZ','Ekuador':'EC','Laos':'LA'};
  const flagCode = (/^[A-Z]{2}$/.test(code) ? (code === 'UK' ? 'GB' : code) : '') || reverseFlags[name] || '';
  const flag = flagCode ? [...flagCode].map(ch => String.fromCodePoint(127397 + ch.charCodeAt(0))).join('') : '🌍';
  return { name, flag, code: raw?.code ?? raw?.id ?? raw?.country_code ?? raw?.iso2 ?? value };
}
function maskNumber(n) { const s=String(n||''); return s.length < 7 ? '••••' : `${s.slice(0,3)}••••${s.slice(-2)}`; }
function maskOtp(otp) { const s=String(otp||''); return s.length < 3 ? '••••' : `${'•'.repeat(Math.max(3,s.length-2))}${s.slice(-2)}`; }
function todayKey() { return new Intl.DateTimeFormat('en-CA',{timeZone:config.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); }
function ensureOtpDaily(u) {
  if (u.otpDate !== todayKey()) { u.otpDate = todayKey(); u.otpToday = 0; db.saveUser(u); }
  return Number(u.otpToday || 0);
}
function homeKeys(isAdmin=false) {
  const rows = [
    [Markup.button.callback('📞 GET NUMBER','get_number'), Markup.button.callback('📂 GET FILE','get_file')],
    [Markup.button.callback('👤 PROFILE','profile'), Markup.button.callback('🎁 REFERRAL','referral')],
    [Markup.button.callback('🏆 LEADERBOARD','leaderboard'), Markup.button.callback('💬 SUPPORT','support')],
    [Markup.button.callback('⭐ UPGRADE PREMIUM','upgrade_premium')]
  ];
  if (isAdmin) rows.push([Markup.button.callback('⚙️ ADMIN PANEL','admin')]);
  return kb(rows);
}
function homeText(u) {
  const count = ensureOtpDaily(u);
  return `✦ <b>FREEOTP</b> <i>— VIRTUAL NUMBER CENTER</i>
━━━━━━━━━━━━━━━━━━
Halo, <b>${esc(u.firstName)}</b> 👋

📡 Provider: <b>FREEOTP API</b>
📨 Total request: <b>${u.totalRequests||0}</b>
🔐 OTP hari ini: <b>${count}/${3 + Number(u.referralBonus || 0)}</b>
💎 Membership: <b>${premium(u)?'PREMIUM':'FREE'}</b>

<i>Pilih layanan yang ingin kamu gunakan.</i>`;
}
async function screen(ctx, text, extra={}) {
  try {
    if (ctx.callbackQuery?.message) return await ctx.editMessageText(text, { parse_mode:'HTML', ...extra });
    return await ctx.reply(text, { parse_mode:'HTML', ...extra });
  } catch (e) {
    if (/message is not modified/i.test(e.description || '')) return;
    if (/message can't be edited|message to edit not found|message identifier is not specified/i.test(e.description || '')) {
      try { return await ctx.reply(text, {parse_mode:'HTML', ...extra}); } catch {}
    }
  }
}
async function home(ctx) {
  const u = db.getUser(ctx.from.id, ctx.from);
  if (u.blocked) return screen(ctx, 'Akun kamu sedang dibatasi. Hubungi admin.');
  return screen(ctx, homeText(u), homeKeys(admin(ctx)));
}
function adminKeys() { return kb([
  [Markup.button.callback('👥 TOTAL PENGGUNA','admin_users'),Markup.button.callback('📊 STATISTIK','admin_stats')],
  [Markup.button.callback('📣 BROADCAST','admin_broadcast'),Markup.button.callback('🔧 MAINTENANCE','admin_maintenance')],
  [Markup.button.callback('♻️ RESTART BOT','admin_restart')],
  [Markup.button.callback('🏠 MENU UTAMA','home')]
]); }
async function adminPanel(ctx) {
  if (!admin(ctx)) return screen(ctx,'Akses ditolak.');
  const st=db.getStats(), s=db.settings();
  return screen(ctx,`⚙️ <b>ADMIN PANEL — FREEOTP</b>\n━━━━━━━━━━━━━━━━━━\n👥 Pengguna: ${st.users}\n⭐ Premium aktif: ${st.premium}\n📞 Total permintaan nomor: ${st.requests}\n🔑 Total OTP diterima: ${st.successful}\n\nBatas OTP harian/user: <b>3</b>\nHarga paket: ${money(s.premiumPrice)}\nLimit paket: ${s.premiumLimit}\nMasa aktif: ${s.premiumDays} hari\nMaintenance: ${s.maintenance?'AKTIF':'OFF'}`,adminKeys());
}
function serviceLabel(item) {
  const raw=String(item?.name ?? item?.service_name ?? item?.service ?? item?.code ?? item?.id ?? item);
  const label=serviceNames[raw.toLowerCase()] || raw;
  return item && item.count != null ? `${label} · ${item.count} stok` : label;
}
function serviceName(service) { return serviceNames[String(service).toLowerCase()] || String(service); }
function serviceCode(item) { return String(item?.name ?? item?.service_name ?? item?.service ?? item?.code ?? item?.id ?? item); }
function normalizeOtpResult(d) {
  const root = d?.data || d?.result || d?.otp || d || {};
  const otp = root.otp_code ?? root.otp ?? root.code ?? root.sms_code ?? root.latest_otp ?? '';
  const has = root.has_otp === true || root.received === true || root.status === 'received' ||
    root.status === 'success' || root.status === 'completed' || root.status === 'otp_received' ||
    (otp !== '' && otp != null);
  return { hasOtp: has && String(otp).trim().length > 0, otp: String(otp || '').trim(), message: root.message || root.sms || '' };
}

async function postOtpToGroup({service,country,number,otp}) {
  if (!config.otpGroupId) return;
  const c=countryInfo(country);
  const text = `🎉 <b>NEW OTP RECEIVED</b>\n━━━━━━━━━━━━━━━━━━\n📱 ${esc(serviceName(service))}\n🌍 ${c.flag} ${esc(c.name)}\n☎️ ${esc(maskNumber(number))}\n🔑 OTP: <code>${esc(maskOtp(otp))}</code>\n━━━━━━━━━━━━━━━━━━`;
  try { await bot.telegram.sendMessage(config.otpGroupId, text, {parse_mode:'HTML', disable_web_page_preview:true}); }
  catch (e) { console.error('OTP group notification failed:',e.description || e.message); }
}
async function pollOtp({userId,messageId,number,service,country}) {
  const pollKey = `${userId}:${number}`;
  if (activePolls.has(pollKey)) return;
  activePolls.add(pollKey);
  try {
    // Terus menunggu OTP; tidak ada timer expired otomatis.
    while (true) {
      await sleep(config.otpPollIntervalSeconds*1000);
      let result;
      try { result=normalizeOtpResult(await api.latestOtp(number)); } catch { continue; }
      if (!result.hasOtp) continue;
      const u=db.getUser(userId,{});
      const count=ensureOtpDaily(u);
      const dailyCap = 3 + Number(u.referralBonus || 0);
      if (count >= dailyCap) {
        await postOtpToGroup({service,country,number,otp:result.otp});
        await bot.telegram.editMessageText(userId,messageId,undefined,
          `🎉 <b>OTP TERDETEKSI</b>\n━━━━━━━━━━━━━━━━━━\n📱 Layanan: ${esc(serviceName(service))}\n🌍 Negara: ${countryInfo(country).flag} ${esc(countryInfo(country).name)}\n☎️ Nomor: <code>${esc(number)}</code>\n\n⛔ Batas penerimaan OTP hari ini sudah tercapai. Coba lagi setelah reset harian.`,
          {parse_mode:'HTML', ...numberKeys(number,service,country)}).catch(()=>{});
        return;
      }
      u.otpDate=todayKey(); u.otpToday=count+1; u.successfulRequests=Number(u.successfulRequests||0)+1; db.saveUser(u);
      await postOtpToGroup({service,country,number,otp:result.otp});
      db.addOrder({userId:String(userId),service,country:countryInfo(country).name,numberMasked:maskNumber(number),status:'otp_received'});
      await bot.telegram.editMessageText(userId,messageId,undefined,
        `🎉 <b>NEW OTP RECEIVED</b>\n━━━━━━━━━━━━━━━━━━\n📱 Layanan: ${esc(serviceName(service))}\n🌍 Negara: ${countryInfo(country).flag} ${esc(countryInfo(country).name)}\n☎️ Nomor: <code>${esc(number)}</code>\n🔑 OTP: <code>${esc(result.otp)}</code>\n\n🔢 Kuota OTP hari ini: <b>${u.otpToday}/${3 + Number(u.referralBonus || 0)}</b>`,
        {parse_mode:'HTML', ...numberKeys(number,service,country)}).catch(()=>{});
      return;
    }
  } finally { activePolls.delete(pollKey); }
}
function numberKeys(number, service, country) {
  // Telegram copy_text copies directly to clipboard without editing the OTP message.
  return Markup.inlineKeyboard([
    [{ text: '📋 SALIN NOMOR', copy_text: { text: String(number) } }],
    [Markup.button.callback('🔄 GANTI NOMOR',`change:${encodeURIComponent(service)}|${encodeURIComponent(String(country?.code ?? country?.id ?? country?.name ?? country))}`)],
    [Markup.button.callback('🌍 GANTI NEGARA','svc:'+encodeURIComponent(service))],
    [Markup.button.callback('🗑 LEPAS NOMOR',`release:${encodeURIComponent(number)}`)],
    [Markup.button.callback('🏠 MENU UTAMA','home')]
  ]);
}
function serviceKeys(list) {
  const rows=list.slice(0,40).map(x=>[Markup.button.callback(`📱 ${serviceLabel(x)}`,`svc:${encodeURIComponent(serviceCode(x))}`)]);
  rows.push([Markup.button.callback('⬅️ KEMBALI','home')]); return kb(rows);
}
function countryKeys(service,list) {
  const rows=list.slice(0,90).map(x=>{const ci=countryInfo(x);const raw=String(x?.name ?? x?.country_name ?? x?.country ?? x?.code ?? x?.countryCode ?? x?.country_code ?? x?.id ?? x); return [Markup.button.callback(`${ci.flag} ${ci.name}${x?.count != null ? ` (${x.count})`:''}`,`cty:${encodeURIComponent(service)}|${encodeURIComponent(raw)}`)];});
  rows.push([Markup.button.callback('⬅️ KEMBALI','get_number')]); return kb(rows);
}
function fileCountryKeys(list) { const rows=list.slice(0,90).map(x=>{const ci=countryInfo(x);const raw=String(x?.name??x?.country_name??x?.country??x?.code??x?.countryCode??x?.country_code??x?.id??x);return [Markup.button.callback(`${ci.flag} ${ci.name}`,`filecty:${encodeURIComponent(raw)}`)];});rows.push([Markup.button.callback('⬅️ KEMBALI','home')]);return kb(rows);}
async function showCountries(ctx, service) {
  try {
    const d=await api.getCountries(service); let list=d.countries || d.data?.countries || d.result?.countries || []; if (!Array.isArray(list) && list && typeof list==='object') list=Object.entries(list).map(([code,value])=>typeof value==='object'?{code,...value}:{code,name:String(value)});
    if (!list.length) return screen(ctx,'Negara belum tersedia untuk layanan ini.',kb([[Markup.button.callback('⬅️ KEMBALI','get_number')]]));
    return screen(ctx,`🌍 <b>PILIH NEGARA</b>\n━━━━━━━━━━━━━━━━━━\n📱 Layanan: <b>${esc(service)}</b>\nPilih negara di bawah.`,countryKeys(service,list));
  } catch (e) { console.error('countries:',e.message); return screen(ctx,'Daftar negara belum bisa dimuat. Coba lagi.',kb([[Markup.button.callback('🔄 COBA LAGI',`svc:${encodeURIComponent(service)}`)],[Markup.button.callback('⬅️ KEMBALI','get_number')]])); }
}
async function acquireNumber(ctx, service, countryRaw) {
  const u=db.getUser(ctx.from.id,ctx.from);
  if (u.blocked) return screen(ctx,'Akun kamu sedang dibatasi.');
  const ci=countryInfo({name:countryRaw,code:countryRaw});
  // Permintaan nomor tidak dibatasi; kuota berlaku hanya untuk OTP yang dikirim privat.
  const progressMessage = await screen(ctx,`⏳ <b>MEMINTA NOMOR...</b>\n━━━━━━━━━━━━━━━━━━\n📱 Layanan: ${esc(serviceName(service))}\n🌍 Negara: ${ci.flag} ${esc(ci.name)}\n\nMohon tunggu sebentar.`);
  try {
    const r=await api.requestNumber(service,countryRaw);
    const data=r.data || r.result || r;
    const rawNumber=data.number ?? data.phone ?? data.msisdn ?? data.telephone;
    if (!rawNumber) throw new Error('Nomor tidak ada di respons layanan');
    const number = String(rawNumber).replace(/^\+/, '').trim();
    u.totalRequests=Number(u.totalRequests||0)+1; db.saveUser(u);
    db.addOrder({userId:String(ctx.from.id),service:serviceName(service),country:ci.name,numberMasked:maskNumber(number),status:'number_issued'});
    const numberText=`<b>${ci.flag} ${esc(ci.name)} ${esc(serviceName(service))}</b>\n━━━━━━━━━━━━━━━━━━\n☎️ Nomor kamu\n<code>+${esc(number)}</code>\n\n⏳ <b>Menunggu OTP masuk...</b>\n📩 OTP akan muncul otomatis di chat ini.\n🔑 Kuota OTP harian: <b>${3 + Number(u.referralBonus || 0)}</b>`;
    const numberMarkup=numberKeys(number,service,{...ci,code:countryRaw,id:countryRaw,name:ci.name});
    let sent;
    try { sent = await bot.telegram.editMessageText(ctx.chat.id,progressMessage.message_id,undefined,numberText,{parse_mode:'HTML',...numberMarkup}); }
    catch { sent = await ctx.reply(numberText,{parse_mode:'HTML',...numberMarkup}); }
    const messageId=sent?.message_id || progressMessage?.message_id;
    activeNumbers.set(`${ctx.from.id}:${number}`,{number,service,country:countryRaw,messageId}); latestNumberByUser.set(String(ctx.from.id),{number,service,country:countryRaw});
    pollOtp({userId:ctx.from.id,messageId,number,service,country:{...ci,code:countryRaw,id:countryRaw,name:ci.name}}).catch(e=>console.error('OTP poll:',e.message));
  } catch (e) {
    console.error('request number:',e.message);
    return ctx.reply('❌ Nomor belum berhasil diminta. Coba ganti negara atau ulangi beberapa saat lagi.',kb([[Markup.button.callback('🔄 COBA LAGI',`cty:${encodeURIComponent(service)}|${encodeURIComponent(countryRaw)}`)],[Markup.button.callback('🌍 GANTI NEGARA',`svc:${encodeURIComponent(service)}`)],[Markup.button.callback('🏠 MENU UTAMA','home')]]));
  }
}

bot.start(async ctx=>{
  const u=db.getUser(ctx.from.id,ctx.from);
  const payload=String(ctx.startPayload||'');
  if (/^\d+$/.test(payload) && payload!==String(ctx.from.id) && !u.referredBy) {
    const referrer=db.getUser(payload,{});
    if (referrer && String(referrer.id)!==String(ctx.from.id)) {
      u.referredBy=String(payload); u.referralBonus=Number(u.referralBonus||0)+1; db.saveUser(u);
      referrer.referralCount=Number(referrer.referralCount||0)+1; referrer.referralCredits=Number(referrer.referralCredits||0)+1; referrer.referralBonus=Number(referrer.referralBonus||0)+1; db.saveUser(referrer);
      await bot.telegram.sendMessage(payload,`🎁 Pengguna baru bergabung melalui referral kamu. Kamu mendapat 1 limit referral.`).catch(()=>{});
    }
  }
  return home(ctx);
});
bot.command('id',ctx=>ctx.reply(`ID Telegram kamu: ${ctx.from.id}`));
let restartInProgress = false;
async function restartPolling(ctx) {
  if (restartInProgress) return ctx.reply('Restart sedang berjalan, tunggu sebentar.').catch(()=>{});
  restartInProgress = true;
  try {
    await screen(ctx, '♻️ <b>RESTART BOT</b>\n━━━━━━━━━━━━━━━━━━\n⏳ 1/3 Menyiapkan restart...');
    await new Promise(r => setTimeout(r, 700));
    await screen(ctx, '♻️ <b>RESTART BOT</b>\n━━━━━━━━━━━━━━━━━━\n🔄 2/3 Memulai ulang koneksi Telegram...');
    try { bot.stop('ADMIN_RESTART'); } catch {}
    await new Promise(r => setTimeout(r, 1000));
    await bot.launch();
    await new Promise(r => setTimeout(r, 700));
    await bot.telegram.sendMessage(config.adminId, '✅ FREEOTP berhasil di-restart dan sudah aktif kembali.').catch(()=>{});
    console.log('Bot berhasil restart polling.');
  } catch (e) {
    console.error('Restart polling gagal:', e);
    await bot.telegram.sendMessage(config.adminId, `❌ Restart gagal: ${e.message}`).catch(()=>{});
  } finally { restartInProgress = false; }
}
bot.command('admin',adminPanel);
bot.command('restart',async ctx=>{if(!admin(ctx))return ctx.reply('Akses ditolak.');return restartPolling(ctx);});
bot.command('stats',ctx=>{if(!admin(ctx))return ctx.reply('Akses ditolak.');const s=db.getStats();return ctx.reply(`📊 Statistik\nPengguna: ${s.users}\nPremium: ${s.premium}\nNomor diminta: ${s.requests}\nOTP diterima: ${s.successful}`);});
bot.command('cancel',ctx=>{sessions.delete(String(ctx.from.id));return ctx.reply('Aksi dibatalkan.');});
bot.command('broadcast',async ctx=>{if(!admin(ctx))return ctx.reply('Akses ditolak.');const m=ctx.message.text.replace(/^\/broadcast(?:@\w+)?\s*/i,'').trim();if(!m)return ctx.reply('Format: /broadcast isi pesan');return broadcast(ctx,m);});

bot.action('home',async ctx=>{await ctx.answerCbQuery();return home(ctx);});
bot.action('admin',async ctx=>{await ctx.answerCbQuery();return adminPanel(ctx);});
bot.action('get_number',async ctx=>{
  await ctx.answerCbQuery(); const u=db.getUser(ctx.from.id,ctx.from),s=db.settings();
  if(u.blocked)return screen(ctx,'Akun kamu sedang dibatasi.');
  if(s.maintenance&&!admin(ctx))return screen(ctx,'Layanan sedang dalam pemeliharaan.',kb([[Markup.button.callback('⬅️ KEMBALI','home')]]));
  try { const d=await api.getServices(); const list=d.services || d.data?.services || d.result?.services || []; if(!list.length)return screen(ctx,'Belum ada layanan tersedia.',kb([[Markup.button.callback('⬅️ KEMBALI','home')]])); return screen(ctx,'📱 <b>PILIH LAYANAN</b>\n━━━━━━━━━━━━━━━━━━\nPilih layanan yang ingin digunakan.',serviceKeys(Array.isArray(list)?list:Object.values(list))); }
  catch(e){console.error('services:',e.message);return screen(ctx,'Layanan belum tersedia. Coba lagi sebentar.',kb([[Markup.button.callback('🔄 COBA LAGI','get_number')],[Markup.button.callback('⬅️ KEMBALI','home')]]));}
});
bot.action(/^svc:(.+)$/,async ctx=>{await ctx.answerCbQuery();return showCountries(ctx,decodeURIComponent(ctx.match[1]));});
bot.action(/^cty:([^|]+)\|(.+)$/,async ctx=>{await ctx.answerCbQuery();return acquireNumber(ctx,decodeURIComponent(ctx.match[1]),decodeURIComponent(ctx.match[2]));});
bot.action(/^change:([^|]+)\|(.+)$/,async ctx=>{await ctx.answerCbQuery('Meminta nomor baru...');const service=decodeURIComponent(ctx.match[1]),country=decodeURIComponent(ctx.match[2]);const old=latestNumberByUser.get(String(ctx.from.id));if(old?.number){try{await api.releaseNumber(old.number);}catch(e){console.warn('release number:',e.message);}}return acquireNumber(ctx,service,country);});
bot.action(/^release:(.+)$/,async ctx=>{
  await ctx.answerCbQuery('Melepas nomor...');
  const number=decodeURIComponent(ctx.match[1]);
  try {
    await api.releaseNumber(number);
    activeNumbers.delete(`${ctx.from.id}:${number}`);
    if (latestNumberByUser.get(String(ctx.from.id))?.number===number) latestNumberByUser.delete(String(ctx.from.id));
    return screen(ctx,`✅ <b>NOMOR BERHASIL DILEPAS</b>\\n━━━━━━━━━━━━━━━━━━\\n☎️ <code>${esc(number)}</code>\\nNomor sudah dikirim ke FREEOTP untuk dilepas.`,kb([[Markup.button.callback('📞 MINTA NOMOR BARU','get_number')],[Markup.button.callback('🏠 MENU UTAMA','home')]]));
  } catch(e) {
    console.error('release number:',e.message);
    return screen(ctx,`❌ <b>GAGAL MELEPAS NOMOR</b>\\n${esc(e.message)}`,kb([[Markup.button.callback('🔄 COBA LAGI',`release:${encodeURIComponent(number)}`)],[Markup.button.callback('🏠 MENU UTAMA','home')]]));
  }
});
bot.action(/^copy:(.+)$/,async ctx=>{await ctx.answerCbQuery('Gunakan tombol salin nomor pada pesan terbaru.');});

bot.action('profile',async ctx=>{await ctx.answerCbQuery();const u=db.getUser(ctx.from.id,ctx.from);const cap=3+Number(u.referralBonus||0);return screen(ctx,`👤 <b>PROFILE PENGGUNA</b>\n━━━━━━━━━━━━━━━━━━\n🆔 ID: <code>${u.id}</code>\n👤 Nama: ${esc(u.firstName)}\n📨 Nomor diminta: <b>${u.totalRequests||0}</b>\n🔑 OTP diterima hari ini: <b>${ensureOtpDaily(u)}/${cap}</b>\n🎁 Referral berhasil: <b>${u.referralCount||0}</b>\n⭐ Status: <b>${premium(u)?'PREMIUM':'GRATIS'}</b>`,kb([[Markup.button.callback('🎁 REFERRAL','referral')],[Markup.button.callback('🆘 CUSTOMER SERVICE','support')],[Markup.button.callback('⬅️ KEMBALI','home')]]));});
bot.action('support',async ctx=>{await ctx.answerCbQuery();const url=`https://t.me/${config.supportUsername}`;return screen(ctx,`💬 <b>SUPPORT</b>\nButuh bantuan? Hubungi tim support melalui tombol di bawah.`,kb([[Markup.button.url('💬 HUBUNGI SUPPORT',url)],[Markup.button.callback('⬅️ KEMBALI','home')]]));});
bot.action('upgrade_premium',async ctx=>{await ctx.answerCbQuery();const s=db.settings();return screen(ctx,`⭐ <b>UPGRADE PREMIUM</b>\n━━━━━━━━━━━━━━━━━━\nHarga: <b>${money(s.premiumPrice)}</b>\nMasa aktif: <b>${s.premiumDays} hari</b>\nBonus limit: <b>${s.premiumLimit}</b>\n\nUntuk aktivasi premium, hubungi Support.`,kb([[Markup.button.url('💬 HUBUNGI SUPPORT',`https://t.me/${config.supportUsername}`)],[Markup.button.callback('⬅️ KEMBALI','home')]]));});
bot.action('referral',async ctx=>{await ctx.answerCbQuery();const u=db.getUser(ctx.from.id,ctx.from);const link=config.botUsername?`https://t.me/${config.botUsername}?start=${ctx.from.id}`:'Isi BOT_USERNAME di .env agar tautan referral tersedia.';return screen(ctx,`🎁 <b>PROGRAM REFERRAL</b>\n━━━━━━━━━━━━━━━━━━\nAjak teman menggunakan tautan ini:\n<code>${esc(link)}</code>\n\n👥 Referral berhasil: <b>${u.referralCount||0}</b>\n🎟 Limit referral kamu: <b>${u.referralCredits||0}</b>\n\nSetiap pengguna baru yang bergabung melalui tautan referral mendapat 1 limit tambahan.`,kb([[Markup.button.callback('👤 PROFILE','profile')],[Markup.button.callback('⬅️ KEMBALI','home')]]));});
bot.action('leaderboard',async ctx=>{await ctx.answerCbQuery();const top=db.allUsers().sort((a,b)=>(b.successfulRequests||0)-(a.successfulRequests||0)).slice(0,10),lines=top.map((u,i)=>`${i+1}. ${esc(u.firstName)} — ${u.successfulRequests||0} OTP`);return screen(ctx,`🏆 <b>LEADERBOARD</b>\n━━━━━━━━━━━━━━━━━━\n${lines.join('\n')||'Belum ada data.'}`,kb([[Markup.button.callback('⬅️ KEMBALI','home')]]));});
bot.action('get_file',async ctx=>{
  await ctx.answerCbQuery();
  try {
    const response=await api.getMyNumbers();
    const list=Array.isArray(response.numbers)?response.numbers:[];
    const countries=[...new Map(list.map(item=>{
      const name=String(item.country||'').trim();
      return [name.toLowerCase(),{name,count:1}];
    }).filter(([key])=>key)).values()];
    if(!countries.length) return screen(ctx,'📂 <b>ARSIP NOMOR AKTIF</b>\\nBelum ada nomor aktif yang tercatat pada akun provider.',kb([[Markup.button.callback('📞 MINTA NOMOR','get_number')],[Markup.button.callback('🏠 MENU UTAMA','home')]]));
    return screen(ctx,'📂 <b>ARSIP NOMOR AKTIF</b>\\nPilih negara untuk mengekspor nomor aktif ke TXT.',fileCountryKeys(countries));
  } catch(e) {
    console.error('get file:',e.message);
    return screen(ctx,'❌ Tidak dapat mengambil daftar nomor aktif dari FREEOTP. Coba lagi.',kb([[Markup.button.callback('🔄 COBA LAGI','get_file')],[Markup.button.callback('🏠 KEMBALI','home')]]));
  }
});
bot.action(/^filecty:(.+)$/,async ctx=>{
  await ctx.answerCbQuery('Menyiapkan file TXT...');
  const raw=decodeURIComponent(ctx.match[1]);
  const ci=countryInfo({name:raw});
  try {
    const response=await api.getMyNumbers();
    const list=Array.isArray(response.numbers)?response.numbers:[];
    const numbers=[...new Set(list
      .filter(item=>String(item.country||'').toLowerCase()===raw.toLowerCase())
      .map(item=>String(item.number||'').trim())
      .filter(Boolean)
      .map(number=>number.startsWith('+')?number:`+${number.replace(/^\\+/,'')}`))];
    if(!numbers.length) return screen(ctx,`📂 <b>${ci.flag} ${esc(ci.name)}</b>\\nTidak ada nomor aktif untuk negara ini.`,kb([[Markup.button.callback('🌍 PILIH NEGARA','get_file')],[Markup.button.callback('🏠 MENU UTAMA','home')]]));
    const buffer=Buffer.from(numbers.join('\\n')+'\\n','utf8');
    await ctx.replyWithDocument({source:buffer,filename:`freeotp-${ci.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}.txt`},{caption:`✦ FREEOTP · EXPORT NOMOR\\n${ci.flag} ${ci.name}\\nTotal: ${numbers.length} nomor`});
    return screen(ctx,'✅ <b>FILE TXT BERHASIL DIBUAT</b>',kb([[Markup.button.callback('🌍 PILIH NEGARA LAIN','get_file')],[Markup.button.callback('🏠 MENU UTAMA','home')]]));
  } catch(e) {
    console.error('file export:',e.message);
    return screen(ctx,'❌ Gagal mengekspor nomor dari FREEOTP.',kb([[Markup.button.callback('🔄 COBA LAGI',`filecty:${encodeURIComponent(raw)}`)],[Markup.button.callback('🏠 MENU UTAMA','home')]]));
  }
});

bot.action('admin_stats',async ctx=>{await ctx.answerCbQuery();if(!admin(ctx))return screen(ctx,'Akses ditolak.');const s=db.getStats();return screen(ctx,`📊 <b>STATISTIK</b>\nPengguna: ${s.users}\nDiblokir: ${s.blocked}\nPremium: ${s.premium}\nNomor diminta: ${s.requests}\nOTP diterima: ${s.successful}\nOrder: ${s.orders}`,kb([[Markup.button.callback('⬅️ ADMIN','admin')]]));});
bot.action('admin_users',async ctx=>{await ctx.answerCbQuery();if(!admin(ctx))return screen(ctx,'Akses ditolak.');const users=db.allUsers().slice(-20).reverse();const rows=users.map(u=>[Markup.button.callback(`${u.blocked?'🚫':'👤'} ${String(u.firstName||'Pengguna').slice(0,18)} · ${u.id}`,`admin_user:${u.id}`)]);rows.push([Markup.button.callback('⬅️ ADMIN','admin')]);return screen(ctx,`👥 <b>TOTAL PENGGUNA: ${db.allUsers().length}</b>\nPilih pengguna untuk mengatur premium atau blokir.`,kb(rows));});
bot.action(/^admin_user:(\d+)$/,async ctx=>{await ctx.answerCbQuery();if(!admin(ctx))return screen(ctx,'Akses ditolak.');const u=db.getUser(ctx.match[1],{});return screen(ctx,`👤 <b>KELOLA PENGGUNA</b>\n━━━━━━━━━━━━━━━━━━\nNama: ${esc(u.firstName)}\nID: <code>${u.id}</code>\nStatus: ${u.blocked?'DIBLOKIR':'AKTIF'}\nPremium: ${premium(u)?'AKTIF':'TIDAK AKTIF'}\n\nPilih tindakan:`,kb([[Markup.button.callback('⭐ TAMBAH PREMIUM',`grantuser:${u.id}`)],[Markup.button.callback(u.blocked?'✅ BUKA BLOKIR':'🚫 BLOKIR PENGGUNA',`toggleblock:${u.id}`)],[Markup.button.callback('⬅️ TOTAL PENGGUNA','admin_users')]]));});
bot.action(/^grantuser:(\d+)$/,async ctx=>{await ctx.answerCbQuery();if(!admin(ctx))return screen(ctx,'Akses ditolak.');sessions.set(String(ctx.from.id),{stage:'grant',targetId:ctx.match[1]});return screen(ctx,`⭐ <b>TAMBAH PREMIUM</b>\nKirim masa aktif dalam hari dan bonus limit.\nContoh: <code>30 5</code> (30 hari, 5 bonus limit).\n/cancel untuk batal.`);});
bot.action(/^toggleblock:(\d+)$/,async ctx=>{await ctx.answerCbQuery();if(!admin(ctx))return screen(ctx,'Akses ditolak.');const u=db.getUser(ctx.match[1],{});u.blocked=!u.blocked;db.saveUser(u);return screen(ctx,`Status pengguna ${u.id}: <b>${u.blocked?'DIBLOKIR':'AKTIF'}</b>.`,kb([[Markup.button.callback('⬅️ KE PENGGUNA','admin_users')],[Markup.button.callback('⚙️ ADMIN','admin')]]));});
for(const [act,stage,prompt] of [['admin_broadcast','broadcast','Kirim isi pesan broadcast berikutnya.']])bot.action(act,async ctx=>{await ctx.answerCbQuery();if(!admin(ctx))return screen(ctx,'Akses ditolak.');sessions.set(String(ctx.from.id),{stage});return screen(ctx,`⚙️ <b>ADMIN</b>\n${prompt}\n/cancel untuk batal.`);});
bot.action('admin_maintenance',async ctx=>{await ctx.answerCbQuery();if(!admin(ctx))return screen(ctx,'Akses ditolak.');const s=db.settings();db.updateSettings({maintenance:!s.maintenance});return adminPanel(ctx);});
bot.action('admin_restart',async ctx=>{await ctx.answerCbQuery();if(!admin(ctx))return screen(ctx,'Akses ditolak.');return restartPolling(ctx);});
async function broadcast(ctx,msg){const users=db.allUsers().filter(u=>!u.blocked);let ok=0,fail=0;for(const u of users){try{await bot.telegram.sendMessage(u.id,msg,{disable_web_page_preview:true});ok++;}catch{fail++;}await sleep(40);}return ctx.reply(`📣 Broadcast selesai.\nTerkirim: ${ok}\nGagal: ${fail}`);}
bot.on('text',async ctx=>{const key=String(ctx.from.id),s=sessions.get(key);if(!s||!admin(ctx))return;const t=ctx.message.text.trim();if(t.startsWith('/'))return;try{if(s.stage==='broadcast'){sessions.delete(key);return broadcast(ctx,t);}if(s.stage==='limit'){const n=Number(t);if(!Number.isInteger(n)||n<0||n>3)return ctx.reply('Masukkan angka 0–3.');db.updateSettings({freeDailyLimit:n});sessions.delete(key);return ctx.reply(`Pengaturan disimpan. Batas OTP harian efektif tetap maksimum 3.`);}if(s.stage==='package'){const [price,limit,days]=t.split(/\s+/).map(Number);if(![price,limit,days].every(Number.isFinite)||price<0||limit<0||days<1)return ctx.reply('Format: 15000 50 30');db.updateSettings({premiumPrice:price,premiumLimit:limit,premiumDays:days});sessions.delete(key);return ctx.reply('Paket berhasil diperbarui.');}if(s.stage==='grant'){const [days,bonus]=t.split(/\s+/).map(Number);if(!Number.isInteger(days)||days<1||!Number.isInteger(bonus)||bonus<0)return ctx.reply('Format: HARI BONUS_LIMIT, contoh: 30 5');const id=s.targetId;if(!id)return ctx.reply('Target pengguna tidak ditemukan.');const u=db.getUser(id,{});u.premiumUntil=new Date(Date.now()+days*86400000).toISOString();u.bonusLimit=bonus;u.referralBonus=Number(u.referralBonus||0)+bonus;db.saveUser(u);sessions.delete(key);await bot.telegram.sendMessage(id,`⭐ Premium aktif selama ${days} hari.`).catch(()=>{});return ctx.reply(`Premium diberikan ke ${id}.`);} }catch(e){console.error(e);return ctx.reply('Input tidak valid. Periksa format dan coba lagi.');}});
bot.catch(e=>console.error('Bot error:',e));
bot.launch().then(async()=>{console.log(`${config.botName} aktif.`);}).catch(e=>{console.error('Gagal menjalankan bot:',e.message);process.exit(1);});
process.once('SIGINT',()=>bot.stop('SIGINT'));process.once('SIGTERM',()=>bot.stop('SIGTERM'));
