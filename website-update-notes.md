# Website Update Notes

Plain-English guide for editing the Zelvra site. Everything is static, so edit a file,
save, and re-deploy (commit + push). No build step.

## Where things live

| You want to change... | Edit this |
| --- | --- |
| Headline / hero text | `index.html` — the `<h1 id="hero-title">` and `.hero-subhead` |
| Nav links | `index.html` — the `<nav class="site-nav">` block |
| Problem / What we deliver / Process text | `index.html` — the matching `<section>` |
| Homepage sample preview (tabs) | `script.js` — the `samples` object |
| Full sample brief page | `sample.html` |
| Contact email everywhere | see "Change the email" below |
| Colors, spacing, fonts | `styles.css` (CSS variables are in `:root` at the top) |
| Social share image | run `py -3 assets/og-image.py` after editing it |

## Change the headline

In `index.html`, find `<h1 id="hero-title">` and edit the text inside. Keep it short.

## Change the email address

The address `hello@zelvra.tech` appears in a few places. Update all of them:

1. `script.js` — the `EMAIL` constant near the top.
2. `index.html` — the `mailto:` links, the `#contact-email` input `value`, the footer link,
   and the JSON-LD `"email"` field.
3. `sample.html` and `404.html` — the `mailto:` links and footer link.

## Add or edit a section (homepage)

Each block is a `<section class="... section-shell">` in `index.html`. Copy an existing
section, change the `id`, heading, and text. If it should appear in the nav, add a link in
the `<nav class="site-nav">` pointing to `#your-new-id`.

## Edit the sample brief text

- Homepage interactive preview: edit the `samples` object in `script.js` (each of
  `earnings`, `filing`, `transcript` has `hook`, `metrics`, `upside`, `risk`, `angle`).
- Full page: edit the sections inside `sample.html`. Keep the "Illustrative structure only.
  Not a company recommendation." line and do not insert real company figures.

## Re-deploy after editing

```bash
git add -A
git commit -m "Update site copy"
git push
```

GitHub Pages redeploys automatically within a minute or so.

## Rules to keep

- No fake clients, testimonials, or metrics.
- No investment advice; keep "Research content only. Not financial advice." in the footer.
- The contact form is `mailto:` only — never wire up a fake submitting form.
