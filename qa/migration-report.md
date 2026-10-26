# Migration verification — 26 October 2026

Source: published version 7, commit 6b0391f276559811d5836153a44fa177b9feb9e2.
Migration prepared in a separate clone. Original checkout and live hosting unchanged.

## Executed checks

- SHA-256 comparison: all 26 original tracked files identical, including 11 images.
- Original integrity script passed; all 5 JavaScript files passed Node syntax checks.
- Local HTML and CSS asset references resolved.
- Original browser regression harness rerun against the copied production dist:
  46/46 assertions passed at 320, 390, 768, 1024 and 1440 CSS pixels.
- Checks cover layout/heading geometry against the original pre-typography baseline,
  overflow, settled text, runtime exceptions, room booking dialogs, room details,
  both enquiry forms and intercepted WhatsApp payloads, gallery, mobile menu,
  stay choice, atmosphere, concierge, discovery and reduced-motion/no-JS fallback.
- Additional lifecycle suite: 9/10 passed on two runs. Golden phrase restoration
  failed the fixed 3.6-second checkpoint; resize/readability and final cleanup
  passed. This is an observed pre-existing timing issue in unchanged source;
  no animation code was altered for migration.
- ZIP extracted into a fresh temporary directory: all 26 original hashes, local
  asset references and JavaScript syntax checks passed.
- Known credential-pattern scan passed; no secrets knowingly included.

## Build and dependencies

No dependency installation or compilation applies: dist contains production-ready
static files. There is no package manifest or lockfile in the original project.
Vercel configuration: Other, no install/build command, output dist. No Vercel
build/deployment has been run, and no production domain was modified.

## Preserved dependencies and limitations

Google Fonts remains an external dependency. Existing browser-local preferences
are origin-specific. The enquiry flow requires WhatsApp and hotel confirmation.
No real WhatsApp message was sent. Physical Android/iOS devices, Safari, Firefox,
real-device performance metrics, external Maps/telephone actions, and audible
sound output were not tested in this migration. No new source/visual changes were
made to address existing behavior. All original source and assets are included.

GitHub creation/upload is separate from local preparation; this report does not
claim a successful remote push. Check the final delivery status for that result.
