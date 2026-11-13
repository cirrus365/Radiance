---
title: "Getting started"
date: 2026-11-01
tags: ["gnome"]
description: "Install the radiance theme and build the example site."
---

## Prerequisites

radiance needs Hugo Extended 0.128.0 or newer. Check the installed version:

```text
hugo version
```

## Build the example site

The theme repository ships an example site:

```text
hugo --source exampleSite --themesDir ../..
```

The command assumes the theme checkout directory is named `radiance`, so
that `../..` resolves from `exampleSite` to the directory containing the
theme.

## Next steps

- Read the other sample post listed under *Posts*.
- Adjust the colours in `data/schemes/radiance.yaml`.
