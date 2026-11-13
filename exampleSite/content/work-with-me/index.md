---
title: "Work with me"
description: "A decision log for the radiance theme: what was built, what was cut, and what the site gained."
---

This page is a case study in the shape of a decision log — the record of
how radiance was designed and, just as importantly, what was removed
from it. It is **self-initiated work**: nobody commissioned this theme;
it exists because a desktop metaphor seemed worth building properly and
then worth cutting back honestly.

## The original concept

The first sketch was a desktop simulator: pages as windows that could be
minimised, maximised and closed; a bottom panel with a window list, four
workspaces and a trash; state kept in session storage so your windows
came back when you returned. It was fun to build and, for about a week,
fun to use.

## What was built, and why it was cut

The window manager was fully working: titlebar buttons wired to real
behaviour, a session window history, restoration links. And that was the
problem. Every mechanic was a second navigation system running beside
the web's own. Minimising a window hid content behind a 28-pixel panel
entry; maximising fought the browser's own full-screen; the window list
duplicated the back button; and the state in storage was one more thing
to break, explain and maintain. The controls also did nothing without
JavaScript, which broke the rule that core content and navigation must
work without it.

So the mechanics were cut in one commit. What replaced them was not a
weaker version — it was the platform:

- **Normal links and normal scrolling** for navigation, which already
  handle history, deep links and every input method;
- **The window stays as a visual language** — titlebar with icon and
  title, borders, bevels — with no behaviour attached;
- **The bottom panel removed entirely**, so nothing competes with a
  mobile browser's own bottom bar.

## What the site gained

Removing the window manager took the JavaScript bundle from around 7.7
KB to about 5.4 KB, deleted an entire stylesheet's worth of state
handling, and left no control on any page that does nothing. Every
remaining control — the appearance toggle, search, copy buttons —
requires JavaScript and stays hidden until that JavaScript has
initialised.

## Rejected directions

Several alternatives were considered and declined:

- **Keep minimise, drop the rest** — a half-metaphor is worse than none;
  a button that hides content is behaviour, not decoration.
- **Persist the window list across sessions** — persistence turns a
  gimmick into an obligation.
- **Rebuild menus with ARIA widgets** — the panel became ordinary
  navigation instead; native links need no script and no tutorial.
- **A third "system" appearance mode** — System, Radiance and Ambiance
  radio choices collapsed into a single toggle once schemes became data.

## The single-source-of-truth constraint

The rule that shaped most of the code: every fact lives in exactly one
file. Colours live in `data/schemes/`, site parameters and their
defaults in `data/schema.yaml`, tile types in `data/tiles.yaml` — and
the templates, the generated CSS and the reference appendix all read
from those files rather than restating them. When two files need the
same fact, one of them is generated. This is why changing one hex value
moves the site, the toggle, the documentation table and the contrast
report together.

## Evidence

Measured on the example site production build, raw minified bytes before
transfer compression. Values marked **—** are not yet measured; each row
names the command (or method) that produces it. Nothing here is
invented.

| Measure          | Value                                | How it is produced                                                      |
|------------------|--------------------------------------|-------------------------------------------------------------------------|
| Page weight      | ≈ 37.8 KB homepage (HTML + CSS + JS raw); ≈ 1.7 MB whole `public/` incl. media | `wc -c exampleSite/public/index.html exampleSite/public/css/*.css exampleSite/public/js/*.js`; `du -sh exampleSite/public` |
| CSS budget       | ≈ 23.8 KB minified (target: under 30 KB) | `wc -c exampleSite/public/css/*.min.*` (build without the dev server)   |
| JS budget        | ≈ 5.4 KB minified (target: under 8 KB)   | `wc -c exampleSite/public/js/radiance.js`                                |
| LCP, throttled   | — (not yet measured)                 | `npx lighthouse http://localhost:1313 --preset=perf --throttling-method=devtools` |
| JS-disabled operation | Passes: content, navigation, archive, tags and search listings all work; the toggle and live search degrade to the CSS scheme default and the full page list | Disable JavaScript in browser devtools and traverse the demo |
| Contrast ratios  | 20 of 20 documented pairs pass in both shipped schemes | `python3 scripts/contrast.py` (renders `data/generated/contrast.yaml`) |
| Documentation coverage | 11 of 11 handbook chapters build, chained by previous/next links | `hugo --source exampleSite --themesDir ../.. --panicOnWarning` and walk `/docs/` |

## The offer

If this way of working — decide honestly, cut cleanly, keep one source
of truth — matches something you want built, the theme itself is the
best introduction: install it, read the handbook, and see whether the
decisions hold up in your hands.
