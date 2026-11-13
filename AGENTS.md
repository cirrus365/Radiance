# AGENTS.md — radiance

Instructions for agents working in this repository.

## 1. Project overview

`radiance` is a Hugo theme that makes a content website feel like an Ubuntu
desktop running GNOME 2.

- The default light appearance is inspired by Ubuntu Radiance.
- An Ambiance-inspired dark appearance is planned for later.

This is a website with desktop-inspired chrome, not a desktop simulator.
Build content pages that sit inside desktop-style panels, windows and dialogs.

## 2. Visual reference

Use the supplied screenshot as the primary reference:

- Pale, compact top and bottom panels.
- A purple, aubergine and orange desktop background.
- Light application windows with fine borders and compact titlebars.
- Desktop shortcuts arranged in a column on the left.
- Small icons, restrained bevels, and dense but readable layouts.
- Dialogs resembling GNOME 2 utility windows.

Radiance (light) is the default design; Ambiance (dark) is added later.

Avoid: glassmorphism, neon, large rounded cards, oversized typography, heavy
shadows, macOS traffic-light controls and generic dashboard styling.

## 3. Technology and compatibility

- Hugo Extended, minimum version 0.128.0.
- This repository is a Hugo theme, not a standalone Hugo site.
- An `exampleSite` is included for development.
- The theme must support installation as a Git submodule and as a Hugo module.
- Use Hugo templates and Hugo Pipes.
- No npm, frontend frameworks, external scripts, CDN assets or JavaScript
  package dependencies.
- Write JavaScript under `assets/js`. Bundle application modules with Hugo's
  `js.Build`.
- Keep CSS under `assets/css`. Concatenate and minify it with Hugo Pipes.
- Use only APIs supported by Hugo 0.128.0.
- Do not use `_internal` templates, `.Site.Author` or `.Site.IsMultiLingual`.

## 4. Engineering rules

- All authored colour values live in `assets/css/tokens.css`. Other
  stylesheets reference the custom properties defined there.
- Exception: validated palette colours supplied by content authors may be
  rendered as inline CSS custom properties.
- Never place unvalidated content in a `style` attribute or in a dynamically
  constructed class name.
- No inline scripts. Controls that require JavaScript stay hidden until the
  relevant external JavaScript has initialised them.
- Core content and navigation must work without JavaScript.
- Every interactive control has an accessible name and is operable with a
  keyboard.
- Use British English in documentation and example UI copy.
- Use Hugo-generated or correctly resolved URLs so that deployment below a
  subpath works.
- Do not fetch remote assets during a build.
- Do not silently change the public content schema or add dependencies.

## 5. Layout vocabulary

- **Top panel**: site navigation (site title, primary links, search and
  appearance toggle).
- **Desktop**: the background and the left-hand shortcut column.
- **Window**: a titled region containing page content.
- **Dialog**: a desktop-styled listing panel. It is not a modal unless
  explicitly implemented as one.

## 6. File conventions

- Name partials for what they render: `panel-top.html`, `window.html`,
  `desktop-icons.html` and `tile.html`.
- A partial that receives parameters takes a single dictionary, and documents
  its keys in a leading template comment.
- Place tile-type partials under `layouts/partials/tiles/`.
- Keep example content and media self-contained.

## 7. Definition of done

For every change:

1. Build the example site with Hugo Extended:

   ```sh
   hugo --source exampleSite --themesDir ../..
   ```

   This command assumes the theme checkout directory is named `radiance`
   (so that `../..` resolves from `exampleSite` to the directory containing
   the theme).

2. The build must complete without warnings for the supplied example content.
3. The change must be visible or testable in `exampleSite` without the user
   editing content.
4. Preserve working features from earlier steps.
5. Report the files changed, the checks performed and any checks not
   performed.

Do not create a commit unless explicitly asked.
