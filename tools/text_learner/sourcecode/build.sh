#!/usr/bin/env bash
# Compile le Répéteur d'exposé en page statique (bundle.js + style.css).
set -euo pipefail

if [ ! -d node_modules ]; then
  npm install
fi

# 1) Bundle React + l'app en un seul fichier JS (IIFE, ouvrable en file://)
npx esbuild main.tsx \
  --bundle \
  --minify \
  --format=iife \
  --jsx=automatic \
  --outfile=bundle.js

# 2) Génère le CSS Tailwind à partir des classes utilisées dans le code
npx tailwindcss -i input.css -o style.css --minify

mv index.html ..
mv style.css ..
mv bundle.js ..
