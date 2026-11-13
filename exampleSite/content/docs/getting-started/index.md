---
title: "Getting started"
layout: "docs"
weight: 10
description: "Requirements, installation and first run."
---

## Requirements

- Hugo Extended, **0.128.0 or newer** (the `extended` build, for image
  processing and Sass-free Hugo Pipes).
- Git, for installation as a submodule or Hugo module.
- Nothing else. There is no npm, no bundler and no external scripts; the
  theme builds with Hugo alone.

## Installation as a Git submodule

From an existing Hugo site's repository root:

```sh
git submodule add https://github.com/OWNER/radiance themes/radiance
```

Then set the theme in the site configuration:

```toml
# hugo.toml
theme = "radiance"
```

## Installation as a Hugo module

```sh
hugo mod get github.com/OWNER/radiance
```

And in `hugo.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/OWNER/radiance"
```

With modules, do not set `theme`; the module import replaces it.

## Minimal configuration

A working site needs remarkably little:

```toml
title = "My site"
theme = "radiance"
defaultContentLanguage = "en-gb"
```

The language key doubles as the document language (`lang="en-gb"`); use
your own locale. Without a description parameter the meta description
falls back to page descriptions.

## First run

```sh
hugo server
```

Open <http://localhost:1313/>. With no content at all the site still
builds: the top panel shows only the site title, the search link (once a
search page exists) and the appearance toggle.

To explore a complete worked example, copy `exampleSite/` from the theme
checkout and run it:

```sh
hugo server --source exampleSite --themesDir ../..
```

The command assumes the theme checkout directory is named `radiance`, so
that `../..` resolves from `exampleSite` to the directory containing the
theme.
