# Zelvra Landing Page

Static landing page for **Zelvra**, a pre-launch finance research-brief service that
turns filings, earnings reports, and transcripts into source-backed briefs.

- **No framework** — plain HTML, CSS, and one small vanilla JS file.
- **No backend** — every CTA is a `mailto:` link or an in-page anchor.
- **No build step** — open `index.html` (or serve the folder) and it runs as-is.

## File structure

| File | Purpose |
| --- | --- |
| `index.html` | All page content + SEO/Open Graph/Twitter meta and JSON-LD. |
| `styles.css` | Responsive visual design (dark financial theme). |
| `app.js` | Vanilla JS: mobile nav, interactive sample tabs, copy-email. |
| `assets/favicon.svg` | Favicon. |
| `assets/zelvra-mark.svg` | Logo mark used in the header and footer. |
| `assets/og-image.png` | 1200×630 social share image (Open Graph / Twitter). |
| `assets/og-image.py` | Pillow script that regenerates `og-image.png`. |
| `CNAME` | Custom domain for GitHub Pages (`zelvra.tech`). |
| `.nojekyll` | Tells GitHub Pages to serve files as-is (skip Jekyll). |

## Edit the copy

- Hero, problem, solution, and process copy live directly in `index.html`.
- The interactive sample-brief modes (Earnings call / 10-K / Transcript) are defined in
  the `samples` object in `app.js`. The default "earnings" mode is also written into
  `index.html` so the content is visible without JavaScript and crawlable by search engines.
- The contact address is `hello@zelvra.tech`. To change it, update the `EMAIL` constant in
  `app.js`, the `mailto:` links and `#contact-email` value in `index.html`, and the JSON-LD block.

To regenerate the social image after a brand tweak:

```powershell
py -3 assets/og-image.py
```

## Preview locally

From the project folder, start any static file server. Python is simplest:

```powershell
py -3 -m http.server 8000
```

Then open <http://localhost:8000>. Use a server (not a `file://` path) so relative asset
paths resolve exactly as they will in production.

## Deploy to GitHub Pages

1. Create a GitHub repository and push this folder (see commands below).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source = Deploy from a branch**.
4. Choose **Branch = `main`** and **folder = `/ (root)`**, then **Save**.
5. The `CNAME` file sets the custom domain to `zelvra.tech` automatically. After DNS
   resolves (next section), tick **Enforce HTTPS**.

GitHub Pages publishes the site at `https://zelvra.tech/` once DNS propagates and the
certificate is issued (usually minutes, sometimes up to ~24h on first setup).

## Cloudflare DNS records

Add these in the Cloudflare dashboard for `zelvra.tech`. Set the proxy status to
**DNS only (grey cloud)** so GitHub can issue and renew the TLS certificate. You can
enable the orange-cloud proxy later if you want, with SSL/TLS mode set to **Full**.

**Apex domain `zelvra.tech` → GitHub Pages (four A + four AAAA records):**

| Type | Name | Value | Proxy |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | DNS only |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| AAAA | `@` | `2606:50c0:8000::153` | DNS only |
| AAAA | `@` | `2606:50c0:8001::153` | DNS only |
| AAAA | `@` | `2606:50c0:8002::153` | DNS only |
| AAAA | `@` | `2606:50c0:8003::153` | DNS only |

**`www` subdomain → your GitHub Pages site:**

| Type | Name | Value | Proxy |
| --- | --- | --- | --- |
| CNAME | `www` | `<your-github-username>.github.io` | DNS only |

> Replace `<your-github-username>` with your actual GitHub username (or org name).
> Cloudflare can also flatten a CNAME at the apex, but the A/AAAA records above are the
> approach GitHub documents and are the most reliable.

## ⚠️ Do not touch your Zoho email records

This domain already sends/receives mail through **Zoho**. The records above only add the
**website** (A / AAAA / CNAME for `@` and `www`). Leave every existing Zoho record exactly
as it is — do not delete or edit them:

- **MX** records (e.g. `mx.zoho.com`, `mx2.zoho.com`, `mx3.zoho.com`).
- **SPF** — the `TXT` record on `@` containing `v=spf1 include:zoho.com ...`.
- **DKIM** — the `TXT` record on a selector such as `zmail._domainkey`.
- Any Zoho domain-verification `TXT` record.

The website records and the email records do not overlap, so adding the A/AAAA/CNAME
entries will not affect mail delivery — as long as the Zoho MX/SPF/DKIM records stay intact.
