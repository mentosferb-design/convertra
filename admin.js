// ===== ===== ===== ===== ===== ===== ===== ===== =====
//  CC Currency Converter — Admin Dashboard (frontend)
// ===== ===== ===== ===== ===== ===== ===== ===== =====
// Optional admin panel — the converter works without it.
// Login is done against the Node.js backend API; if unreachable
// it falls back to local demo credentials so the page still works.

(function () {
  'use strict';

  var apiBase = (window.API_BASE || '').replace(/\/$/, '') || '';

  // Local demo credentials (fallback when the backend is offline).
  var ADMIN_USER = 'mentos';
  var ADMIN_PASS = 'mentos321';

  var isAdmin = false;
  var adminToken = null;
  var adminUserValue = '';

  function $(id) {
    return document.getElementById(id);
  }

  function init() {
    var loginModal = $('loginModal');
    var loginForm = $('loginForm');
    var loginCloseBtn = $('loginCloseBtn');
    var loginNavBtn = $('loginNavBtn');
    var loginNavLabel = $('loginNavLabel');
    var adminUser = $('adminUser');
    var adminPass = $('adminPass');
    var loginError = $('loginError');
    var adminPanel = $('adminPanel');
    var exitAdminBtn = $('exitAdminBtn');
    var logoutBtn = $('logoutBtn');

    // ---------- Login modal ----------
    function openLogin() {
      if (!loginModal) return;
      loginModal.hidden = false;
      if (loginError) loginError.hidden = true;
      if (adminUser) adminUser.focus();
    }
    function closeLogin() {
      if (!loginModal) return;
      loginModal.hidden = true;
      if (adminPass) adminPass.value = '';
      if (loginError) loginError.hidden = true;
    }

    if (loginCloseBtn) loginCloseBtn.addEventListener('click', closeLogin);
    if (loginModal) loginModal.addEventListener('click', function (e) {
      if (e.target === loginModal) closeLogin();
    });

    // THE login icon button — bind the click reliably.
    if (loginNavBtn) {
      loginNavBtn.addEventListener('click', function () {
        if (isAdmin) {
          openDashboard();
        } else {
          openLogin();
        }
      });
      loginNavBtn.style.cursor = 'pointer';
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLogin();
    });

    // ---------- Login submission ----------
    if (loginForm && adminUser && adminPass && loginError) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var u = adminUser.value.trim();
        var p = adminPass.value;
        loginError.hidden = true;
        var btn = loginForm.querySelector('.login-submit');
        if (btn) btn.disabled = true;

        tryBackendLogin(u, p).then(function (ok) {
          if (ok) {
            isAdmin = true;
            adminUserValue = u;
            closeLogin();
            openDashboard();
          } else {
            loginError.textContent = 'Invalid username or password.';
            loginError.hidden = false;
          }
          if (btn) btn.disabled = false;
        });
      });
    }

    // ---------- Dashboard ----------
    function openDashboard() {
      if (!adminPanel) return;
      adminPanel.hidden = false;
      document.body.classList.add('no-scroll');
      if (loginNavLabel) loginNavLabel.textContent = 'Dashboard';
      if ($('adminNameLabel')) $('adminNameLabel').textContent = adminUserValue || 'admin';
      loadOverview();
      loadRates();
    }

    function closeDashboard() {
      if (adminPanel) adminPanel.hidden = true;
      document.body.classList.remove('no-scroll');
      if (loginNavLabel) loginNavLabel.textContent = 'Login';
    }

    function logout() {
      isAdmin = false;
      adminToken = null;
      adminUserValue = '';
      closeDashboard();
    }

    if (exitAdminBtn) exitAdminBtn.addEventListener('click', closeDashboard);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // ---------- Tabs ----------
    var adminTabs = document.querySelectorAll('.admin-tab');
    var titles = {
      overview: 'Dashboard',
      rates: 'Exchange Rates',
      users: 'Users',
      settings: 'Settings'
    };

    function switchTab(tabId) {
      adminTabs.forEach(function (t) {
        t.classList.toggle('active', t.getAttribute('data-tab') === tabId);
      });
      document.querySelectorAll('.admin-section').forEach(function (s) {
        s.classList.toggle('active', s.id === 'tab-' + tabId);
      });
      var title = $('adminTitle');
      if (title) title.textContent = titles[tabId] || 'Dashboard';
      if (tabId === 'rates') loadRates();
    }

    adminTabs.forEach(function (t) {
      t.addEventListener('click', function () { switchTab(t.getAttribute('data-tab')); });
    });

    // ---------- Backend ----------
    function callAdmin(path) {
      var headers = {};
      if (adminToken) headers.Authorization = 'Bearer ' + adminToken;
      return fetch(apiBase + path, { headers: headers })
        .then(function (res) { return res.json(); })
        .catch(function () { return null; });
    }

    function loadOverview() {
      var statCurrencies = $('statCurrencies');
      var statRates = $('statRates');
      var statSource = $('statSource');
      var statUpdated = $('statUpdated');
      if (!statCurrencies && !statRates) return;

      callAdmin('/api/admin/overview').then(function (data) {
        if (data && data.ok) {
          if (statCurrencies) statCurrencies.textContent = data.currencies;
          if (statRates) statRates.textContent = data.ratesLoaded;
          if (statSource) statSource.textContent = data.source || '-';
          if (statUpdated) statUpdated.textContent = data.lastUpdated
            ? new Date(data.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Not loaded yet';
        } else {
          renderStatsFallback(statCurrencies, statRates, statSource, statUpdated);
        }
      });
    }

    function renderStatsFallback(statCurrencies, statRates, statSource, statUpdated) {
      var n = window.adminRates ? Object.keys(window.adminRates).length : 0;
      if (statCurrencies) statCurrencies.textContent = n || '—';
      if (statRates) statRates.textContent = window.adminRates ? Object.keys(window.adminRates).length : 0;
      if (statSource) statSource.textContent = window.adminFallback ? 'Offline estimates' : 'open.er-api.com';
      if (statUpdated) statUpdated.textContent = window.adminUpdated
        ? window.adminUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Not loaded yet';
    }

    var rateSearch = $('adminRateSearch');
    var refreshRatesBtn = $('adminRefreshRates');
    var rateTable = $('adminRateTable');

    function loadRates() {
      var query = rateSearch ? rateSearch.value.trim() : '';
      var path = '/api/admin/rates' + (query ? '?search=' + encodeURIComponent(query) : '');
      callAdmin(path).then(function (data) {
        if (data && data.ok && Array.isArray(data.rates)) {
          renderRateList(data.rates);
        } else {
          renderRateListFallback(query);
        }
      });
    }

    function renderRateList(rows) {
      if (!rateTable) return;
      rateTable.innerHTML = '';
      rows.forEach(function (r) {
        var tr = document.createElement('tr');
        tr.innerHTML =
          '<td class="admin-flag">' + (r.flag || '') + '</td>' +
          '<td class="admin-code">' + r.code + '</td>' +
          '<td>' + r.name + '</td>' +
          '<td class="admin-rate">' + (r.rate !== null ? formatAdminRate(r.rate) : '—') + '</td>' +
          '<td><span class="admin-status ' + (r.live ? 'ok' : 'muted') + '">' + (r.live ? 'Live' : '—') + '</span></td>';
        rateTable.appendChild(tr);
      });
    }

    var STATIC_CURRENCIES = [
      { code: 'USD', name: 'US Dollar', flag: '\uD83C\uDDFA\uD83C\uDDF8' },
      { code: 'EUR', name: 'Euro', flag: '\uD83C\uDDEA\uD83C\uDDFA' },
      { code: 'GBP', name: 'British Pound', flag: '\uD83C\uDDEC\uD83C\uDDE7' },
      { code: 'JPY', name: 'Japanese Yen', flag: '\uD83C\uDDEF\uD83C\uDDF5' },
      { code: 'AUD', name: 'Australian Dollar', flag: '\uD83C\uDDE6\uD83C\uDDFA' },
      { code: 'CAD', name: 'Canadian Dollar', flag: '\uD83C\uDDE8\uD83C\uDDE6' },
      { code: 'CHF', name: 'Swiss Franc', flag: '\uD83C\uDDE8\uD83C\uDDED' },
      { code: 'CNY', name: 'Chinese Yuan', flag: '\uD83C\uDDE8\uD83C\uDDF3' },
      { code: 'INR', name: 'Indian Rupee', flag: '\uD83C\uDDEE\uD83C\uDDF3' },
      { code: 'AED', name: 'UAE Dirham', flag: '\uD83C\uDDE6\uD83C\uDDEA' },
      { code: 'SAR', name: 'Saudi Riyal', flag: '\uD83C\uDDF8\uD83C\uDDE6' },
      { code: 'KES', name: 'Kenyan Shilling', flag: '\uD83C\uDDF0\uD83C\uDDEA' },
      { code: 'NGN', name: 'Nigerian Naira', flag: '\uD83C\uDDF3\uD83C\uDDEC' },
      { code: 'ZAR', name: 'South African Rand', flag: '\uD83C\uDDFF\uD83C\uDDE6' },
      { code: 'EGP', name: 'Egyptian Pound', flag: '\uD83C\uDDEA\uD83C\uDDEC' },
      { code: 'TRY', name: 'Turkish Lira', flag: '\uD83C\uDDF9\uD83C\uDDF7' },
      { code: 'SGD', name: 'Singapore Dollar', flag: '\uD83C\uDDF8\uD83C\uDDEC' },
      { code: 'HKD', name: 'Hong Kong Dollar', flag: '\uD83C\uDDED\uD83C\uDDF0' },
      { code: 'NZD', name: 'New Zealand Dollar', flag: '\uD83C\uDDF3\uD83C\uDDFF' },
      { code: 'SEK', name: 'Swedish Krona', flag: '\uD83C\uDDF8\uD83C\uDDEA' },
      { code: 'MXN', name: 'Mexican Peso', flag: '\uD83C\uDDF2\uD83C\uDDFD' },
      { code: 'BRL', name: 'Brazilian Real', flag: '\uD83C\uDDE7\uD83C\uDDF7' },
      { code: 'PKR', name: 'Pakistani Rupee', flag: '\uD83C\uDDF5\uD83C\uDDF0' },
      { code: 'THB', name: 'Thai Baht', flag: '\uD83C\uDDF9\uD83C\uDDED' },
      { code: 'MYR', name: 'Malaysian Ringgit', flag: '\uD83C\uDDF2\uD83C\uDDFE' }
    ];

    function renderRateListFallback(query) {
      if (!rateTable) return;
      var rates = window.adminRates || {};
      var q = (query || '').toLowerCase();
      var rows = STATIC_CURRENCIES.filter(function (c) {
        return !q || c.code.toLowerCase().indexOf(q) !== -1 || c.name.toLowerCase().indexOf(q) !== -1;
      });
      rateTable.innerHTML = '';
      rows.forEach(function (c) {
        var rate = rates[c.code];
        var has = rate !== undefined;
        var tr = document.createElement('tr');
        tr.innerHTML =
          '<td class="admin-flag">' + c.flag + '</td>' +
          '<td class="admin-code">' + c.code + '</td>' +
          '<td>' + c.name + '</td>' +
          '<td class="admin-rate">' + (has ? formatAdminRate(rate) : '—') + '</td>' +
          '<td><span class="admin-status ' + (has ? 'ok' : 'muted') + '">' + (has ? 'Live' : '—') + '</span></td>';
        rateTable.appendChild(tr);
      });
    }

    function formatAdminRate(rate) {
      if (rate >= 100) return rate.toFixed(2);
      if (rate >= 1) return rate.toFixed(4);
      return rate.toFixed(6);
    }

    if (rateSearch) rateSearch.addEventListener('input', function () {
      adminToken ? loadRates() : renderRateListFallback(rateSearch.value.trim());
    });
    if (refreshRatesBtn) refreshRatesBtn.addEventListener('click', function () {
      var refreshBtn = $('refreshBtn');
      if (refreshBtn) refreshBtn.click();
      setTimeout(function () { loadOverview(); loadRates(); }, 800);
    });
  }

  // ---------- Backend login call ----------
  function tryBackendLogin(u, p) {
    return fetch(apiBase + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    }).then(function (res) {
      if (res.ok) {
        return res.json().then(function (data) {
          adminToken = data.token;
          return true;
        });
      }
      return false;
    }).catch(function () {
      // Backend not running — fall back to local demo check.
      return u === ADMIN_USER && p === ADMIN_PASS;
    });
  }

  // Wait for the DOM before wiring the login button.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();