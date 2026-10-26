# DelaCruxe typography upgrade — audit

Baseline: commit 807a3c294369ce7d9ca04368891634824505421a, Git tag typography-before-2026-10-25. Existing public version 6 remains live. This change is save-only.

## Existing architecture
Single document, hash-anchor navigation, native dialogs; buildless static HTML/CSS/JS in dist. No framework, router, hydration, third-party animation library, package installation or compilation. Base app handles navigation, gallery and two enquiry forms. Experience script adds arrival, tour, stay chooser, room explorer, weekly editorial and concierge. Refinements handles form synchronization and interaction fixes. Motion script handles ambient photography, image transitions and pointer effects.

CSS breakpoints: 370px, 700px, 1000px, 1500px; tablet range 701–1000px. System reduced-motion styles are already present. Fonts, scale, spacing and image files are retained. Hero image has high fetch priority; secondary photographs retain lazy loading.

## Conflicts resolved
The previous character splitting / kinetic observer affected most h2s and duplicated proposed reveals. Replaced only that typography block. Existing hero wrappers remain with identical dimensions, but the previous CSS transition yields to the shared finite Web Animations controller. Text-containing reveal parents are neutralized selectively to avoid simultaneously translating the same heading twice. Images, cards, galleries and dialogs retain existing motion. Tour and stay-choice text transitions now delegate through events to the shared controller.

## Animation map
- Masked rise: existing two hero headline groups, 44px, 1080ms, 170ms stagger. Existing line wrappers permit natural mobile wrapping without measuring or splitting characters.
- Bloom: intro heading and description; stay-designer, weekly and location headings; bar description; garden supporting text; selected tour and recommendation text. 920ms default, 6px blur desktop / 3px mobile, 18px / 12px offset.
- Gold: existing gold phrases “Better evenings.” and “Nowhere else to be.” on dark sections only. 2100ms, once, starts after the heading reveal; original palette restored on completion/cancellation.
- Curtain: rooms, bar/lounge, gallery, booking and garden headings. 1120ms, left-to-right, negative block clipping allowance for italics and descenders.

## Implementation
Added typography.js and typography.css; minimal hooks in index.html, experience.js and motion.js. No dependencies or assets added. Shared registration accepts delay, duration, easing, threshold, stagger and optional replay. Effects default to one-shot; dynamic user selections may reveal again. Two shared intersection observers, no added scroll handler. Finite animations cancel and release references when settled, resized, hidden, paused, destroyed or leaving the page. Native text is always the default; failure to load the new script leaves it visible. Motion-off and OS preference prevent new typography effects.

## Boundaries
No branding, logo, written hotel content, room details, prices, contact data, media or SEO metadata intentionally changed. No live publication. Existing booking is an enquiry, not a confirmed reservation. Testing must not send a real WhatsApp message.

## Reliability correction found during QA
Two scroll-through checks found a heading at opacity zero when its frame's animation timeline was throttled. Added a bounded timer to settle each typography effect after its duration and delay, independent of animation timeline completion. Timers clear on cancellation, completion and destruction. Retested first arrival, all four effects, one-shot gold, resize and cleanup: 10/10 lifecycle checks passed.

## Verification method and limits
Browser QA uses the real static production HTML/CSS/JS (there is no separate development compilation). A temporary same-origin harness compares the original commit and upgraded output at 320, 390, 768, 1024 and 1440 CSS pixels in Chromium iframe viewports. It instruments animations and errors and intercepts window.open for form payload checks. No real enquiry is sent. Reduced-motion JavaScript is tested with a matchMedia stub; this does not substitute for OS-level CSS emulation or physical-device testing. No-JavaScript readability is tested in a sandboxed frame. Physical iPhone/Android, Safari/Firefox, assistive technology, actual WhatsApp app handoff, audible sound output, real mobile Core Web Vitals and network-throttled performance are not measured. Existing media/loading behavior remains unchanged.

## Final results
- Final responsive/functional suite: 46/46 passed after the watchdog fix. Separate lifecycle suite: 10/10 passed.
- At each of 320, 390, 768, 1024, 1440 CSS pixels: section top/height and heading width/height match baseline; no document horizontal overflow; text settles; zero captured site runtime exceptions; direct room booking opens without scrolling and closes.
- Passed: room-detail tabs, selected-room transfer, WhatsApp payload (intercepted), synchronized lower form/payload, gallery open, mobile menu/link close, stay chooser, atmosphere, concierge, discovery note, motion off, stubbed reduced-motion branch, no-JS headings, hero timing.
- Lifecycle: fresh arrival/skip, hero after intro, curtain/gold/bloom activation, gold restoration/no replay, resize readability/no overflow, controller cleanup.
- Static integrity and node --check pass; git diff --check clean. Actual dist output tested; no build step needed.
- Desktop, phone and tablet screenshots inspected. Console sample contains browser-extension metadata errors; site error instrumentation reports none.
- New typography files: 7,355 bytes raw; 2,650 bytes gzip combined. No added dependencies or assets.
- No remaining failure observed in executed checks. Device/browser/performance limits above remain open verification items.

## Reproducing QA
Temporarily copy qa/typography-regression.html into dist and reconstruct dist/_qa-baseline from the baseline Git commit's dist files. Serve dist and use Run regression suite, then Check motion lifecycle. Keep the temporary harness and baseline out of deployment archives. The harness intercepts WhatsApp windows; no messages are sent.
