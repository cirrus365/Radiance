---
title: "Appearance and colour schemes"
layout: "docs"
weight: 20
description: "The toggle, the shipped schemes, adding your own, contrast rules."
---

## The toggle

The top panel carries one compact appearance control at its far right.
With two colour schemes installed it swaps between them; with three or
more it opens a small menu instead. The control is marked with
`aria-pressed` (two schemes) or opens a menu with the current scheme
marked, so the state never relies on the glyph alone.

With no stored choice the site follows the operating system through
`prefers-color-scheme`, including live changes. An explicit choice is
stored in `localStorage` under the single key `radiance-appearance` and
applied before first paint by the generated inline scheme-init script,
so there is no flash of the wrong scheme. If storage is blocked the
choice still applies to the current page. Nothing is sent to a server.

Without JavaScript the control never renders; the CSS fallbacks give the
light scheme as the default and the dark scheme under
`prefers-color-scheme: dark`.

## The shipped schemes

Two schemes ship with the theme, one file each under `data/schemes/`:

- `radiance.yaml` — the light default, inspired by Ubuntu Radiance.
- `ambiance.yaml` — the dark companion, inspired by Ubuntu Ambiance.

Nothing else in the theme defines a colour. A generated stylesheet
(partials/schemes-css.html) turns the scheme files into custom
properties — `surfaces.panel_raised` becomes `--surface-panel-raised`,
`metrics.panel_height` becomes `--metric-panel-height` — and the
component stylesheets reference only those properties. The complete
token list with each scheme's values is in the
[reference appendix]({{< relref "/docs/reference" >}}).

## Adding your own scheme

Copy an existing scheme file, rename it (the file name becomes the
`data-theme` value, so use `a-z` and dashes) and change the values. Keep
the key set identical to the other schemes: the build warns — fatally
under `--panicOnWarning` — when schemes diverge. From three schemes on,
the panel control automatically becomes a menu listing every scheme's
`label`.

## Contrast rules

`scripts/contrast.py` is dependency-free Python. It reads
`data/schemes/*.yaml`, computes WCAG contrast ratios for the documented
pairs and writes `data/generated/contrast.yaml`, which the reference
appendix renders. Body text must reach **4.5:1**; focus rings **3:1**.
The script exits non-zero on a failure, so a bad colour combination
cannot ship quietly. The chrome border is deliberately excluded from
the checked pairs: it is the pale window edge of the reference
photograph, decorative rather than a control boundary — control
boundaries use the derived `--control-border` instead, which keeps 3:1
in both shipped schemes.

A few derived colours — control borders, tile borders, bevels — are
formulas over the scheme values (for example, control borders are a
52% mix of `text.primary` over `surfaces.window`). Those percentages are
design values, chosen so the result keeps 3:1 non-text contrast in both
shipped schemes; the ratios table covers the scheme values themselves.

Changing one hex value in a scheme file moves the site, the toggle and
the contrast report together, with no other file touched.
