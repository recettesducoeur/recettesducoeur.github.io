# Réparation du déploiement GitHub Pages — URL racine

URL cible :

```txt
https://recettesducoeur.github.io/
```

## Cause probable du site cassé

Si le site apparaît sans mise en forme, avec le logo cassé et les fonctions JavaScript absentes, cela signifie presque toujours que les dossiers techniques ne sont pas au bon endroit dans le dépôt.

Les fichiers suivants doivent être accessibles directement :

```txt
https://recettesducoeur.github.io/assets/css/style.css
https://recettesducoeur.github.io/assets/js/app.js
https://recettesducoeur.github.io/assets/logos/logo-principal.png
https://recettesducoeur.github.io/data/recettes.json
```

## Nom du dépôt attendu

Le dépôt doit être nommé exactement :

```txt
recettesducoeur.github.io
```

Pas :

```txt
lesrecettesducoeur
```

## Structure attendue à la racine du dépôt

Après upload, tu dois voir directement :

```txt
.nojekyll
404.html
DEPLOIEMENT.md
README.md
index.html
recette-semaine.html
recherche.html
recettes.html
assets/
data/
dev/
images/
qrcodes/
recettes/
robots.txt
diagnostic-deploiement.html
```

Il ne faut pas avoir :

```txt
lesrecettesducoeur_site/index.html
```

ou :

```txt
lesrecettesducoeur_site/assets/css/style.css
```

car dans ce cas les chemins du site seront cassés.

## Procédure propre recommandée

1. Dans le dépôt `recettesducoeur.github.io`, supprime tous les anciens fichiers.
2. Décompresse cette archive ZIP.
3. Ouvre le dossier décompressé.
4. Sélectionne tout le contenu intérieur.
5. Glisse les fichiers et dossiers dans GitHub :
   `Add file` → `Upload files`.
6. Vérifie que `index.html` et `assets/` sont directement visibles à la racine.
7. Clique sur `Commit changes`.
8. Va dans `Settings` → `Pages`.
9. Mets :
   - Source : `Deploy from a branch`
   - Branch : `main`
   - Folder : `/ root`
10. Attends que `Actions` passe au vert.
11. Teste :
    `https://recettesducoeur.github.io/diagnostic-deploiement.html`

## Test final

Si la page de diagnostic indique que tous les chemins répondent, le site est réparé.
