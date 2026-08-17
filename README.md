# Campus Finance

Static site for the Campus Finance loan application form (`campusfinance.co.za`).

## Running locally

No build step or dependencies — it's plain HTML/CSS/JS. Serve the folder with any static file server, for example:

```bash
python3 -m http.server 8080
```

or

```bash
npx serve .
```

Then open `http://localhost:8080/` in a browser.

Note: `index.html` contains a redirect script that fires when the URL path ends in `/index.html`, sending the browser to `/`. Use the bare `/` URL, not `/index.html`, when testing locally.

## Structure

- `index.html` — the application form page
- `style.css` — styles
- `script.js` — loan option switching and form submission (via Formspree)
- `robots.txt` / `sitemap.xml` — SEO
