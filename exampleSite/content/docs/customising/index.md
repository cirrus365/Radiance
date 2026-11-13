---
title: "Customising"
layout: "docs"
weight: 70
description: "Template overrides, styles, icons."
---

## Template overrides

Every partial and layout can be overridden from the site: create the
same path under your site's `layouts/` directory and Hugo uses yours.
Common overrides:

- `layouts/partials/footer.html` — footer text;
- `layouts/partials/desktop-icons.html` — replace the data-driven
  shortcut column with your own markup;
- `layouts/_default/single.html` — wrap post bodies differently.

Partials that take parameters document them in a leading template
comment; keep to that contract when you override.

## Styles

The theme concatenates its stylesheets (including the generated scheme
CSS) and links them in `partials/head.html`. To add site-specific CSS
without touching the theme, override `head.html` and append your own
Hugo Pipes resources after the theme's links. Two rules from the theme
still apply to your styles:

- reference the scheme custom properties (`--surface-window`,
  `--text-primary`, …) instead of authoring colours, so your additions
  follow the active scheme;
- no hex colour literals: colours enter only through `data/schemes/`.

## Icons

The decorative glyphs live in one SVG sprite,
`layouts/partials/icon-sprite.html`, with the allowed identifiers in
`layouts/partials/glyph.html`. Override both to add your own symbols;
keep new glyphs decorative (`aria-hidden`, not focusable) and give
interactive controls accessible names of their own.

## What not to change

The scheme files are the theme's colour contract and
`data/tiles.yaml`/`data/schema.yaml` are its type contracts; overriding
the partials that read them is supported, but bypassing them (reading
`site.Params` directly, hardcoding colours) will drift from the theme
and lose the build guards.
