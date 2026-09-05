/* ================================================================
   CC Currency Converter
    — Frontend Logic
   ================================================================ */

// ---------- Currency data ----------
const CURRENCIES = [
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'AFN', name: 'Afghan Afghani', flag: '🇦🇫' },
  { code: 'ALL', name: 'Albanian Lek', flag: '🇦🇱' },
  { code: 'AMD', name: 'Armenian Dram', flag: '🇦🇲' },
  { code: 'ANG', name: 'Netherlands Antillean Guilder', flag: '🇨🇼' },
  { code: 'AOA', name: 'Angolan Kwanza', flag: '🇦🇴' },
  { code: 'ARS', name: 'Argentine Peso', flag: '🇦🇷' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'AWG', name: 'Aruban Florin', flag: '🇦🇼' },
  { code: 'AZN', name: 'Azerbaijani Manat', flag: '🇦🇿' },
  { code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark', flag: '🇧🇦' },
  { code: 'BBD', name: 'Barbadian Dollar', flag: '🇧🇧' },
  { code: 'BDT', name: 'Bangladeshi Taka', flag: '🇧🇩' },
  { code: 'BGN', name: 'Bulgarian Lev', flag: '🇧🇬' },
  { code: 'BHD', name: 'Bahraini Dinar', flag: '🇧🇭' },
  { code: 'BIF', name: 'Burundian Franc', flag: '🇧🇮' },
  { code: 'BMD', name: 'Bermudian Dollar', flag: '🇧🇲' },
  { code: 'BND', name: 'Brunei Dollar', flag: '🇧🇳' },
  { code: 'BOB', name: 'Bolivian Boliviano', flag: '🇧🇴' },
  { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
  { code: 'BSD', name: 'Bahamian Dollar', flag: '🇧🇸' },
  { code: 'BTN', name: 'Bhutanese Ngultrum', flag: '🇧🇹' },
  { code: 'BWP', name: 'Botswana Pula', flag: '🇧🇼' },
  { code: 'BYN', name: 'Belarusian Ruble', flag: '🇧🇾' },
  { code: 'BZD', name: 'Belize Dollar', flag: '🇧🇿' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'CDF', name: 'Congolese Franc', flag: '🇨🇩' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CLP', name: 'Chilean Peso', flag: '🇨🇱' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'COP', name: 'Colombian Peso', flag: '🇨🇴' },
  { code: 'CRC', name: 'Costa Rican Colón', flag: '🇨🇷' },
  { code: 'CUC', name: 'Cuban Convertible Peso', flag: '🇨🇺' },
  { code: 'CUP', name: 'Cuban Peso', flag: '🇨🇺' },
  { code: 'CVE', name: 'Cape Verdean Escudo', flag: '🇨🇻' },
  { code: 'CZK', name: 'Czech Koruna', flag: '🇨🇿' },
  { code: 'DJF', name: 'Djiboutian Franc', flag: '🇩🇯' },
  { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰' },
  { code: 'DOP', name: 'Dominican Peso', flag: '🇩🇴' },
  { code: 'DZD', name: 'Algerian Dinar', flag: '🇩🇿' },
  { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬' },
  { code: 'ERN', name: 'Eritrean Nakfa', flag: '🇪🇷' },
  { code: 'ETB', name: 'Ethiopian Birr', flag: '🇪🇹' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'FJD', name: 'Fijian Dollar', flag: '🇫🇯' },
  { code: 'FKP', name: 'Falkland Islands Pound', flag: '🇫🇰' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'GEL', name: 'Georgian Lari', flag: '🇬🇪' },
  { code: 'GHS', name: 'Ghanaian Cedi', flag: '🇬🇭' },
  { code: 'GIP', name: 'Gibraltar Pound', flag: '🇬🇮' },
  { code: 'GMD', name: 'Gambian Dalasi', flag: '🇬🇲' },
  { code: 'GNF', name: 'Guinean Franc', flag: '🇬🇳' },
  { code: 'GTQ', name: 'Guatemalan Quetzal', flag: '🇬🇹' },
  { code: 'GYD', name: 'Guyanese Dollar', flag: '🇬🇾' },
  { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
  { code: 'HNL', name: 'Honduran Lempira', flag: '🇭🇳' },
  { code: 'HRK', name: 'Croatian Kuna', flag: '🇭🇷' },
  { code: 'HTG', name: 'Haitian Gourde', flag: '🇭🇹' },
  { code: 'HUF', name: 'Hungarian Forint', flag: '🇭🇺' },
  { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
  { code: 'ILS', name: 'Israeli New Shekel', flag: '🇮🇱' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'IQD', name: 'Iraqi Dinar', flag: '🇮🇶' },
  { code: 'IRR', name: 'Iranian Rial', flag: '🇮🇷' },
  { code: 'ISK', name: 'Icelandic Króna', flag: '🇮🇸' },
  { code: 'JMD', name: 'Jamaican Dollar', flag: '🇯🇲' },
  { code: 'JOD', name: 'Jordanian Dinar', flag: '🇯🇴' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪' },
  { code: 'KGS', name: 'Kyrgyzstani Som', flag: '🇰🇬' },
  { code: 'KHR', name: 'Cambodian Riel', flag: '🇰🇭' },
  { code: 'KMF', name: 'Comorian Franc', flag: '🇰🇲' },
  { code: 'KPW', name: 'North Korean Won', flag: '🇰🇵' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'KWD', name: 'Kuwaiti Dinar', flag: '🇰🇼' },
  { code: 'KYD', name: 'Cayman Islands Dollar', flag: '🇰🇾' },
  { code: 'KZT', name: 'Kazakhstani Tenge', flag: '🇰🇿' },
  { code: 'LAK', name: 'Lao Kip', flag: '🇱🇦' },
  { code: 'LBP', name: 'Lebanese Pound', flag: '🇱🇧' },
  { code: 'LKR', name: 'Sri Lankan Rupee', flag: '🇱🇰' },
  { code: 'LRD', name: 'Liberian Dollar', flag: '🇱🇷' },
  { code: 'LSL', name: 'Lesotho Loti', flag: '🇱🇸' },
  { code: 'LYD', name: 'Libyan Dinar', flag: '🇱🇾' },
  { code: 'MAD', name: 'Moroccan Dirham', flag: '🇲🇦' },
  { code: 'MDL', name: 'Moldovan Leu', flag: '🇲🇩' },
  { code: 'MGA', name: 'Malagasy Ariary', flag: '🇲🇬' },
  { code: 'MKD', name: 'Macedonian Denar', flag: '🇲🇰' },
  { code: 'MMK', name: 'Myanmar Kyat', flag: '🇲🇲' },
  { code: 'MNT', name: 'Mongolian Tugrik', flag: '🇲🇳' },
  { code: 'MOP', name: 'Macanese Pataca', flag: '🇲🇴' },
  { code: 'MRU', name: 'Mauritanian Ouguiya', flag: '🇲🇷' },
  { code: 'MUR', name: 'Mauritian Rupee', flag: '🇲🇺' },
  { code: 'MVR', name: 'Maldivian Rufiyaa', flag: '🇲🇻' },
  { code: 'MWK', name: 'Malawian Kwacha', flag: '🇲🇼' },
  { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'MZN', name: 'Mozambican Metical', flag: '🇲🇿' },
  { code: 'NAD', name: 'Namibian Dollar', flag: '🇳🇦' },
  { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' },
  { code: 'NIO', name: 'Nicaraguan Córdoba', flag: '🇳🇮' },
  { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴' },
  { code: 'NPR', name: 'Nepalese Rupee', flag: '🇳🇵' },
  { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
  { code: 'OMR', name: 'Omani Rial', flag: '🇴🇲' },
  { code: 'PAB', name: 'Panamanian Balboa', flag: '🇵🇦' },
  { code: 'PEN', name: 'Peruvian Sol', flag: '🇵🇪' },
  { code: 'PGK', name: 'Papua New Guinean Kina', flag: '🇵🇬' },
  { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭' },
  { code: 'PKR', name: 'Pakistani Rupee', flag: '🇵🇰' },
  { code: 'PLN', name: 'Polish Zloty', flag: '🇵🇱' },
  { code: 'PYG', name: 'Paraguayan Guarani', flag: '🇵🇾' },
  { code: 'QAR', name: 'Qatari Riyal', flag: '🇶🇦' },
  { code: 'RON', name: 'Romanian Leu', flag: '🇷🇴' },
  { code: 'RSD', name: 'Serbian Dinar', flag: '🇷🇸' },
  { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
  { code: 'RWF', name: 'Rwandan Franc', flag: '🇷🇼' },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'SBD', name: 'Solomon Islands Dollar', flag: '🇸🇧' },
  { code: 'SCR', name: 'Seychellois Rupee', flag: '🇸🇨' },
  { code: 'SDG', name: 'Sudanese Pound', flag: '🇸🇩' },
  { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'SHP', name: 'Saint Helena Pound', flag: '🇸🇭' },
  { code: 'SLE', name: 'Sierra Leonean Leone', flag: '🇸🇱' },
  { code: 'SOS', name: 'Somali Shilling', flag: '🇸🇴' },
  { code: 'SRD', name: 'Surinamese Dollar', flag: '🇸🇷' },
  { code: 'SSP', name: 'South Sudanese Pound', flag: '🇸🇸' },
  { code: 'STN', name: 'São Tomé & Príncipe Dobra', flag: '🇸🇹' },
  { code: 'SVC', name: 'Salvadoran Colón', flag: '🇸🇻' },
  { code: 'SYP', name: 'Syrian Pound', flag: '🇸🇾' },
  { code: 'SZL', name: 'Swazi Lilangeni', flag: '🇸🇿' },
  { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
  { code: 'TJS', name: 'Tajikistani Somoni', flag: '🇹🇯' },
  { code: 'TMT', name: 'Turkmenistani Manat', flag: '🇹🇲' },
  { code: 'TND', name: 'Tunisian Dinar', flag: '🇹🇳' },
  { code: 'TOP', name: 'Tongan Paʻanga', flag: '🇹🇴' },
  { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷' },
  { code: 'TTD', name: 'Trinidad & Tobago Dollar', flag: '🇹🇹' },
  { code: 'TWD', name: 'New Taiwan Dollar', flag: '🇹🇼' },
  { code: 'TZS', name: 'Tanzanian Shilling', flag: '🇹🇿' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', flag: '🇺🇦' },
  { code: 'UGX', name: 'Ugandan Shilling', flag: '🇺🇬' },
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'UYU', name: 'Uruguayan Peso', flag: '🇺🇾' },
  { code: 'UZS', name: 'Uzbekistani Som', flag: '🇺🇿' },
  { code: 'VES', name: 'Venezuelan Bolívar', flag: '🇻🇪' },
  { code: 'VND', name: 'Vietnamese Dong', flag: '🇻🇳' },
  { code: 'VUV', name: 'Vanuatu Vatu', flag: '🇻🇺' },
  { code: 'WST', name: 'Samoan Tala', flag: '🇼🇸' },
  { code: 'XAF', name: 'Central African CFA Franc', flag: '🇨🇫' },
  { code: 'XCD', name: 'East Caribbean Dollar', flag: '🇦🇬' },
  { code: 'XOF', name: 'West African CFA Franc', flag: '🇸🇳' },
  { code: 'XPF', name: 'CFP Franc', flag: '🇵🇫' },
  { code: 'YER', name: 'Yemeni Rial', flag: '🇾🇪' },
  { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
  { code: 'ZMW', name: 'Zambian Kwacha', flag: '🇿🇲' },
  { code: 'ZWL', name: 'Zimbabwean Dollar', flag: '🇿🇼' }
];

const FALLBACK_RATES = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, AUD: 1.52, CAD: 1.36,
  CHF: 0.88, CNY: 7.24, INR: 83.4, AED: 3.67, SAR: 3.75, QAR: 3.64,
  KWD: 0.31, KES: 129, ETB: 118, SOS: 570, NGN: 1550, ZAR: 18.7,
  EGP: 48.5, TRY: 33.9, SGD: 1.35, HKD: 7.82, NZD: 1.65, SEK: 10.5,
  NOK: 10.6, DKK: 6.86, KRW: 1330, MXN: 17.1, BRL: 5.4, PKR: 278,
  THB: 35.8, MYR: 4.7
};

const QUICK_PAIRS = [
  ['USD', 'EUR'], ['USD', 'GBP'], ['GBP', 'USD'],
  ['USD', 'AED'], ['USD', 'KES'], ['EUR', 'GBP']
];

const POPULAR_PAIRS = [
  ['USD', 'EUR'], ['USD', 'GBP'], ['USD', 'JPY'], ['USD', 'CAD'],
  ['USD', 'AUD'], ['USD', 'CHF'], ['EUR', 'GBP'], ['EUR', 'JPY'],
  ['GBP', 'JPY'], ['USD', 'INR'], ['USD', 'CNY'], ['USD', 'AED']
];

const apiBase = (window.API_BASE || '').replace(/\/$/, '') || '';
const API_URL = apiBase + '/api/rates';

// ---------- State ----------
let rates = {};
let usingFallback = false;
let lastUpdated = null;
let refreshGiven = false;

// ---------- DOM ----------
const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('fromCurrency');
const toSelect = document.getElementById('toCurrency');
const fromLabel = document.getElementById('fromLabel');
const toLabel = document.getElementById('toLabel');
const resultDisplay = document.getElementById('resultDisplay');
const swapBtn = document.getElementById('swapBtn');
const rateText = document.getElementById('rateText');
const rateDot = document.getElementById('rateDot');
const refreshBtn = document.getElementById('refreshBtn');
const quickPairsEl = document.getElementById('quickPairs');
const ratesTableEl = document.getElementById('ratesTable');

// ================================================================
// CURRENCY CONVERTER
// ================================================================

function getCurrency(code) {
  return CURRENCIES.find(c => c.code === code) || { code, name: code, flag: '' };
}

function renderTriggerLabel(el, code) {
  const c = getCurrency(code);
  el.innerHTML = `<span class="cflag">${c.flag}</span><span class="ccode">${c.code}</span>`;
}

function syncLabel(trigger, code) {
  renderTriggerLabel(trigger, code);
}

function buildDropdown(triggerId, menuId, select, labelEl, onChange) {
  const trigger = document.getElementById(triggerId);
  const menu = document.getElementById(menuId);
  const searchInput = menu.querySelector('.currency-search-input');
  const listEl = menu.querySelector('.currency-list');
  let query = '';
  let activeIndex = -1;

  function render() {
    const q = query.trim().toLowerCase();
    const items = CURRENCIES.filter(c =>
      !q ||
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q)
    );
    listEl.innerHTML = '';
    if (items.length === 0) {
      const li = document.createElement('li');
      li.className = 'empty';
      li.textContent = 'No matches';
      listEl.appendChild(li);
      activeIndex = -1;
      return;
    }
    items.forEach((c, i) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', c.code === select.value ? 'true' : 'false');
      li.dataset.code = c.code;
      li.innerHTML = `<span class="cflag">${c.flag}</span><span class="ccode">${c.code}</span><span class="cname">${c.name}</span>`;
      if (c.code === select.value) li.classList.add('selected');
      li.addEventListener('mousedown', (e) => { e.preventDefault(); pick(c.code); });
      listEl.appendChild(li);
    });
    activeIndex = -1;
  }

  function pick(code) {
    select.value = code;
    syncLabel(labelEl, code);
    onChange();
    close();
  }

  function open() {
    render();
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    searchInput.value = '';
    query = '';
    setTimeout(() => searchInput.focus(), 0);
  }

  function close() {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    document.activeElement && document.activeElement.blur();
  }

  function isOpen() { return !menu.hidden; }

  function move(dir) {
    const items = listEl.querySelectorAll('li:not(.empty)');
    if (!items.length) return;
    if (activeIndex === -1) activeIndex = dir > 0 ? 0 : items.length - 1;
    else activeIndex = (activeIndex + dir + items.length) % items.length;
    items.forEach((el, i) => el.classList.toggle('selected', i === activeIndex));
    items[activeIndex].scrollIntoView({ block: 'nearest' });
  }

  function selectActive() {
    const items = listEl.querySelectorAll('li:not(.empty)');
    if (activeIndex > -1 && items[activeIndex]) pick(items[activeIndex].dataset.code);
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen() ? close() : open();
  });

  searchInput.addEventListener('input', () => { query = searchInput.value; render(); });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); selectActive(); }
    else if (e.key === 'Escape') close();
  });
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target)) close();
  });

  // sync label on external value changes
  syncLabel(labelEl, select.value);
  return { open, close, render };
}

const fromDropdown = buildDropdown('fromTrigger', 'fromMenu', fromSelect, fromLabel, convert);
const toDropdown = buildDropdown('toTrigger', 'toMenu', toSelect, toLabel, convert);

function populateSelects() {
  const html = CURRENCIES.map(c => `<option value="${c.code}">${c.flag} ${c.code}</option>`).join('');
  fromSelect.innerHTML = html;
  toSelect.innerHTML = html;
  fromSelect.value = 'USD';
  toSelect.value = 'EUR';
  syncLabel(fromLabel, 'USD');
  syncLabel(toLabel, 'EUR');
}

function buildQuickPairs() {
  quickPairsEl.innerHTML = '';
  QUICK_PAIRS.forEach(([from, to]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pair-pill';
    btn.textContent = `${from} → ${to}`;
    btn.addEventListener('click', () => {
      fromSelect.value = from;
      toSelect.value = to;
      syncLabel(fromLabel, from);
      syncLabel(toLabel, to);
      convert();
      amountInput.focus();
    });
    quickPairsEl.appendChild(btn);
  });
}

function formatAmount(value) {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatRate(rate) {
  if (rate >= 100) return rate.toFixed(2);
  if (rate >= 1) return rate.toFixed(4);
  return rate.toFixed(6);
}

function updateRateText(from, to, rate) {
  if (usingFallback) {
    rateText.textContent = `Offline estimate: 1 ${from} = ${formatRate(rate)} ${to}`;
    return;
  }
  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  rateText.textContent = `1 ${from} = ${formatRate(rate)} ${to}${timeStr ? ' · ' + timeStr : ''}`;
}

function convert() {
  const from = fromSelect.value;
  const to = toSelect.value;
  if (!rates[from] || !rates[to]) return;
  const rate = rates[to] / rates[from];
  updateRateText(from, to, rate);
  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount < 0) { animateResult(0); return; }
  animateResult(amount * rate);
}

// Animated number
let animFrame = null;
function animateResult(target) {
  const start = parseFloat(resultDisplay.dataset.value || '0') || 0;
  const duration = 350;
  const startTime = performance.now();
  cancelAnimationFrame(animFrame);

  function tick(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const current = start + (target - start) * eased;
    resultDisplay.textContent = formatAmount(current);
    if (t < 1) {
      animFrame = requestAnimationFrame(tick);
    } else {
      resultDisplay.dataset.value = target;
    }
  }
  animFrame = requestAnimationFrame(tick);
}

// Rates fetching
async function fetchRates() {
  refreshBtn.classList.add('spinning');
  rateText.textContent = 'Fetching live rates...';

  try {
    const force = refreshGiven ? '?force=1' : '';
    refreshGiven = false;
    const res = await fetch(API_URL + force);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    if (data.result !== 'success' || !data.rates) throw new Error('Unexpected response shape');
    rates = data.rates;
    usingFallback = !!data.usingFallback;
  } catch (err) {
    console.warn('Live rates unavailable — using offline estimates.', err);
    rates = FALLBACK_RATES;
    usingFallback = true;
  }

  lastUpdated = new Date();
  refreshBtn.classList.remove('spinning');
  rateDot.style.background = usingFallback ? '#ff9800' : '';
  window.adminRates = rates;
  window.adminFallback = usingFallback;
  window.adminUpdated = lastUpdated;
  convert();
  buildRatesTable();
}

// Rates table
function buildRatesTable() {
  if (!ratesTableEl || !rates.USD) return;
  ratesTableEl.innerHTML = '';
  POPULAR_PAIRS.forEach(([from, to]) => {
    if (!rates[from] || !rates[to]) return;
    const rate = rates[to] / rates[from];
    const item = document.createElement('div');
    item.className = 'rate-item';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.innerHTML = `<span class="pair">${from}/${to}</span><span class="value">${formatRate(rate)}</span>`;
    const activate = () => {
      fromSelect.value = from;
      toSelect.value = to;
      syncLabel(fromLabel, from);
      syncLabel(toLabel, to);
      convert();
      document.getElementById('converter').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    item.addEventListener('click', activate);
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    ratesTableEl.appendChild(item);
  });
}

// Swap
function swapCurrencies() {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
  syncLabel(fromLabel, fromSelect.value);
  syncLabel(toLabel, toSelect.value);
  swapBtn.classList.toggle('rotated');
  convert();
}

// ================================================================
// NAVBAR — scroll shadow + active section tracking
// ================================================================

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = ['converter', 'rates', 'features'].map(id => document.getElementById(id)).filter(Boolean);

  // Shadow on scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Smooth scroll for all nav links
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      const offset = id === 'converter' ? 0 : 70;
      const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSection(link.dataset.section);
    });
  });

  // Hero buttons
  const heroConvert = document.getElementById('heroConvert');
  const heroRates = document.getElementById('heroRates');
  if (heroConvert) heroConvert.addEventListener('click', (e) => { e.preventDefault(); scrollToSection('converter'); });
  if (heroRates) heroRates.addEventListener('click', (e) => { e.preventDefault(); scrollToSection('rates'); });

  // Brand click
  const navBrand = document.getElementById('navBrand');
  if (navBrand) navBrand.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // Transfer button
  const navTransfer = document.getElementById('navTransfer');
  if (navTransfer) navTransfer.addEventListener('click', (e) => { e.preventDefault(); scrollToSection('converter'); });

  // IntersectionObserver for active section
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}

// ================================================================
// SCROLL DARK MODE
// ================================================================

function initDarkMode() {
  const badge = document.getElementById('scrollModeBadge');
  const hero = document.getElementById('hero');
  if (!hero) return;

  function check() {
    const threshold = hero.offsetHeight * 0.5;
    const isDark = window.scrollY > threshold;
    document.body.classList.toggle('dark-mode', isDark);
    if (badge) {
      const label = document.getElementById('modeBadgeLabel');
      if (label) label.textContent = isDark ? 'Dark' : 'Light';
    }
  }

  window.addEventListener('scroll', check, { passive: true });
  check();
}

// ================================================================
// FALLING STARS
// ================================================================

function initStars() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];
  const STAR_COUNT = 140;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function makeStar(randomY, fixedX) {
    const size = Math.random() < 0.2 ? Math.random() * 3.2 + 1.8 : Math.random() * 2 + 0.8;
    return {
      x: fixedX !== undefined ? fixedX : Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : -5,
      size,
      speed: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.7 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.025 + 0.008,
      bright: Math.random() < 0.12
    };
  }

  for (let i = 0; i < STAR_COUNT; i++) {
    const x = (i / STAR_COUNT) * canvas.width + (Math.random() * 4 - 2);
    particles.push(makeStar(true, x));
  }

  if (reduceMotion) {
    particles.forEach(p => {
      const a = p.opacity * (0.6 + 0.4 * Math.sin(p.twinkle));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(138, 90, 43, ${a})`;
      ctx.fill();
    });
    return;
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.speed;
      p.twinkle += p.twinkleSpeed;
      if (p.y > canvas.height + 10) {
        p.y = -5;
        p.size = Math.random() < 0.2 ? Math.random() * 3.2 + 1.8 : Math.random() * 2 + 0.8;
        p.speed = Math.random() * 1.5 + 0.3;
        p.opacity = Math.random() * 0.7 + 0.3;
        p.bright = Math.random() < 0.12;
      }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;

      const a = p.opacity * (0.6 + 0.4 * Math.sin(p.twinkle));
      const color = p.bright ? `rgba(138, 90, 43, ${a})` : `rgba(160, 141, 116, ${a})`;

      if (p.bright) {
        const glowR = p.size * 3;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        grad.addColorStop(0, 'rgba(214, 176, 120, 0.25)');
        grad.addColorStop(1, 'rgba(214, 176, 120, 0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  tick();
}

// ================================================================
// EVENTS
// ================================================================

let debounceTimer;
amountInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(convert, 120);
});
fromSelect.addEventListener('change', convert);
toSelect.addEventListener('change', convert);
swapBtn.addEventListener('click', swapCurrencies);
refreshBtn.addEventListener('click', () => {
  refreshGiven = true;
  fetchRates();
});

// ================================================================
// INIT
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  populateSelects();
  buildQuickPairs();
  initStars();
  initNavbar();
  initDarkMode();
  fetchRates();
});
