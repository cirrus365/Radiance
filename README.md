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

## Development notes

- All authored colour values live in `assets/css/tokens.css`; other
  stylesheets reference the custom properties defined there.
- JavaScript lives under `assets/js` and is bundled with Hugo's `js.Build`.
- See `AGENTS.md` for the full engineering rules and conventions.
