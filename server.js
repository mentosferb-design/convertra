// ===== CC Currency Converter — Backend API =====
// Node.js + Express server backed by Supabase.
//
// Endpoints:
//   GET  /api/rates            -> proxied live exchange rates (cached, stored in Supabase)
//   POST /api/auth/login       -> admin login via Supabase admin_users table
//   GET  /api/admin/overview   -> dashboard stats (requires token)
//   GET  /api/admin/rates      -> full rate table with currency metadata (requires token)
//   POST /api/conversion/log   -> log a conversion to Supabase
//
// Run:  npm install && npm start

require('dotenv').config();
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const supabase = require('./supabase');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Config ----------
const UPSTREAM_URL = process.env.UPSTREAM_URL || 'https://open.er-api.com/v6/latest/USD';
const ADMIN_USER = process.env.ADMIN_USER || 'mentos';
const ADMIN_PASS = process.env.ADMIN_PASS || 'mentos321';
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const CACHE_TTL_MS = 60 * 1000; // 60s

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ---------- In-memory rate cache (backed by Supabase) ----------
let ratesCache = {
  data: null,
  base: null,
  updatedAt: null,
  usingFallback: false
};

// ---------- CURRENCY_META (seeded into Supabase) ----------
const CURRENCY_META = {
  AED: { name: 'UAE Dirham', flag: '🇦🇪' }, AFN: { name: 'Afghan Afghani', flag: '🇦🇫' },
  ALL: { name: 'Albanian Lek', flag: '🇦🇱' }, AMD: { name: 'Armenian Dram', flag: '🇦🇲' },
  ANG: { name: 'Netherlands Antillean Guilder', flag: '🇨🇼' }, AOA: { name: 'Angolan Kwanza', flag: '🇦🇴' },
  ARS: { name: 'Argentine Peso', flag: '🇦🇷' }, AUD: { name: 'Australian Dollar', flag: '🇦🇺' },
  AWG: { name: 'Aruban Florin', flag: '🇦🇼' }, AZN: { name: 'Azerbaijani Manat', flag: '🇦🇿' },
  BAM: { name: 'Bosnia-Herzegovina Mark', flag: '🇧🇦' }, BBD: { name: 'Barbadian Dollar', flag: '🇧🇧' },
  BDT: { name: 'Bangladeshi Taka', flag: '🇧🇩' }, BGN: { name: 'Bulgarian Lev', flag: '🇧🇬' },
  BHD: { name: 'Bahraini Dinar', flag: '🇧🇭' }, BIF: { name: 'Burundian Franc', flag: '🇧🇮' },
  BMD: { name: 'Bermudian Dollar', flag: '🇧🇲' }, BND: { name: 'Brunei Dollar', flag: '🇧🇳' },
  BOB: { name: 'Bolivian Boliviano', flag: '🇧🇴' }, BRL: { name: 'Brazilian Real', flag: '🇧🇷' },
  BSD: { name: 'Bahamian Dollar', flag: '🇧🇸' }, BTN: { name: 'Bhutanese Ngultrum', flag: '🇧🇹' },
  BWP: { name: 'Botswana Pula', flag: '🇧🇼' }, BYN: { name: 'Belarusian Ruble', flag: '🇧🇾' },
  BZD: { name: 'Belize Dollar', flag: '🇧🇿' }, CAD: { name: 'Canadian Dollar', flag: '🇨🇦' },
  CDF: { name: 'Congolese Franc', flag: '🇨🇩' }, CHF: { name: 'Swiss Franc', flag: '🇨🇭' },
  CLP: { name: 'Chilean Peso', flag: '🇨🇱' }, CNY: { name: 'Chinese Yuan', flag: '🇨🇳' },
  COP: { name: 'Colombian Peso', flag: '🇨🇴' }, CRC: { name: 'Costa Rican Colón', flag: '🇨🇷' },
  CVE: { name: 'Cape Verdean Escudo', flag: '🇨🇻' }, CZK: { name: 'Czech Koruna', flag: '🇨🇿' },
  DJF: { name: 'Djiboutian Franc', flag: '🇩🇯' }, DKK: { name: 'Danish Krone', flag: '🇩🇰' },
  DOP: { name: 'Dominican Peso', flag: '🇩🇴' }, DZD: { name: 'Algerian Dinar', flag: '🇩🇿' },
  EGP: { name: 'Egyptian Pound', flag: '🇪🇬' }, ERN: { name: 'Eritrean Nakfa', flag: '🇪🇷' },
  ETB: { name: 'Ethiopian Birr', flag: '🇪🇹' }, EUR: { name: 'Euro', flag: '🇪🇺' },
  FJD: { name: 'Fijian Dollar', flag: '🇫🇯' }, GBP: { name: 'British Pound', flag: '🇬🇧' },
  GEL: { name: 'Georgian Lari', flag: '🇬🇪' }, GHS: { name: 'Ghanaian Cedi', flag: '🇬🇭' },
  GMD: { name: 'Gambian Dalasi', flag: '🇬🇲' }, GNF: { name: 'Guinean Franc', flag: '🇬🇳' },
  GTQ: { name: 'Guatemalan Quetzal', flag: '🇬🇹' }, GYD: { name: 'Guyanese Dollar', flag: '🇬🇾' },
  HKD: { name: 'Hong Kong Dollar', flag: '🇭🇰' }, HNL: { name: 'Honduran Lempira', flag: '🇭🇳' },
  HRK: { name: 'Croatian Kuna', flag: '🇭🇷' }, HTG: { name: 'Haitian Gourde', flag: '🇭🇹' },
  HUF: { name: 'Hungarian Forint', flag: '🇭🇺' }, IDR: { name: 'Indonesian Rupiah', flag: '🇮🇩' },
  ILS: { name: 'Israeli New Shekel', flag: '🇮🇱' }, INR: { name: 'Indian Rupee', flag: '🇮🇳' },
  IQD: { name: 'Iraqi Dinar', flag: '🇮🇶' }, IRR: { name: 'Iranian Rial', flag: '🇮🇷' },
  ISK: { name: 'Icelandic Króna', flag: '🇮🇸' }, JMD: { name: 'Jamaican Dollar', flag: '🇯🇲' },
  JOD: { name: 'Jordanian Dinar', flag: '🇯🇴' }, JPY: { name: 'Japanese Yen', flag: '🇯🇵' },
  KES: { name: 'Kenyan Shilling', flag: '🇰🇪' }, KGS: { name: 'Kyrgyzstani Som', flag: '🇰🇬' },
  KHR: { name: 'Cambodian Riel', flag: '🇰🇭' }, KMF: { name: 'Comorian Franc', flag: '🇰🇲' },
  KRW: { name: 'South Korean Won', flag: '🇰🇷' }, KWD: { name: 'Kuwaiti Dinar', flag: '🇰🇼' },
  KYD: { name: 'Cayman Islands Dollar', flag: '🇰🇾' }, KZT: { name: 'Kazakhstani Tenge', flag: '🇰🇿' },
  LAK: { name: 'Lao Kip', flag: '🇱🇦' }, LBP: { name: 'Lebanese Pound', flag: '🇱🇧' },
  LKR: { name: 'Sri Lankan Rupee', flag: '🇱🇰' }, LRD: { name: 'Liberian Dollar', flag: '🇱🇷' },
  LSL: { name: 'Lesotho Loti', flag: '🇱🇸' }, LYD: { name: 'Libyan Dinar', flag: '🇱🇾' },
  MAD: { name: 'Moroccan Dirham', flag: '🇲🇦' }, MDL: { name: 'Moldovan Leu', flag: '🇲🇩' },
  MGA: { name: 'Malagasy Ariary', flag: '🇲🇬' }, MKD: { name: 'Macedonian Denar', flag: '🇲🇰' },
  MMK: { name: 'Myanmar Kyat', flag: '🇲🇲' }, MNT: { name: 'Mongolian Tugrik', flag: '🇲🇳' },
  MOP: { name: 'Macanese Pataca', flag: '🇲🇴' }, MRU: { name: 'Mauritanian Ouguiya', flag: '🇲🇷' },
  MUR: { name: 'Mauritian Rupee', flag: '🇲🇺' }, MVR: { name: 'Maldivian Rufiyaa', flag: '🇲🇻' },
  MWK: { name: 'Malawian Kwacha', flag: '🇲🇼' }, MXN: { name: 'Mexican Peso', flag: '🇲🇽' },
  MYR: { name: 'Malaysian Ringgit', flag: '🇲🇾' }, MZN: { name: 'Mozambican Metical', flag: '🇲🇿' },
  NAD: { name: 'Namibian Dollar', flag: '🇳🇦' }, NGN: { name: 'Nigerian Naira', flag: '🇳🇬' },
  NIO: { name: 'Nicaraguan Córdoba', flag: '🇳🇮' }, NOK: { name: 'Norwegian Krone', flag: '🇳🇴' },
  NPR: { name: 'Nepalese Rupee', flag: '🇳🇵' }, NZD: { name: 'New Zealand Dollar', flag: '🇳🇿' },
  OMR: { name: 'Omani Rial', flag: '🇴🇲' }, PAB: { name: 'Panamanian Balboa', flag: '🇵🇦' },
  PEN: { name: 'Peruvian Sol', flag: '🇵🇪' }, PGK: { name: 'Papua New Guinean Kina', flag: '🇵🇬' },
  PHP: { name: 'Philippine Peso', flag: '🇵🇭' }, PKR: { name: 'Pakistani Rupee', flag: '🇵🇰' },
  PLN: { name: 'Polish Zloty', flag: '🇵🇱' }, PYG: { name: 'Paraguayan Guarani', flag: '🇵🇾' },
  QAR: { name: 'Qatari Riyal', flag: '🇶🇦' }, RON: { name: 'Romanian Leu', flag: '🇷🇴' },
  RSD: { name: 'Serbian Dinar', flag: '🇷🇸' }, RUB: { name: 'Russian Ruble', flag: '🇷🇺' },
  RWF: { name: 'Rwandan Franc', flag: '🇷🇼' }, SAR: { name: 'Saudi Riyal', flag: '🇸🇦' },
  SBD: { name: 'Solomon Islands Dollar', flag: '🇸🇧' }, SCR: { name: 'Seychellois Rupee', flag: '🇸🇨' },
  SDG: { name: 'Sudanese Pound', flag: '🇸🇩' }, SEK: { name: 'Swedish Krona', flag: '🇸🇪' },
  SGD: { name: 'Singapore Dollar', flag: '🇸🇬' }, SLE: { name: 'Sierra Leonean Leone', flag: '🇸🇱' },
  SOS: { name: 'Somali Shilling', flag: '🇸🇴' }, SRD: { name: 'Surinamese Dollar', flag: '🇸🇷' },
  SSP: { name: 'South Sudanese Pound', flag: '🇸🇸' }, SYP: { name: 'Syrian Pound', flag: '🇸🇾' },
  SZL: { name: 'Swazi Lilangeni', flag: '🇸🇿' }, THB: { name: 'Thai Baht', flag: '🇹🇭' },
  TJS: { name: 'Tajikistani Somoni', flag: '🇹🇯' }, TMT: { name: 'Turkmenistani Manat', flag: '🇹🇲' },
  TND: { name: 'Tunisian Dinar', flag: '🇹🇳' }, TOP: { name: 'Tongan Paʻanga', flag: '🇹🇴' },
  TRY: { name: 'Turkish Lira', flag: '🇹🇷' }, TTD: { name: 'Trinidad & Tobago Dollar', flag: '🇹🇹' },
  TWD: { name: 'New Taiwan Dollar', flag: '🇹🇼' }, TZS: { name: 'Tanzanian Shilling', flag: '🇹🇿' },
  UAH: { name: 'Ukrainian Hryvnia', flag: '🇺🇦' }, UGX: { name: 'Ugandan Shilling', flag: '🇺🇬' },
  USD: { name: 'US Dollar', flag: '🇺🇸' }, UYU: { name: 'Uruguayan Peso', flag: '🇺🇾' },
  UZS: { name: 'Uzbekistani Som', flag: '🇺🇿' }, VES: { name: 'Venezuelan Bolívar', flag: '🇻🇪' },
  VND: { name: 'Vietnamese Dong', flag: '🇻🇳' }, VUV: { name: 'Vanuatu Vatu', flag: '🇻🇺' },
  WST: { name: 'Samoan Tala', flag: '🇼🇸' }, XAF: { name: 'Central African CFA Franc', flag: '🇨🇫' },
  XCD: { name: 'East Caribbean Dollar', flag: '🇦🇬' }, XOF: { name: 'West African CFA Franc', flag: '🇸🇳' },
  XPF: { name: 'CFP Franc', flag: '🇵🇫' }, YER: { name: 'Yemeni Rial', flag: '🇾🇪' },
  ZAR: { name: 'South African Rand', flag: '🇿🇦' }, ZMW: { name: 'Zambian Kwacha', flag: '🇿🇲' },
  ZWL: { name: 'Zimbabwean Dollar', flag: '🇿🇼' }
};

// ---------- Rate fetching (with fallback + cache) ----------
const FALLBACK_USD = {
  AED: 3.67, AFN: 71.0, ALL: 100.5, AMD: 410.0, AOA: 850.0, ARS: 900.0,
  AUD: 1.52, AZN: 1.7, BDT: 109.5, BGN: 1.8, BHD: 0.38, BIF: 2880.0,
  BRL: 5.4, BWP: 13.6, CAD: 1.36, CHF: 0.88, CLP: 940.0, CNY: 7.24,
  COP: 3900.0, CZK: 23.0, DKK: 6.86, DZD: 134.0, EGP: 48.5, ETB: 118.0,
  EUR: 0.92, GBP: 0.79, GHS: 15.8, GMD: 71.0, HKD: 7.82, HUF: 362.0,
  IDR: 16000.0, ILS: 3.7, INR: 83.4, ISK: 138.0, JPY: 149.5, KES: 129.0,
  KHR: 4070.0, KRW: 1330.0, KWD: 0.31, KZT: 445.0, LBP: 15000.0,
  LKR: 298.0, MAD: 10.0, MGA: 4520.0, MXN: 17.1, MYR: 4.7, NGN: 1550.0,
  NIO: 36.5, NOK: 10.6, NPR: 133.0, NZD: 1.65, OMR: 0.385, PEN: 3.75,
  PHP: 56.0, PKR: 278.0, PLN: 3.95, PYG: 7300.0, QAR: 3.64, RON: 4.57,
  RSD: 108.0, RUB: 92.0, RWF: 1315.0, SAR: 3.75, SEK: 10.5, SGD: 1.35,
  SOS: 570.0, THB: 35.8, TND: 3.1, TRY: 33.9, TTD: 6.8, TWD: 32.0,
  TZS: 2600.0, UAH: 41.0, UGX: 3720.0, USD: 1, UYU: 41.0, UZS: 12600.0,
  VES: 36.0, VND: 25400.0, XAF: 602.0, XOF: 602.0, ZAR: 18.7, ZMW: 27.0,
  ZWL: 323.0
};

async function fetchRates(force) {
  const now = Date.now();
  if (!force && ratesCache.data && (now - ratesCache.updatedAt) < CACHE_TTL_MS) {
    return ratesCache;
  }

  // Try Supabase first — read cached rates from exchange_rates table
  if (supabase && !force) {
    try {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('code, rate')
        .not('rate', 'is', null);

      if (!error && data && data.length > 0) {
        const rates = {};
        data.forEach(r => { rates[r.code] = Number(r.rate); });
        if (rates.USD) {
          ratesCache.data = rates;
          ratesCache.base = 'USD';
          ratesCache.updatedAt = now;
          ratesCache.usingFallback = false;
          return ratesCache;
        }
      }
    } catch (e) {
      console.warn('Supabase read failed, falling back to upstream.', e.message);
    }
  }

  // Fetch from upstream API
  let upstreamSuccess = false;
  try {
    const res = await fetch(UPSTREAM_URL);
    if (!res.ok) throw new Error('Upstream request failed: ' + res.status);
    const data = await res.json();
    if (data.result !== 'success' || !data.rates) throw new Error('Unexpected upstream shape');
    ratesCache.data = data.rates;
    ratesCache.base = 'USD';
    ratesCache.updatedAt = Date.now();
    ratesCache.usingFallback = false;
    upstreamSuccess = true;

    // Persist rates to Supabase
    if (supabase) {
      persistRatesToSupabase(data.rates).catch(e =>
        console.warn('Failed to persist rates to Supabase:', e.message)
      );
    }
  } catch (err) {
    console.warn('Upstream unavailable, using fallback estimates.', err.message);
    ratesCache.data = FALLBACK_USD;
    ratesCache.base = 'USD';
    ratesCache.updatedAt = Date.now();
    ratesCache.usingFallback = true;
  }

  return ratesCache;
}

async function persistRatesToSupabase(rates) {
  if (!supabase) return;

  const rows = Object.entries(rates).map(([code, rate]) => ({
    code,
    rate,
    updated_at: new Date().toISOString()
  }));

  // Upsert in batches of 50
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50);
    const { error } = await supabase
      .from('exchange_rates')
      .upsert(batch, { onConflict: 'code' });
    if (error) console.warn('Supabase upsert batch error:', error.message);
  }

  // Log a snapshot
  await supabase.from('rate_snapshots').insert({
    base_currency: 'USD',
    rates,
    source: upstreamSuccess ? UPSTREAM_URL : 'fallback',
    created_at: new Date().toISOString()
  });
}

// ---------- Auth helpers ----------
function signToken(user) {
  const payload = { sub: user, iat: Date.now() };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(body)
    .digest('base64url');
  return body + '.' + sig;
}

function verifyToken(token) {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(body)
    .digest('base64url');
  if (sig !== expected) return null;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

// ===== Routes =====

// Public: live rates
app.get('/api/rates', async (req, res) => {
  const force = req.query.force === '1';
  const cache = await fetchRates(force);
  res.json({
    result: 'success',
    base: cache.base,
    usingFallback: cache.usingFallback,
    updatedAt: new Date(cache.updatedAt).toISOString(),
    rates: cache.data
  });
});

// Public: health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'cc-currency-converter', time: new Date().toISOString() });
});

// Public: login (returns token) — checks Supabase admin_users table
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, username, password_hash')
        .eq('username', username)
        .single();

      if (!error && data && data.password_hash === password) {
        const token = signToken(data.username);
        return res.json({ ok: true, token, user: data.username });
      }
    } catch (e) {
      console.warn('Supabase auth query failed, using fallback.', e.message);
    }
  }

  // Fallback to env credentials
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = signToken(username);
    return res.json({ ok: true, token, user: username });
  }

  res.status(401).json({ ok: false, message: 'Invalid username or password.' });
});

// Auth middleware for admin routes
function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ ok: false, message: 'Unauthorized.' });
  req.user = payload.sub;
  next();
}

// Admin: overview stats
app.get('/api/admin/overview', requireAuth, async (req, res) => {
  const cache = await fetchRates();
  const count = Object.keys(cache.data).length;

  let dbStatus = 'disconnected';
  let totalSnapshots = 0;
  if (supabase) {
    try {
      const { count: snapCount } = await supabase
        .from('rate_snapshots')
        .select('*', { count: 'exact', head: true });
      totalSnapshots = snapCount || 0;
      dbStatus = 'connected';
    } catch (e) {
      dbStatus = 'error: ' + e.message;
    }
  }

  res.json({
    ok: true,
    currencies: Object.keys(CURRENCY_META).length,
    ratesLoaded: count,
    source: cache.usingFallback ? 'Offline estimates' : UPSTREAM_URL,
    lastUpdated: new Date(cache.updatedAt).toISOString(),
    user: req.user,
    supabase: dbStatus,
    totalSnapshots
  });
});

// Admin: full rate table with metadata
app.get('/api/admin/rates', requireAuth, async (req, res) => {
  const cache = await fetchRates();
  const query = (req.query.search || '').toLowerCase();
  const rows = Object.keys(CURRENCY_META)
    .filter(code => !query || code.toLowerCase().includes(query) || CURRENCY_META[code].name.toLowerCase().includes(query))
    .map(code => ({
      code,
      ...CURRENCY_META[code],
      rate: cache.data[code] !== undefined ? cache.data[code] : null,
      live: cache.data[code] !== undefined
    }));
  res.json({ ok: true, usingFallback: cache.usingFallback, count: rows.length, rates: rows });
});

// Log a conversion to Supabase
app.post('/api/conversion/log', async (req, res) => {
  const { from, to, amount, result, rate } = req.body || {};
  if (!from || !to || amount == null || result == null || rate == null) {
    return res.status(400).json({ ok: false, message: 'Missing fields.' });
  }

  if (supabase) {
    try {
      await supabase.from('conversion_logs').insert({
        from_currency: from,
        to_currency: to,
        amount: Number(amount),
        result: Number(result),
        rate_used: Number(rate)
      });
      return res.json({ ok: true });
    } catch (e) {
      console.warn('Failed to log conversion:', e.message);
    }
  }
  res.json({ ok: true, note: 'Database not available, conversion not logged.' });
});

// ===== Serve static frontend =====
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log('CC Currency Converter backend running on http://localhost:' + PORT);
  console.log('Supabase:', supabase ? 'CONNECTED' : 'DISABLED (no credentials)');
  console.log('Rates endpoint:     GET  /api/rates');
  console.log('Admin login:        POST /api/auth/login');
});
