---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
layout: "moodboard"
description: ""
date: {{ .Date }}
cover: ""
tiles: "tiles.yaml"
draft: true
---

Notes on the board go here. Add images and audio to this folder and
reference them from `tiles.yaml`; see the tile schema in the theme README.
