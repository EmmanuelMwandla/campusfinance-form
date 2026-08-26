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
- `script.js` — loan option switching and form submission
- `apps-script/Code.gs` — free form backend (see below)
- `robots.txt` / `sitemap.xml` — SEO

## Form backend (Google Apps Script)

The form no longer uses Formspree. It POSTs to a free Google Apps Script Web
App that emails the application (fields + attached documents) to
`info@campusfinance.co.za`. To deploy it:

1. Go to [script.google.com](https://script.google.com) and create a new project.
2. Replace the default `Code.gs` contents with this repo's `apps-script/Code.gs`.
3. If applications should go to a different inbox, edit `RECIPIENT_EMAIL` at the top of the script.
4. Click **Deploy → New deployment**, choose type **Web app**, set **Execute as: Me** and **Who has access: Anyone**, then deploy. Authorize the requested permissions (it needs to send email on your behalf).
5. Copy the deployment's `/exec` URL and paste it into `FORM_ENDPOINT` near the top of `script.js` (replacing the `YOUR_DEPLOYMENT_ID` placeholder).
6. Whenever you edit `Code.gs`, create a **new deployment version** (Deploy → Manage deployments → Edit → New version) — saving alone does not update the live endpoint.

Notes:
- Free tier: consumer Gmail accounts can send up to 100 emails/day via `MailApp`, which is generous for this form's expected volume.
- Uploaded documents stay only in the email sent to `RECIPIENT_EMAIL`; nothing is stored on a third-party server.
- The hidden `_gotcha` field is a honeypot — if a bot fills it in, the script silently discards the submission instead of emailing it.
