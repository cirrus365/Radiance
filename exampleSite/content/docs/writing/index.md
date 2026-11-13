---
title: "Writing"
layout: "docs"
weight: 40
description: "Posts, page bundles, images, captions, tags, drafts."
---

## Posts

Ordinary Markdown pages render in a window with the title, the date,
taxonomy links and the body:

```markdown
---
title: "My first post"
date: 2026-01-17
description: "A one-line summary used in listings and social cards."
tags: ["journal"]
categories: ["general"]
---

Your text here.
```

`description` is optional but recommended: listings and the Open Graph
fallback use it, falling back to a truncated plain-text summary.

## Images and captions

The theme adds no shortcodes; posts are plain Markdown. Reference
images the ordinary way:

```markdown
![Descriptive alternative text](image.jpg)

*Caption text in italics beneath the image.*
```

Put images next to the post as a [page bundle](https://gohugo.io/content-management/page-bundles/)
(`my-post/index.md` and `my-post/image.jpg`) so they travel with the
post. Markdown alt text is carried through untouched.

## Sections, archive and taxonomies

The archive (a page with `layout: archive`) lists every regular page
grouped by year. Pages flagged `utility: true` in their front matter are
excluded from the archive and from search — use the flag for about,
search and similar chrome pages. Tag and category term pages render as
desktop-style dialogs; both taxonomies work out of the box.

## Search

Search is one content page plus one configuration line:

```markdown
<!-- content/search/index.md -->
---
title: "Search"
layout: "search"
utility: true
---
```

```toml
# hugo.toml
[outputFormats]
  [outputFormats.search]
    mediaType = "application/json"

[outputs]
  home = ["HTML", "RSS", "search"]
```

The home page then emits `index.json`; without JavaScript the page shows
every page as a list, with JavaScript it filters as you type. When the
page exists the panel shows its search link automatically.

## Drafts

Set `draft: true` to keep a page out of every listing, search index and
the archive; `hugo server` shows drafts, production builds do not.
