# ⚙️ 09 — Guide technique

> **Document :** DOC-09  
> **Version :** V36  
> **Statut :** 🟢 Conforme  
> **Dernière mise à jour :** 12 juillet 2026  
> **Source de vérité :** Oui  
> **Documents liés :** DOC-02, DOC-05, DOC-10, DOC-11

## 📦 Prérequis

Python 3, navigateur moderne, éditeur de code et Git recommandé. Aucun serveur applicatif, base de données ou Node.js n’est requis actuellement.

## 📍 Répertoire de travail

Toutes les commandes sont lancées depuis la racine du projet.

```bash
python3 dev/scripts/build-site.py
```

`build-site.py` exécute dans cet ordre : recettes, astuces, index de recherche, QR codes puis audit.

## 🛠️ Commandes spécialisées

```bash
python3 dev/scripts/generate-recipes.py
python3 dev/scripts/generate-astuces.py
python3 dev/scripts/generate-search-index.py
python3 dev/scripts/generate-qrcodes.py
python3 dev/scripts/audit-site.py
```

> Les sorties générées peuvent être écrasées. Toute correction durable doit viser la source JSON, le template ou le script correspondant.

## 🍲 Ajouter une recette

1. Modifier `data/recettes.json`.
2. Vérifier identifiant, titre, slug, URL, ingrédients, durées, températures et quantités.
3. Ajouter l’image validée.
4. Lancer le build.
5. Contrôler fiche, recherche, PDF et QR code.
6. Lancer l’audit et mettre à jour le changelog.

## 🧺 Ajouter une astuce

Modifier la source JSON, vérifier identifiant/slug/catégorie, ajouter le visuel, lancer le build puis tester filtres, recherche, mobile et audit.

## 🔎 Recherche et pagination

| Interface | Configuration | Valeur actuelle |
|---|---|---:|
| Recherche principale | `PAGE_SIZE` dans `assets/js/search.js` | 24 |
| Grilles configurables | attribut `data-page-size` | selon page |
| Repli générique | `assets/js/app.js` | 20 |
| Test de développement | temporaire | 8 |

La pagination intervient après les filtres. Tout changement de critère revient à la page 1. Une pagination dans l’URL est une évolution future, non intégrée à la V36.

## 🌐 Test local

```bash
python3 -m http.server 8000
```

Ouvrir `http://localhost:8000/`. Ce test est préférable à `file://` pour les chargements JSON et les chemins relatifs.

## 🚀 GitHub Pages

URL cible : `https://recettesducoeur.github.io/`. Conserver `.nojekyll` et contrôler URL absolues, QR codes, liens canoniques, sitemap, robots, métadonnées, CSS, JavaScript, images et page 404.

## ↩️ Retour arrière

Créer un commit Git ou une copie avant une génération importante, examiner les différences puis restaurer en cas de problème. `zzz_archives/` ne remplace pas le versionnement.

## 🔮 Évolution prévue

Un futur `data/config.json` pourra centraliser URL du site, pagination et environnement ; il n’est pas introduit dans la V36.
