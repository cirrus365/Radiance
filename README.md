# radiance

A Hugo theme that makes a content website feel like an Ubuntu desktop
running GNOME 2. The default light appearance is inspired by Ubuntu
Radiance; an Ambiance-inspired dark appearance is planned.

This is a website with desktop-inspired chrome, not a desktop simulator.

## Prerequisites

- Hugo Extended, 0.128.0 or newer.

## Building the example site

The repository includes an example site for development:

```sh
hugo --source exampleSite --themesDir ../..
```

This command assumes the theme checkout directory is named `radiance`, so
that `../..` resolves from `exampleSite` to the directory containing the
theme. The build output is written to `exampleSite/public`.

## Installing the theme

As a Hugo module, from an existing Hugo site:

```sh
hugo mod get github.com/OWNER/radiance
```

As a Git submodule:

```sh
git submodule add https://github.com/OWNER/radiance themes/radiance
```

Then set `theme = "radiance"` in the site configuration. In both commands,
replace the placeholder `OWNER` with the final repository path once the
theme is published; the same placeholder appears in `theme.toml`.

## Layout vocabulary

- **Top panel**: application menus and applets.
- **Bottom panel**: window list, workspace links and an optional Trash link.
- **Desktop**: the background and the left-hand shortcut column.
- **Window**: a titled region containing page content.
- **Dialog**: a desktop-styled listing panel; not a modal unless explicitly
  implemented as one.

## Moodboard content model

A moodboard is a page bundle under `content/moodboards/`. The section page
(`_index.md`) uses `layout: moodboard-list`; each board's `index.md` uses
`layout: moodboard`.

### Board front matter

| Field         | Type          | Required | Purpose                                                        |
|---------------|---------------|----------|----------------------------------------------------------------|
| `title`       | string        | yes      | Window title and list entry.                                   |
| `description` | string        | no       | Concise preview in the moodboards list.                        |
| `date`        | date          | no       | Page metadata.                                                 |
| `weight`      | integer       | no       | Ordering in the moodboards list.                               |
| `tiles`       | string        | no       | Page-resource filename holding the tile list; default `tiles.yaml`. |
| `palette`     | list of hex   | no       | Validated hex colours, appended to the grid as a palette tile. |
| `cover`       | string        | no       | Page-resource filename, shown as the preview in the list.      |
| `draft`       | boolean       | no       | Standard Hugo draft handling.                                  |

The tile list is read from the board's own bundle resource — not from
global site data — so boards are self-contained. The resource contains a
YAML **list** of tiles (not a map).

### Tile schema

Every tile is validated by the theme; invalid tiles are skipped with a
build warning naming the board. All tiles accept:

| Field   | Type   | Required | Values                                             |
|---------|--------|----------|----------------------------------------------------|
| `type`  | string | yes      | `image`, `note`, `palette`, `link`, `audio`, `quote` |
| `span`  | string | no       | `1x1` (default), `2x1` or `2x2`                    |
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

### Creating a board

The theme ships a bundle archetype:

```sh
hugo new --kind moodboards content/moodboards/my-board
```

This creates the bundle `content/moodboards/my-board/` containing
`index.md` (board front matter and notes), `tiles.yaml` (starter tile
list) and `images/placeholder.png`. Add images and audio to the folder and
reference them from `tiles.yaml`. An archetype only scaffolds these files;
populate the board yourself.

Two Hugo conventions matter here: the archetype lives in a directory
named `archetypes/moodboards.md` (the `.md` suffix is part of the
directory name, matching how Hugo resolves `--kind` archetypes), and the
target path is the bundle directory itself — Hugo appends the archetype's
own `index.md`.

### Example assets

All example images and the audio file were generated programmatically by
the theme's contributors (procedural gradients and a synthesised tone
bed). They carry no third-party rights and may be redistributed with the
example site.

## Listing pages

The archive (`/archive/`), search (`/search/`) and taxonomy pages render
through dialog-styled layouts (`layouts/_default/archive.html`,
`search.html` and `terms.html`, sharing `partials/dialog.html`). Pages
flagged `utility: true` in their front matter are excluded from the
archive and search listings and from the JSON search index; drafts are
always excluded. The search index is generated through a custom `search`
output format on the home page (`index.json`).

## Development notes

- All authored colour values live in `assets/css/tokens.css`; other
  stylesheets reference the custom properties defined there.
- JavaScript lives under `assets/js` and is bundled with Hugo's `js.Build`.
- See `AGENTS.md` for the full engineering rules and conventions.
