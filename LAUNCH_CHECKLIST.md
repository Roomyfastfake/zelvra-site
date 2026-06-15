# Zelvra Launch Checklist

Run through this after deployment (see `DEPLOYMENT_CHECKLIST.md`) to confirm the site
and email are fully live.

## Email (Zoho)

- [ ] `hello@zelvra.tech` alias exists in Zoho and can receive mail.
- [ ] Send a test email to `hello@zelvra.tech` from an outside account — it arrives.
- [ ] Reply from `hello@zelvra.tech` — it sends.
- [ ] DKIM shows **green / verified** in the Zoho admin console.
- [ ] SPF and MX records are intact in Cloudflare (not deleted during DNS setup).

## Domain + hosting

- [ ] `https://zelvra.tech/` loads over HTTPS.
- [ ] `https://www.zelvra.tech/` loads (or redirects to the apex).
- [ ] HTTPS is enforced (no insecure warning, http redirects to https).
- [ ] `https://zelvra.tech/sample.html` loads (sample brief link works).
- [ ] An unknown path shows the styled 404 page.

## Page behavior

- [ ] "Request a sample brief" opens the email app, prefilled subject "Request a sample brief".
- [ ] "See how it works" scrolls to `#process`.
- [ ] "Contact" scrolls to `#contact`.
- [ ] "Copy email" copies `hello@zelvra.tech` and shows the "Copied" state.
- [ ] The "What to include in your email" template is visible in the contact section.
- [ ] Mobile view works at small widths (no horizontal scroll); menu opens/closes.
- [ ] Footer disclaimer reads "Research content only. Not financial advice."

## Content readiness (manual, before outreach)

- [ ] At least one real sample brief is prepared (kept private, sent on request).
- [ ] Outreach list drafted (see `ops/outreach-intake-template.md`).
- [ ] `ops/sample-brief-template.md` is ready to fill for each prospect.
