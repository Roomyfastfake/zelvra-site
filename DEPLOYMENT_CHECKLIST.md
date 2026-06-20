# Zelvra Deployment Checklist

Step-by-step to get the static site live on GitHub Pages at `https://zelvra.tech/`.
No build step is required.

## 1. Create the GitHub repository

1. Go to <https://github.com/new>.
2. Owner: `Roomyfastfake`. Repository name: `zelvra-site`.
3. Visibility: Public (required for free GitHub Pages).
4. Do **not** add a README, .gitignore, or license (this repo already has them).
5. Click **Create repository**.

## 2. Connect the local repo and push

From the project folder:

```bash
git remote add origin https://github.com/Roomyfastfake/zelvra-site.git
git branch -M main
git push -u origin main
```

If `origin` already exists, replace the first line with:

```bash
git remote set-url origin https://github.com/Roomyfastfake/zelvra-site.git
```

## 3. Enable GitHub Pages

1. In the repo: **Settings → Pages**.
2. **Build and deployment → Source = Deploy from a branch**.
3. **Branch = `main`**, **Folder = `/ (root)`** → **Save**.
4. Wait for the first build (usually under a minute).

## 4. Custom domain

1. Still on **Settings → Pages**, the **Custom domain** field should already show
   `zelvra.tech` (read from the committed `CNAME` file). If empty, type `zelvra.tech` and Save.
2. GitHub will run a DNS check — it stays "unverified" until the Cloudflare records below resolve.

## 5. Cloudflare DNS

In the Cloudflare dashboard for `zelvra.tech`, add (proxy = **DNS only / grey cloud**):

```
A      @     185.199.108.153
A      @     185.199.109.153
A      @     185.199.110.153
A      @     185.199.111.153
CNAME  www   roomyfastfake.github.io
```

Optional IPv6 (AAAA on `@`): `2606:50c0:8000::153`, `2606:50c0:8001::153`,
`2606:50c0:8002::153`, `2606:50c0:8003::153`.

**Do not delete or edit the Zoho MX/SPF/DKIM records.** They handle email and do not
overlap with these website records.

## 6. Enable HTTPS

1. Wait for DNS to propagate (minutes to a few hours; first-time TLS can take up to ~24h).
2. Back on **Settings → Pages**, once the domain is verified, tick **Enforce HTTPS**.

## 7. Final test checklist

- [ ] `https://zelvra.tech/` loads over HTTPS with no certificate warning.
- [ ] `https://www.zelvra.tech/` redirects/loads to the site.
- [ ] `https://zelvra.tech/sample.html` loads.
- [ ] A made-up path (e.g. `/nope`) shows the styled 404 page.
- [ ] "Request a sample brief" opens the email app with subject "Request a sample brief".
- [ ] "See how it works" scrolls to the Process section; "Contact" scrolls to the contact section.
- [ ] "Copy email" copies `hello@zelvra.tech` and shows the "Copied" state.
- [ ] Mobile menu opens and closes; tapping a link closes it.
- [ ] Footer shows "Research content only. Not financial advice."
- [ ] No console errors (open DevTools → Console).
