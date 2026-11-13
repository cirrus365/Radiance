---
title: "Photography"
layout: "docs"
weight: 50
description: "Image layouts, processing behaviour and alt text."
---

## What the theme does with images

The theme processes images only in two places — moodboard image tiles
and social-card covers — and always with Hugo's built-in imaging, so
no external service is involved.

**Moodboard image tiles** receive three WebP variants (480, 800 and
1200 pixels wide) served through a `srcset`, with intrinsic dimensions,
lazy loading and asynchronous decoding. SVG files are never resized.

**Covers** (the `cover` front matter field on moodboards) are resized to
a 1200-pixel-wide JPEG for Open Graph and Twitter cards. An SVG cover is
passed through untouched.

## Gallery layouts

There is no gallery layout and no lightbox. Photography on moodboards
lives in the tile grid, which gives images an even, bordered frame and
lets them span two grid units (`span: 2x1` or `span: 2x2`). For a
photography post, plain Markdown images in a page bundle are the
expected pattern; the reading experience comes from the window's
measures and the restraint of the chrome.

## Alt text

Every image tile accepts an `alt` field. When it is missing the tile
falls back to its `title` and emits a build warning naming the board —
so a missing description cannot ship quietly. For post images, Markdown
alt text is passed through untouched: write descriptions that carry the
meaning of the picture, not its file name.

## Processing behaviour

Processing happens at build time and results are cached in
`resources/_gen`. Nothing is processed at request time and no images are
fetched from remote sources. To rebuild from scratch, delete the site's
`resources/` directory.
