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

The demo repository deploys to GitHub Pages with Actions. The shape of
that workflow is: check out the repository (with submodules), install
Hugo Extended, run
`hugo --source exampleSite --themesDir ../..` and publish
`exampleSite/public` as the artifact. A complete guardrail workflow
ships with the theme in `.github/workflows/`; it also fails the build on
the checks listed in the reference appendix's maintenance notes.

For a project-pages deployment, set `baseURL` to the repository URL
(including any subpath) in the build step, or leave the local value and
pass `--baseURL` on the command line.

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
