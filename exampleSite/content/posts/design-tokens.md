---
title: "Design tokens"
date: 2026-11-08
tags: ["colour", "gnome"]
description: "How radiance keeps its colours in one place."
---

All authored colour values in radiance live in `assets/css/tokens.css`.
Every other stylesheet refers to the custom properties defined there, for
example:

```css
a {
  color: var(--radiance-accent);
}
```

## Starting palette

The starting palette takes its cues from Ubuntu's Radiance theme:

- Pale panels with fine borders.
- A deep aubergine desktop with purple and orange highlights.
- An orange accent for links and selection.

These are starting values, not a guarantee of accessible contrast; adjust
them when a combination needs improvement.

## Dark appearance

An Ambiance-inspired dark appearance is planned for a later release.
