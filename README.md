# Hotel DelaCruxe

Complete original Hotel DelaCruxe website, exported from published version 7.
Source commit: `6b0391f276559811d5836153a44fa177b9feb9e2`.
The migration preserves all original project files byte for byte. No redesign,
content edits, asset substitutions, or live deployment are part of this export.

## Stack and structure

- Static HTML, CSS and browser JavaScript; no framework, package manager or build step.
- `dist/`: complete deployable website (index, five CSS and five JavaScript files).
- `dist/assets/`: all 11 original image files, including historical logo variants.
- `qa/`: original typography audit and regression harness, plus migration checks.
- `.openai/hosting.json`: preserved original Sites project metadata, not a secret.
- `vercel.json`: static deployment configuration, with `dist` as output directory.

The browser uses native dialogs, CSS, IntersectionObserver and the Web Animations
API. Typography loads Cormorant Garamond and Manrope from Google Fonts with local
fallback stacks. This external font dependency is preserved; font binaries are
not bundled. There are no third-party animation packages to install. Page navigation uses fragment anchors,
so no SPA rewrite is required.

## Run locally

From the repository root:

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000. Serve over HTTP rather than opening index.html as a file.
No dependencies, environment variables, API keys, or `.env` file are required.
Accordingly no empty package manifest, lockfile, or environment template is added.

## Verify

Python 3 and Node.js are needed for verification only, not production hosting:

```sh
python3 qa/verify-migration.py
```

This checks SHA-256 hashes of all 26 original files, HTML/CSS local references and
JavaScript syntax. It does not assert external service availability or browser UX.
The original `qa/check-integrity.py` compares against an earlier Git commit and
requires the original history; it cannot run from a ZIP-only checkout.
`qa/typography-audit.md` records prior typography QA, not a new migration test run.
The original browser regression harness is retained unchanged.

## Deploy separately to Vercel

Import this GitHub repository. Set root directory to the repository root:

| Setting | Value |
| --- | --- |
| Framework preset | Other |
| Install command | Empty / disabled |
| Build command | Empty / disabled |
| Output directory | dist |
| Environment variables | None |

`vercel.json` supplies the static output settings. Do not select a Node framework.
Deployment is a separate action: this migration does not change the existing live
website or its DNS. The canonical URL remains the original site intentionally;
update it only after approving a final domain cutover.

## Preserved behavior and limits

Room selection, modal and inline enquiry forms, validation, WhatsApp-prefilled
messages, mobile menu, gallery dialogs, concierge, atmosphere and sound controls,
and all existing motion scripts remain unchanged. WhatsApp handoff is an enquiry,
not guaranteed availability, payment processing, or a confirmed reservation.
Local browser preferences are stored per origin and will not automatically move
from the old domain to a new one. No server database is present in this project.
Images are preserved as supplied by the hotel; no new redistribution license is
asserted. The owner selected a public GitHub repository for this migration.

## Android upload fallback

The easiest path is to create a private GitHub repository named `hotel-delacruxe`,
initialize it with a README, and give the repository access to the connected
GitHub integration. Then the migration can be uploaded directly.

For a manual upload, download and extract the ZIP with the Android Files app.
In Chrome, enable Desktop site on GitHub. Create the private repository with a
README. Use Add file > Upload files for the root README, .gitignore and vercel.json.
Preserve folders: create `dist/.keep`, `dist/assets/.keep`, `qa/.keep` and
`.openai/.keep` using Add file > Create new file, then navigate into each folder
and use Upload files to select that folder's extracted files. Commit each batch
to main. Replace the starter README with this README. Do not upload only the ZIP:
GitHub and Vercel need the extracted project files. Enable Show hidden files in
the file picker for .gitignore and .openai. Verify that index.html is under dist
and all 11 images are under dist/assets. Temporary .keep files can be retained.
