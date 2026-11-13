---
title: "Making it yours"
layout: "docs"
weight: 30
description: "Site name, navigation, icons, desktop shortcuts."
---

## Site name

Set `title` in `hugo.toml`. It appears as the panel title (linking
home), in window and dialog text, in the footer and in feed metadata.

## Navigation

The panel reads one primary menu, `main`:

```toml
[[menus.main]]
  name = "Posts"
  pageRef = "/posts"
  weight = 10
```

Entries render left to right by `weight`, and only when the menu has
entries — a site with no menu renders none. The current section is
marked with `aria-current`. One entry parameter is supported:

| Entry key (params) | Purpose                                                            |
|--------------------|--------------------------------------------------------------------|
| `feed`             | Links the entry to the home page's RSS output instead of its URL.  |

A search link renders automatically at the panel's right edge when a
page named `search` exists (see the writing chapter); the appearance
toggle sits at the far right. The panel stays one row at every width.

Section names are not hardcoded anywhere: labels come from your menu
entries.

## Desktop shortcuts

The left-hand desktop column is data, in `data/desktop.yaml`, sorted by
`weight`:

```yaml
- label: "Archive"
  href: "/archive/"
  icon: "folder"
  weight: 10
```

`href` is a site-absolute path (resolved with `relURL`, so deployments
below a subpath work) or an absolute external URL. `icon` is optional:
`computer`, `home` or `trash` draw a glyph; anything else renders
without one. Delete the file (or the entries) and the column disappears.

## Icons

Decorative glyphs come from one SVG sprite. The supported identifiers
are listed in the reference appendix. The `appearance` glyph is used by
the panel toggle; the rest are available to desktop shortcuts, dialogs
and windows.

## Footer

The footer renders the year, the site title and a link to Hugo. Override
`layouts/partials/footer.html` to change it (see the customising
chapter).
