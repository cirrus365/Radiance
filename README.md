# radiance

`radiance` is a Hugo theme that makes a content website feel like an
Ubuntu desktop running GNOME 2: a compact top panel, application windows
with titlebars, a left-hand desktop with shortcuts, and utility-dialog
listings. The light appearance is inspired by Ubuntu Radiance and the
dark appearance by Ubuntu Ambiance — related GTK-era themes, not
reproductions of either. It is a website with desktop-inspired chrome,
not a desktop simulator.

## Documentation

The complete documentation is the **handbook** in
`exampleSite/content/docs/`, served by the demo site under `/docs/`:

1. [Getting started](exampleSite/content/docs/getting-started/index.md) —
   requirements, installation as a submodule or Hugo module, minimal
   config, first run.
2. [Appearance and colour schemes](exampleSite/content/docs/appearance/index.md) —
   the toggle, the shipped schemes, adding your own, contrast rules.
3. [Making it yours](exampleSite/content/docs/making-it-yours/index.md) —
   site name, navigation, icons, desktop shortcuts.
4. [Writing](exampleSite/content/docs/writing/index.md) — posts, page
   bundles, images, captions, tags, drafts.
5. [Photography](exampleSite/content/docs/photography/index.md) — image
   layouts, alt text, processing behaviour.
6. [Moodboards](exampleSite/content/docs/moodboards/index.md) — tile
   types, resource paths, worked examples.
7. [Customising](exampleSite/content/docs/customising/index.md) —
   template overrides, styles, icons.
8. [Publishing and maintenance](exampleSite/content/docs/publishing/index.md) —
   deployment, updates, breaking changes, troubleshooting.
9. [Reference](exampleSite/content/docs/reference/index.md) — generated
   tables for every configuration key, colour token, tile type and the
   contrast report.
10. [Who Radiance is for, and who it isn't](exampleSite/content/docs/who-radiance-is-for/index.md)
11. [Appendix: telling people about it](exampleSite/content/docs/appendix/index.md)

## The demo site

`exampleSite/` is a complete demo: posts, moodboards, the archive, tags,
search and the handbook. Build it with Hugo Extended 0.128.0 or newer:

```sh
hugo --source exampleSite --themesDir ../..
```

The command assumes the theme checkout directory is named `radiance`,
so that `../..` resolves from `exampleSite` to the directory containing
the theme.

## Repository facts

- Theme code is MIT licensed (see `LICENSE`).
- The example site's media has two distinct sets of terms:
  - the moodboard images and audio were generated programmatically by
    the theme's contributors (procedural gradients and a synthesised
    tone bed); they carry no third-party rights and may be redistributed
    with the example site;
  - the travel post's photographs are from [Unsplash](https://unsplash.com),
    credited to their photographers in each caption and used under the
    [Unsplash licence](https://unsplash.com/license).
- No external fonts, scripts, tracking or image services are used; fonts
  are local font stacks.
- `theme.toml` and the handbook installation instructions carry the
  placeholder `OWNER`; replace it with the real repository path before
  publishing.
- Engineering conventions live in `AGENTS.md`: colour schemes as data,
  the config schema, the tile registry, and the checks that keep them
  honest.
