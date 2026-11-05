'use strict';

const config = require('./config');

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutMs = Math.max(5000, Number(config.apiTimeoutMs || 20000));
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${config.apiBaseUrl}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {})
      }
    });
    const raw = await response.text();
    let data;
    try { data = raw ? JSON.parse(raw) : {}; }
    catch { throw new Error(`FREEOTP mengirim respons bukan JSON (HTTP ${response.status})`); }

    if (!response.ok || data?.success === false || data?.ok === false) {
      throw new Error(data?.message || data?.error || `FREEOTP HTTP ${response.status}`);
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error(`Request FREEOTP timeout setelah ${timeoutMs}ms`);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

const enc = value => encodeURIComponent(String(value ?? ''));

async function getServices() { return request('/api/services'); }
async function getCountries(service) {
  if (!service) throw new Error('Nama layanan wajib diisi untuk mengambil negara');
  return request(`/api/countries?service=${enc(service)}`);
}
async function requestNumber(service, country) {
  if (!service || !country) throw new Error('Layanan dan negara wajib dipilih');
  return request('/api/request_number', {
    method: 'POST',
    body: JSON.stringify({ service: String(service), country: String(country) })
  });
}
async function getMyNumbers() { return request('/api/my_numbers'); }
async function releaseNumber(number) {
  if (!number) throw new Error('Nomor wajib diisi untuk dilepas');
  return request('/api/release_number', {
    method: 'POST',
    body: JSON.stringify({ number: String(number) })
  });
}
async function latestOtp(number) {
  if (!number) throw new Error('Nomor wajib diisi untuk cek OTP');
  return request(`/api/latest_otp?number=${enc(number)}`);
}
async function getMyOtps({ number, limit = 10 } = {}) {
  const params = new URLSearchParams({ limit: String(Math.min(100, Math.max(1, Number(limit) || 10))) });
  if (number) params.set('number', String(number));
  return request(`/api/my_otps?${params.toString()}`);
}
async function getOtpFeed(count = 10) {
  return request(`/api/otp?count=${enc(Math.min(100, Math.max(1, Number(count) || 10)))}`);
}
async function getStats(period = 'daily') {
  return request(`/api/stats/detailed?period=${enc(period)}`);
}

module.exports = {
  getServices, getCountries, requestNumber, getMyNumbers, releaseNumber,
  latestOtp, getMyOtps, getOtpFeed, getStats
};
