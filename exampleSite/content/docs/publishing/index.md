---
title: "Publishing and maintenance"
layout: "docs"
weight: 80
description: "Deployment, updates, breaking changes, troubleshooting."
---

## Deployment

The theme emits a plain static site into `public/`; any static host
works. Two things keep it portable:

- all URLs are Hugo-generated or `relURL`-resolved, so the site deploys
  below a subpath unchanged;
- no remote assets are fetched at build time or run time, so the build
  is reproducible on CI.

### GitHub Pages

The theme's own repository deploys its demo (the example site) to GitHub
Pages with Actions. Two workflows ship in `.github/workflows/`:

- `ci.yml` — the guardrail checks, on every push and pull request;
- `pages.yml` — builds `exampleSite` with the theme from the same
  checkout and publishes it to Pages, on pushes to the default branch.

The checkout directory must be named `radiance` (the example site
resolves the theme through `themesDir` by that name, and Linux is
case-sensitive), and the public URL is passed with `--baseURL` in the
build step — the local `baseURL` in `exampleSite/hugo.toml` stays the
development address. Enable Pages once in the repository settings
(*Settings → Pages → Build and deployment → Source: GitHub Actions*).

## Updates

The theme is installed as a submodule or a Hugo module, so updates are
the ordinary Git operations for that choice:

```sh
# submodule
git submodule update --remote themes/radiance

# module
hugo mod get -u github.com/OWNER/radiance
```

Rebuild and read the release notes before deploying; the breaking-change
policy below tells you what to expect.

## Breaking changes

Changes to these are breaking and are called out in release notes:

- the key set of `data/schemes/*.yaml`;
- the schema in `data/schema.yaml` (removals or type changes);
- the tile registry in `data/tiles.yaml` (type or field removals);
- the site-parameter names the theme reads;
- the custom-property names generated from schemes.

Everything else — visual tuning, new optional fields, new glyphs — aims
to be additive.

## Troubleshooting

- **Build warns about scheme keys** — a scheme file's key set differs
  from the first scheme's; copy the missing keys across.
- **Build warns that a site param is not in the schema** — the theme
  only reads parameters listed in `data/schema.yaml`; add the parameter
  there or spell it correctly.
- **A tile is skipped with a warning** — the warning names the tiles
  file and, for missing fields, the field; fix the named field.
- **Contrast check fails** — the failing pair and scheme are printed;
  adjust the scheme values until the ratio passes.
- **Colours look wrong under a subpath** — check that `baseURL` matches
  the deployment path; the theme resolves its own assets with `relURL`.
