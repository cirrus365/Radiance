# radiance

`radiance` is a Hugo theme that makes a content website feel like an
Ubuntu desktop running GNOME 2: pale compact panels, application windows
with titlebars, a left-hand desktop with shortcuts, and utility-dialog
listings. The light appearance is inspired by Ubuntu Radiance and the dark
appearance by Ubuntu Ambiance — related GTK-era themes, not reproductions
of either. It is a website with desktop-inspired chrome, not a desktop
simulator.

## Previewing the theme locally

From a checkout of this repository:

```sh
hugo --source exampleSite --themesDir ../..
hugo server --source exampleSite --themesDir ../..
```

Both commands assume the theme checkout directory is named `radiance`, so
that `../..` resolves from `exampleSite` to the directory containing the
theme (on case-sensitive filesystems the directory name matters). The
build writes `exampleSite/public`; the server serves the site on
`http://localhost:1313/`.

## Prerequisites

- Hugo Extended, **0.128.0 or newer**. The theme uses Hugo templates,
  Hugo Pipes (`resources.Concat`, `minify`, `js.Build`, `transform`),
  page bundles and custom output formats available in that version. No
  npm, frontend frameworks, external scripts, CDN assets or JavaScript
  package dependencies are used.

## Installation

### As a Git submodule

From an existing Hugo site:

```sh
git submodule add https://github.com/OWNER/radiance themes/radiance
```

Then set `theme = "radiance"` in the site configuration.

### As a Hugo module

From an existing Hugo site:

```sh
hugo mod get github.com/OWNER/radiance
```

> **Placeholder:** the final repository path is not yet known.
> `OWNER` appears here and in `theme.toml`; replace it with the real
> repository path (for example `github.com/yourname/radiance`) everywhere
> before publishing. To verify the theme's module structure locally before
> publication, a site can import the theme through a module replacement:
>
> ```toml
> [module]
>   replacements = "github.com/OWNER/radiance:/absolute/path/to/radiance"
>   [[module.imports]]
>     path = "github.com/OWNER/radiance"
> ```

## Example site

The `exampleSite/` directory contains a complete example: posts, moodboard
boards, the archive, tags, search and appearance settings.

```sh
hugo --source exampleSite --themesDir ../..
```

Assumes the checkout directory is named `radiance` (see above).

## Site configuration the theme reads

| Parameter              | Purpose                                                                  |
|------------------------|--------------------------------------------------------------------------|
| `title`                | Panel title, window and dialog text, footer, feed metadata.              |
| `params.description`   | `<meta name="description">` and Open Graph fallback.                     |
| `params.workspaces`    | Up to four bottom-panel workspace entries (`label`, `pageRef`).          |
| `params.trash`         | Optional bottom-panel Trash link (`label`, `pageRef`).                   |
| `defaultContentLanguage` | Doubles as the document language; use the language key (e.g. `en-gb`). |

The example site also configures a custom `search` output format on the
home page, which generates `index.json` for live search.

### Data files (site data)

`data/applets.yaml` — top-panel applets, sorted by `weight`:

| Type    | Keys                                             |
|---------|--------------------------------------------------|
| `clock` | none; build-time fallback, updated by JavaScript  |
| `link`  | `label` (visible text and accessible name), `url` |
| `meter` | `label`, `value` (compact text readout)           |

`data/desktop.yaml` — desktop shortcuts, sorted by `weight`:

| Key      | Purpose                                                            |
|----------|--------------------------------------------------------------------|
| `label`  | Visible text and accessible name.                                   |
| `href`   | Site-absolute path (resolved with `relURL`, subpath-safe) or external URL. |
| `icon`   | `computer`, `home` or `trash`; anything else renders without a glyph. |
| `weight` | Optional sort order.                                                |

### Menus

The top panel reads three named menus: `applications`, `places` and
`system`. A menu button renders only when its menu has entries. Below
1024px the three menus are replaced by one combined menu containing every
entry. Menu entries support:

| Entry key (params) | Purpose                                                       |
|--------------------|---------------------------------------------------------------|
| `glyph`            | Decorative icon: `computer`, `close`, `document`, `feed`, `folder`, `home`, `info`, `maximise`, `minimise` or `trash`. |
| `feed`             | Links the entry to the home page's RSS output instead of its URL. |

## Content models

### Moodboards

A moodboard is a page bundle under `content/moodboards/`. The section page
(`_index.md`) uses `layout: moodboard-list`; each board's `index.md` uses
`layout: moodboard`. Board front matter:

| Field         | Type          | Required | Purpose                                                          |
|---------------|---------------|----------|------------------------------------------------------------------|
| `title`       | string        | yes      | Window title and list entry.                                     |
| `description` | string        | no       | Concise preview in the moodboards list; also the social summary. |
| `date`        | date          | no       | Page metadata; also used by archive and search.                  |
| `weight`      | integer       | no       | Ordering in the moodboards list.                                 |
| `tiles`       | string        | no       | Page-resource filename holding the tile list; default `tiles.yaml`. |
| `palette`     | list of hex   | no       | Validated hex colours, appended to the grid as a palette tile.   |
| `cover`       | string        | no       | Page-resource filename; list preview and social card image.      |
| `draft`       | boolean       | no       | Standard Hugo draft handling.                                    |

The tile list is read from the board's own bundle resource (never global
site data) and is a YAML **list** of tiles:

| Field   | Type   | Required | Values                                              |
|---------|--------|----------|-----------------------------------------------------|
| `type`  | string | yes      | `image`, `note`, `palette`, `link`, `audio`, `quote` |
| `span`  | string | no       | `1x1` (default), `2x1` or `2x2`                     |
| `title` | string | per type | Caption or heading; required for `link` and `audio` |

Type-specific fields:

| Type      | Field         | Required | Notes                                                              |
|-----------|---------------|----------|--------------------------------------------------------------------|
| `image`   | `src`         | yes      | Page-bundle resource; rasters get WebP variants via `srcset`.      |
| `image`   | `alt`         | no       | Falls back to `title` (with a build warning) when absent.          |
| `note`    | `body`        | yes      | Plain text.                                                        |
| `palette` | `colours`     | yes      | List of validated hex values (`#rgb` or `#rrggbb`).                |
| `link`    | `href`        | yes      | Site-absolute path (subpath-safe) or external URL.                 |
| `link`    | `description` | no       | Short supporting text.                                             |
| `audio`   | `src`         | yes      | Page-bundle resource.                                              |
| `quote`   | `text`        | yes      | The quotation.                                                     |
| `quote`   | `attribution` | no       | Quoted source, rendered with `cite`.                               |

Invalid tiles are skipped with build warnings naming the board. New boards
can be scaffolded with the bundle archetype:

```sh
hugo new --kind moodboards content/moodboards/my-board
```

This creates `index.md`, `tiles.yaml` and `images/placeholder.png`. Hugo
resolves `--kind` archetypes from a directory named `archetypes/moodboards.md`
(the `.md` suffix is part of the directory name), and the target path is
the bundle directory itself.

### Posts

Ordinary pages (for example `content/posts/my-post.md`) with `title`,
`date`, optional `tags`/`categories`, and optional `description`. Posts
render in a window with the title, date, taxonomy links and body.

### Utility pages

Pages flagged `utility: true` in their front matter (about, archive,
search, trash in the example) are excluded from the archive and search
listings and from the JSON search index. Drafts are always excluded.

## How the desktop metaphor maps to site structure

- **Top panel** — site navigation: Applications, Places and System menus
  (site menus) on the left; applets (clock, link, meter) on the right.
- **Desktop** — the page background and the left-hand shortcut column
  (`data/desktop.yaml`).
- **Window** — every page's content, with titlebar and Minimise, Maximise
  and Close controls.
- **Dialog** — desktop-styled listing panels for the archive, tags and
  search; ordinary page regions, never modals.
- **Window list** — bottom panel; the current page plus up to six visited
  pages for the browser session (per tab, in `sessionStorage`).
- **Workspaces** — bottom-panel links to key sections.
- **Trash** — an optional bottom-panel link.

## Appearance

Three modes, selected from the System menu (System, Radiance (light),
Ambiance (dark)):

- **System** (default) follows the operating system through the
  `prefers-color-scheme` media query, including live changes, and works
  without JavaScript.
- **Radiance** and **Ambiance** override the system preference; the choice
  is stored in `localStorage` under `radiance-appearance` and applied
  before first paint by a small blocking script. Choosing System removes
  the stored override. If storage is blocked the choice still applies to
  the current page. Preferences are never sent to a server and no cookies
  are used.

Both appearances share one set of component styles; only the token values
in `assets/css/tokens.css` differ. Print output forces light, print-friendly
values regardless of the selection.

## JavaScript-disabled behaviour and accessibility

- Core content, menus (native `<details>`), window lists, workspaces and
  all listings work without JavaScript. JavaScript-only controls — the
  appearance selector, window titlebar controls, search field, palette
  copy buttons and window-list remove buttons — stay hidden until the
  script initialises them.
- The application script is external and deferred; a small external script
  applies a stored appearance before first paint. There are no inline
  scripts.
- A skip link targets the main content; every page has one `h1` and
  ordered headings; landmarks are named; all interactive controls have
  accessible names and are keyboard-operable.
- Text combinations are checked at 4.5:1 and non-text controls and focus
  indicators at 3:1 in both appearances (see `AGENTS.md` conventions).
  Non-colour cues mark the active window, selected shortcuts and current
  workspaces; search-result and window-list changes are announced through
  `aria-live` regions; `prefers-reduced-motion` is respected.

## Assets, licensing and contributing

- Theme code is MIT licensed (see `LICENSE`).
- All example images and audio in `exampleSite` were generated
  programmatically by the theme's contributors (procedural gradients and a
  synthesised tone bed); they carry no third-party rights and may be
  redistributed with the example site. The favicon is original theme
  artwork.
- No external fonts, scripts, tracking or image services are used; the
  favicon and all fonts are local (the font stacks prefer locally
  installed Ubuntu faces with system fallbacks).
- Contributions: keep all authored colour values in
  `assets/css/tokens.css`, document partial contracts in leading template
  comments, and verify changes with the example-site build. See
  `AGENTS.md` for the engineering conventions.

## Performance targets

Measured on the example site production build, sizes are the raw minified
bytes **before transfer compression**:

- Minified CSS: under **30 KB** — currently ≈ 22.7 KB.
- Minified JavaScript (both bundles combined): under **8 KB** — currently
  ≈ 7.7 KB.
- No render-blocking third-party requests: the only blocking request is
  the small local appearance script; fonts and icons are local.

## Development notes

- All authored colour values live in `assets/css/tokens.css`; other
  stylesheets reference the custom properties defined there.
- JavaScript lives under `assets/js` and is bundled with Hugo's `js.Build`.
- Verify changes with the example-site build (see *Previewing the theme
  locally*).
