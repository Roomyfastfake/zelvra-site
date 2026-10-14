# Hosting and HTTPS for zelvra.tech

Public file (served by GitHub Pages). No secrets here.

## Setup

- Site: GitHub Pages, repo `Roomyfastfake/zelvra-site`, branch `main`, folder `/ (root)`.
  Deploy = `git push origin main`.
- DNS: Cloudflare (`laylah.ns.cloudflare.com`). Website records are the apex A/AAAA
  records and the `www` CNAME. Mail (Zoho) lives on the same zone; see "Do not touch" below.

## Incident: 2026-09-18 to 2026-10-14

GitHub's Let's Encrypt certificate for `zelvra.tech` expired on 2026-09-18 and was never
renewed. Cloudflare was set to **Full (strict)**, so it rejected the expired origin cert and
every URL returned **526**.

Root cause: GitHub renews its certificate only when the domain resolves to GitHub's IPs.
With the records proxied (orange cloud), `zelvra.tech` resolves to Cloudflare IPs, so
GitHub cannot renew. The first cert was issued before the proxy was turned on, so the
problem only appeared at the first renewal, about 90 days later.

## Current mode (stopgap, set 2026-10-14)

- Records: proxied (orange cloud).
- Cloudflare SSL/TLS mode: **Full** (not strict).
- Why Full avoids the 526: it encrypts the Cloudflare-to-GitHub leg but does not validate the
  origin cert, so the expired GitHub cert is accepted.
- Why strict fails: strict requires a valid origin cert. GitHub's cert can never renew
  while proxied, and GitHub Pages cannot install a Cloudflare Origin CA cert.
- Trade-off: the Cloudflare-to-GitHub leg is encrypted but **unauthenticated**.
  Visitors see a valid Cloudflare cert. Cloudflare cannot verify it is talking to GitHub.
  That is acceptable for a static marketing site, but it's not the clean setup.

## Durable fix: grey-cloud the website records

This removes Cloudflare from the web path for the site so GitHub can issue and auto-renew
its own cert. Allow 1 to 2 hours. Visitors may see a certificate warning for up to about
an hour (between step 2 and step 6), so do it at a quiet time.

1. **Pre-check CAA.** If the zone has any CAA record, one must allow `letsencrypt.org`.
   As of 2026-10-14 there are none (fine).

   ```bash
   curl -s "https://cloudflare-dns.com/dns-query?name=zelvra.tech&type=CAA" -H "accept: application/dns-json"
   ```

2. **Grey-cloud the website records only.** Cloudflare > DNS > Records, set Proxy status
   to **DNS only** on:
   - `A @` 185.199.108.153, .109.153, .110.153, .111.153
   - `AAAA @` 2606:50c0:8000::153, 8001::153, 8002::153, 8003::153 (add these if absent;
     the 2606:4700 AAAA seen in lookups is Cloudflare's own, not a zone record)
   - `CNAME www` `roomyfastfake.github.io`. It must be grey too, or the new cert may
     lack `www`.

   MX and TXT records have no proxy toggle. Leave them alone.

3. **Confirm DNS now points at GitHub** (proxied records use a 5 min TTL):

   ```bash
   curl -s "https://cloudflare-dns.com/dns-query?name=zelvra.tech&type=A" -H "accept: application/dns-json"
   curl -s "https://cloudflare-dns.com/dns-query?name=www.zelvra.tech&type=CNAME" -H "accept: application/dns-json"
   curl -skI https://zelvra.tech/ | grep -i '^server'
   ```

   Expect only `185.199.10x.153`, a `roomyfastfake.github.io.` CNAME, and
   `server: GitHub.com`, not `cloudflare`. `-k` is needed because the cert is still the
   expired one.

4. **Force GitHub to reissue.** github.com/Roomyfastfake/zelvra-site > Settings > Pages >
   Custom domain: click **Remove**, then type `zelvra.tech` and **Save**. Wait for the
   DNS check to go green.

5. **Sync the local repo.** Remove and Save each push a commit to `main` that edits the
   `CNAME` file. Pull before the next deploy or the push is rejected:

   ```bash
   git pull --ff-only origin main
   cat CNAME
   ```

   `CNAME` must read `zelvra.tech`.

6. **Wait for the cert.** Usually minutes, up to 1 hour per GitHub docs. Check it
   (Git Bash):

   ```bash
   echo | openssl s_client -connect 185.199.108.153:443 -servername zelvra.tech 2>/dev/null | openssl x509 -noout -dates -ext subjectAltName
   echo | openssl s_client -connect 185.199.108.153:443 -servername www.zelvra.tech 2>/dev/null | openssl x509 -noout -dates -ext subjectAltName
   ```

   Done when `notAfter` is about 90 days out and the SAN lists both `zelvra.tech` and
   `www.zelvra.tech`.

7. **Re-enable Enforce HTTPS** on Settings > Pages. It can take up to 24 hours to become
   clickable.

8. **Keep the records grey.** Turning the orange cloud back on breaks the next renewal
   and brings back the 526 (under strict) about 90 days later. With the records grey,
   Cloudflare's SSL mode, Always Use HTTPS, HSTS, and page/redirect rules no longer apply
   to the site. GitHub handles HTTPS.

**Rollback:** if no cert appears within 24 hours, set the website records back to
proxied with SSL mode **Full**. That restores the stopgap above.

## Ongoing check

GitHub renews about 30 days before expiry. Run the step 6 command occasionally. `notAfter`
should keep moving forward. If it stops moving and the date is under 30 days away, check
that the records are still grey.

## Do not touch: Zoho mail records

Live values as of 2026-10-14. Leave them exactly as they are:

- `MX` `mx.zoho.in` (10), `mx2.zoho.in` (20), `mx3.zoho.in` (50)
- `TXT @` SPF: `v=spf1 include:zoho.in include:spf.efwd.registrar-servers.com ~all`
- `TXT @` `zoho-verification=...`
- `TXT zmail._domainkey` (DKIM)
