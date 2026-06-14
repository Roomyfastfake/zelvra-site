# Zelvra Landing Page

React-powered GitHub Pages landing page for Zelvra, a pre-launch finance research brief service.

## Files

- `index.html` contains SEO metadata, the stylesheet link, React import map, and the app mount point.
- `styles.css` contains the responsive visual design.
- `src/App.js` contains the React components, content arrays, sample brief modes, and contact interactions.
- `src/main.js` mounts the React app.
- `assets/favicon.svg` is the favicon placeholder.
- `assets/zelvra-mark.svg` is the replaceable logo mark used in the header and footer.

The page uses React from a CDN import map, so there is no backend, package install, or build step.

## Edit

Most copy lives in `src/App.js`:

- `features` controls the three solution cards.
- `steps` controls the process section.
- `samples` controls the interactive sample brief modes.
- `offerItems` controls the "what you receive" list in the contact section.
- `email`, `sampleSubject`, and `sampleBody` control the contact address and prefilled email request.

Open `styles.css` to adjust colors, spacing, and responsive layout.

The header and hero "Request a sample brief" buttons scroll to the contact section. The contact section includes an "Open email app" mailto link plus a selectable email field and copy button for browsers that block mailto or clipboard access.

To replace the logo later, swap `assets/zelvra-mark.svg` with the final mark or update the `Brand` component in `src/App.js` to point at a different asset. To replace the favicon, swap `assets/favicon.svg` and keep the link in `index.html`.

## Preview Locally

Run a simple local server from this folder:

```powershell
py -3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Deploy To GitHub Pages

1. Push this repository to GitHub.
2. In GitHub, open the repository settings.
3. Go to **Pages**.
4. Set the source to deploy from the main branch root.
5. Save the setting and wait for GitHub Pages to publish.

No paid APIs, backend services, npm install, or build pipeline are required.
