# Répéteur d'exposé — version page statique

Une page HTML autonome qui fait apprendre le texte d'un exposé par rappel actif
(lecture complète → mots-clés → mots-clés choisis `*marqués*` → titre seul → fil rouge).

## Prérequis

- Linux avec **Node.js ≥ 18** (et npm). Vérifie : `node --version`
  - Debian/Ubuntu : `sudo apt install nodejs npm`
  - Ou via nvm : `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash` puis `nvm install --lts`

## Compilation (une seule commande)

```bash
bash build.sh
```

Le script installe les dépendances (react, esbuild, tailwind), puis produit :

- `bundle.js`  — l'application React compilée en un seul fichier
- `style.css`  — le CSS Tailwind, limité aux classes réellement utilisées

## Utilisation

Ouvre simplement `index.html` dans ton navigateur (double-clic, pas besoin de serveur).
Tout fonctionne hors ligne : la page ne charge rien sur internet.

Astuce : pour éviter que la touche Espace ne fasse défiler la page, clique d'abord
n'importe où dans la page après l'ouverture.

## Modifier le code

- L'application : `App.tsx`
- Le point d'entrée React : `main.tsx`

Après chaque modification, relance `bash build.sh`.

## Variante rapide (sans Tailwind CLI)

Si tu ne veux pas générer le CSS, remplace dans `index.html` la ligne
`<link rel="stylesheet" href="style.css" />` par :

```html
<script src="https://cdn.tailwindcss.com"></script>
```

et compile uniquement le JS :

```bash
npx esbuild main.tsx --bundle --minify --format=iife --jsx=automatic --outfile=bundle.js
```

(dans ce cas la page a besoin d'internet au chargement)
