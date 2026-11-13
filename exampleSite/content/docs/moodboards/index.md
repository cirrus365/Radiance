---
title: "Moodboards"
layout: "docs"
weight: 60
description: "Tile types, resource paths, complete working examples."
---

## Creating a board

A moodboard is a page bundle under `content/moodboards/`. Scaffold one:

```sh
hugo new --kind moodboards content/moodboards/my-board
```

This creates `index.md`, `tiles.yaml` and `images/placeholder.png`. The
section page uses `layout: moodboard-list`; each board's `index.md`
uses `layout: moodboard`.

## Board front matter

| Field         | Required | Purpose                                                             |
|---------------|----------|---------------------------------------------------------------------|
| `title`       | yes      | Window title and list entry.                                        |
| `description` | no       | Concise preview in the list; also the social summary.               |
| `date`        | no       | Page metadata; used by the archive and search.                      |
| `weight`      | no       | Ordering in the moodboards list.                                    |
| `tiles`       | no       | Resource filename holding the tile list; default `tiles.yaml`.      |
| `palette`     | no       | List of validated hex colours, appended as a palette tile.          |
| `cover`       | no       | Resource filename; list preview and social card image.              |

## Tiles

The tile list is the board's own bundle resource — never global site
data — and is a YAML list. Every tile has a `type`, an optional `span`
(`1x1` default, `2x1` or `2x2`) and type-specific fields. The complete
type table lives in the theme's `data/tiles.yaml` and is rendered in the
[reference appendix]({{< relref "/docs/reference" >}}); in brief:

- `image` — `src` (a bundle resource) and optional `alt`/`title`;
- `note` — `body`, optional `title`;
- `palette` — `colours`, a list of validated hex values;
- `link` — `title` and `href` (site-absolute, subpath-safe, or external);
- `audio` — `src` and `title`, rendered with native controls;
- `quote` — `text`, optional `attribution`.

Resource paths are relative to the board bundle. Invalid tiles — an
unknown type or a missing required field — are skipped with build
warnings that name the tiles file and the missing field.

## Complete examples

The demo site ships three boards: **Dusk study** (images and notes with
spans), **Reading room** (a palette front matter and a non-default tiles
filename) and **Workshop** (an audio tile with a caption). Read their
`tiles.yaml` files next to the rendered pages; they are the reference
implementations.
