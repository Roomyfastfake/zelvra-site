# Zelvra Landing Page

Static marketing site for **Zelvra**, a research/content desk that turns financial filings,
earnings reports, 10-Ks, and transcripts into sharp, source-backed research briefs for
finance creators.

- **No framework** — plain HTML, CSS, and one small vanilla JS file.
- **No backend, no build step, no paid services** — every CTA is a `mailto:` link or an in-page anchor.
- **GitHub Pages ready** — `index.html` lives at the repo root.

## File structure

| File | Purpose |
| --- | --- |
| `index.html` | Homepage: nav, hero, problem, what we deliver, process, sample preview, contact CTA, footer. |
| `sample-nvidia-q1-fy2027.html` | Real NVIDIA Q1 FY2027 sample brief: KPI cards, sticky TOC, copy-able X thread, collapsible source list and YouTube talking points. |
| `sample.html` | Generic "sample brief" structure page (brief anatomy, no real company data). |
| `404.html` | Styled not-found page (served by GitHub Pages for unknown paths). |
| `styles.css` | Responsive visual design (dark financial theme). |
| `script.js` | Vanilla JS: mobile nav, interactive sample tabs, copy-email, brief scroll progress, sticky-TOC highlighting, copy-X-thread. |
| `CNAME` | Custom domain for GitHub Pages (`zelvra.tech`). |
| `site.webmanifest` | Web app manifest (name, theme color, icon). |
| `robots.txt` / `sitemap.xml` | Crawler directives + URL list. |
| `.nojekyll` | Tells GitHub Pages to serve files as-is (skip Jekyll). |
| `.gitignore` | Keeps local tooling (`.claude/`) out of the repo. |
| `assets/favicon.svg` | Favicon. |
| `assets/zelvra-mark.svg` | Logo mark used in the header and footer. |
| `assets/og-image.png` | 1200x630 social share image (Open Graph / Twitter). |
| `scripts/make_og_image.py` | Stdlib-only Python script that regenerates `og-image.png` (no dependencies). |
| `*-template.md`, `website-update-notes.md` | Internal content-ops templates (not part of the deployed pages). |
| `DEPLOYMENT_CHECKLIST.md` / `LAUNCH_CHECKLIST.md` | Step-by-step launch guides. |

## Edit the copy

- Homepage copy (hero, problem, solution, process, contact) lives directly in `index.html`.
- The interactive sample modes (Earnings call / 10-K / Transcript) are defined in the
  `samples` object in `script.js`. The default "earnings" mode is also written into
  `index.html` so the content is visible without JavaScript and crawlable.
- The full sample-brief structure is in `sample.html`.
- Contact address is `hello@zelvra.tech`. To change it, update the `EMAIL` constant in
  `script.js`, the `mailto:` links and `#contact-email` value in the HTML, and the JSON-LD block.
- See `website-update-notes.md` for a plain-English editing guide.

Regenerate the social image after a brand tweak (no dependencies required):

```bash
python3 scripts/make_og_image.py
```

## Preview locally

From the project folder, start any static file server:

```bash
python -m http.server 8000
```

(On Windows, use `py -3 -m http.server 8000` if `python` is not on your PATH.)

Then open <http://127.0.0.1:8000/>. Use a server (not a `file://` path) so relative asset
paths resolve exactly as they will in production.

## Deploy to GitHub Pages

1. Push this repository to GitHub (see `DEPLOYMENT_CHECKLIST.md` for the exact commands).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source = Deploy from a branch**.
4. Choose **Branch = `main`** and **folder = `/ (root)`**, then **Save**.
5. The `CNAME` file sets the custom domain to `zelvra.tech` automatically. After DNS
   resolves, tick **Enforce HTTPS**.

No build step, npm install, or backend is required.

## Cloudflare DNS records

Add these for `zelvra.tech`. Set proxy status to **DNS only (grey cloud)** so GitHub can
issue and renew the TLS certificate.

**Apex domain `zelvra.tech` → GitHub Pages:**

```
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
```

**`www` subdomain → your GitHub Pages site:**

```
CNAME   www   roomyfastfake.github.io
```

(Optional but recommended for full IPv6 support, add the four GitHub Pages AAAA records:
`2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.)

## ⚠️ Do not delete your Zoho email records

This domain sends/receives mail through **Zoho**. The records above only add the **website**.
Leave every existing Zoho record exactly as it is:

- **MX** records (`mx.zoho.com`, `mx2.zoho.com`, `mx3.zoho.com`).
- **SPF** — the `TXT` record on `@` containing `v=spf1 include:zoho.com ...`.
- **DKIM** — the `TXT` record on a selector such as `zmail._domainkey`.
- Any Zoho domain-verification `TXT` record.

The website and email records do not overlap, so adding A / AAAA / CNAME entries will not
affect mail delivery — as long as the Zoho MX/SPF/DKIM records stay intact.
