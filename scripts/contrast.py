#!/usr/bin/env python3
"""Contrast report for the colour schemes in data/schemes.

Reads every data/schemes/*.yaml file, computes WCAG 2 contrast ratios for
the documented colour pairs and writes the results to
data/generated/contrast.yaml for the documentation to render. The ratio
table is never hand-written anywhere.

Documented pairs (per scheme):
  body_text      text.primary on surfaces.window      >= 4.5:1
  tile_text      text.primary on surfaces.tile        >= 4.5:1
  muted_text     text.muted on surfaces.window        >= 4.5:1
  panel_text     text.inverse on surfaces.panel       >= 4.5:1
  titlebar_text  text.inverse on chrome.titlebar      >= 4.5:1
  desktop_text   text.desktop on surfaces.desktop     >= 4.5:1
  selected_text  text.primary on accents.selection    >= 4.5:1
  link_text      accents.link on surfaces.window      >= 4.5:1
  focus_window   accents.focus on surfaces.window     >= 3:1
  focus_panel    accents.focus on surfaces.panel      >= 3:1

The chrome border is decorative (it is the pale window edge of the
reference photograph) and is not a checked pair; control boundaries use
the derived --control-border, a formula over scheme values chosen to
keep 3:1 in both shipped schemes.

The script is dependency-free: it parses the restricted YAML dialect the
scheme files use (two-level mappings, scalar values, comments) without a
YAML library. It exits non-zero if any pair misses its threshold or a
scheme file cannot be parsed.

Derived colours in the generated CSS (control borders, tile borders,
bevels) are formulas over scheme values; they are design-verified rather
than reported here.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCHEMES_DIR = ROOT / "data" / "schemes"
GENERATED = ROOT / "data" / "generated" / "contrast.yaml"

BODY_THRESHOLD = 4.5
NON_TEXT_THRESHOLD = 3.0

PAIRS = [
    ("body_text", "text.primary", "surfaces.window", BODY_THRESHOLD),
    ("tile_text", "text.primary", "surfaces.tile", BODY_THRESHOLD),
    ("muted_text", "text.muted", "surfaces.window", BODY_THRESHOLD),
    ("panel_text", "text.inverse", "surfaces.panel", BODY_THRESHOLD),
    ("titlebar_text", "text.inverse", "chrome.titlebar", BODY_THRESHOLD),
    ("desktop_text", "text.desktop", "surfaces.desktop", BODY_THRESHOLD),
    ("selected_text", "text.primary", "accents.selection", BODY_THRESHOLD),
    ("link_text", "accents.link", "surfaces.window", BODY_THRESHOLD),
    ("focus_window", "accents.focus", "surfaces.window", NON_TEXT_THRESHOLD),
    ("focus_panel", "accents.focus", "surfaces.panel", NON_TEXT_THRESHOLD),
]

PAIR_LABELS = {
    "body_text": "Body text on the window surface",
    "tile_text": "Tile text on the tile surface",
    "muted_text": "Muted text on the window surface",
    "panel_text": "Panel text on the panel surface",
    "titlebar_text": "Titlebar text on the titlebar",
    "desktop_text": "Desktop shortcut text on the desktop",
    "selected_text": "Selected text on the selection colour",
    "link_text": "Link text on the window surface",
    "focus_window": "Focus ring on the window surface",
    "focus_panel": "Focus ring on the panel surface",
}

HEX = re.compile(r"^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$")


def parse_scheme(path: Path) -> dict:
    """Parse one scheme file: two-level mappings with scalar values."""
    scheme: dict = {}
    group: dict | None = None
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.split(" #", 1)[0].rstrip() if not raw.lstrip().startswith("#") else ""
        if not line.strip():
            continue
        indent = len(line) - len(line.lstrip(" "))
        content = line.strip()
        if ":" not in content:
            raise ValueError(f"{path.name}: cannot parse line: {raw!r}")
        key, value = (part.strip() for part in content.split(":", 1))
        if value == "":
            if indent == 0:
                group = {}
                scheme[key] = group
            else:
                raise ValueError(f"{path.name}: nested group deeper than one level: {raw!r}")
        else:
            value = value.strip('"').strip("'")
            if indent == 0:
                scheme[key] = value
                group = None
            elif group is not None:
                group[key] = value
            else:
                raise ValueError(f"{path.name}: indented value without a group: {raw!r}")
    return scheme


def resolve(value: dict, dotted: str) -> str:
    group, key = dotted.split(".", 1)
    try:
        return value[group][key]
    except KeyError:
        raise KeyError(f"missing key {dotted}")


def luminance(hex_colour: str) -> float:
    if not HEX.match(hex_colour):
        raise ValueError(f"not a hex colour: {hex_colour!r}")
    hex_colour = hex_colour.lstrip("#")
    if len(hex_colour) == 3:
        hex_colour = "".join(c * 2 for c in hex_colour)
    channels = [int(hex_colour[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    linear = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]


def contrast_ratio(a: str, b: str) -> float:
    la, lb = luminance(a), luminance(b)
    lighter, darker = (la, lb) if la >= lb else (lb, la)
    return (lighter + 0.05) / (darker + 0.05)


def main() -> int:
    if not SCHEMES_DIR.is_dir():
        print(f"error: {SCHEMES_DIR} not found", file=sys.stderr)
        return 1

    schemes = {}
    for path in sorted(SCHEMES_DIR.glob("*.yaml")):
        try:
            schemes[path.stem] = parse_scheme(path)
        except ValueError as error:
            print(f"error: {error}", file=sys.stderr)
            return 1

    if not schemes:
        print("error: no scheme files found", file=sys.stderr)
        return 1

    failures = 0
    lines = [
        "# Generated by scripts/contrast.py — do not edit.",
        "# WCAG contrast ratios for the documented pairs in data/schemes.",
        "# Rendered by the documentation's reference appendix.",
        "generated_by: scripts/contrast.py",
        "thresholds:",
        f"  body_text: {BODY_THRESHOLD}",
        f"  non_text: {NON_TEXT_THRESHOLD}",
        "schemes:",
    ]
    for name, scheme in schemes.items():
        lines.append(f"  {name}:")
        lines.append(f"    label: \"{scheme.get('label', name)}\"")
        lines.append("    pairs:")
        for pair, foreground, background, threshold in PAIRS:
            try:
                ratio = contrast_ratio(resolve(scheme, foreground), resolve(scheme, background))
            except (KeyError, ValueError) as error:
                print(f"error: scheme {name}: {error}", file=sys.stderr)
                return 1
            passed = ratio >= threshold
            if not passed:
                failures += 1
                print(
                    f"error: scheme {name}: {pair} {foreground} on {background} "
                    f"is {ratio:.2f}:1, needs {threshold}:1",
                    file=sys.stderr,
                )
            lines.append(f"      {pair}:")
            lines.append(f"        ratio: {ratio:.2f}")
            lines.append(f"        requirement: {threshold}")
            lines.append(f"        pass: {'true' if passed else 'false'}")
            lines.append(f'        description: "{PAIR_LABELS[pair]}"')
    GENERATED.parent.mkdir(parents=True, exist_ok=True)
    GENERATED.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {GENERATED.relative_to(ROOT)} ({len(schemes)} schemes)")

    if failures:
        print(f"error: {failures} contrast failure(s)", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
