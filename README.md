# CC Currency Converter — Backend

Node.js + Express API that powers the converter and admin dashboard.

## Quick start

```bash
npm install
npm start
```

Server runs on `http://localhost:3000` and also serves the frontend files that sit
in this same folder (index.html, style.css, script.js, admin.js). Open it in a browser.

## Endpoints

| Method | Path                 | Auth  | Description                                 |
|--------|----------------------|-------|---------------------------------------------|
| GET    | `/api/health`        | no    | Health check                                |
| GET    | `/api/rates`         | no    | Live exchange rates (USD base, 60s cache)   |
| GET    | `/api/rates?force=1` | no    | Bypass cache and refetch                    |
| POST   | `/api/auth/login`    | no    | Admin login → returns token                 |
| GET    | `/api/admin/overview`| Bearer | Dashboard stats                            |
| GET    | `/api/admin/rates`   | Bearer | Full rate table with currency metadata      |

## Configuration (.env)

Copy `.env.example` to `.env` and adjust:

- `PORT` — server port (default 3000)
- `UPSTREAM_URL` — exchange rate source (USD base)
- `ADMIN_USER` / `ADMIN_PASS` — admin login credentials
- `JWT_SECRET` — secret used to sign login tokens

If the upstream API is unreachable, the server automatically falls back to built-in
approximate estimates (marked with `usingFallback: true`).

## Deploying the frontend separately

If you serve the static site from another host, point the frontend at this API by
setting `window.API_BASE` before script.js/admin.js load in index.html:

```html
<script>window.API_BASE = 'https://api.yourdomain.com';</script>
<script src="script.js"></script>
<script src="admin.js"></script>
```

Both `script.js` and `admin.js` respect that value. When left empty they call the
backend on the same origin.