#!/bin/sh
# radiance — the guardrail checks from AGENTS.md and the handbook.
#
# Run before committing: scripts/checks.sh
# The CI workflow (.github/workflows/ci.yml) runs the same script on
# push and pull request.
#
# Checks:
#   1. No hex colour literals in layouts/ or assets/css/; colours enter
#      only through data/schemes/.
#   2. The contrast report passes (scripts/contrast.py).
#   3. The example site builds without warnings (--panicOnWarning),
#      which also fails on a scheme file whose key set differs from the
#      others (partials/schemes-css.html warns on divergence).
#   4. Site parameters are read only through
#      layouts/partials/config/get.html; a direct site.Params read is a
#      bug, and a parameter absent from data/schema.yaml is refused
#      there (also fatal under --panicOnWarning).

set -e
cd "$(dirname "$0")/.."

fail() {
  printf 'FAIL: %s\n' "$1"
  exit 1
}

# 1. Hex colour literals.
if grep -rniE '#[0-9a-f]{6}\b|#[0-9a-f]{3}\b' layouts assets/css; then
  fail "hex colour literal in layouts/ or assets/css/; colours enter only through data/schemes"
fi

# 2. Contrast report.
python3 scripts/contrast.py || fail "contrast check failed"

# 3. Build without warnings (covers scheme key-set divergence).
hugo --source exampleSite --themesDir ../.. --panicOnWarning >/dev/null || fail "hugo build failed or warned (including scheme key-set divergence)"

# 4. Site parameters go through the schema door.
if grep -rn 'site\.Params\.' layouts; then
  fail "direct site.Params read in layouts/; use layouts/partials/config/get.html"
fi

printf 'All checks passed.\n'
