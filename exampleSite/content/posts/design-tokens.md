---
title: "Design tokens"
date: 2026-11-08
tags: ["colour", "gnome"]
description: "How radiance keeps its colours in one place."
---

All authored colour values in radiance live in the scheme files under
`data/schemes/` — one YAML file per scheme. A generated stylesheet turns
the scheme data into custom properties; every other stylesheet refers to
those properties, for example:

```css
a {
  color: var(--accent-link);
}
```

## Starting palette

The starting palette takes its cues from Ubuntu's Radiance theme:

- Dark compact panels with fine borders.
- A deep aubergine desktop with a warm orange glow.
- An orange focus accent and a darker orange for links.

These are starting values, not a guarantee of accessible contrast;
`scripts/contrast.py` checks the documented pairs and fails when body
text drops below 4.5:1 or focus rings below 3:1.

## Dark appearance

The Ambiance dark appearance ships alongside the light one: pick it with
the toggle in the top panel, or let the operating system decide. Both
schemes are built from the same data files and share one set of component
styles.
