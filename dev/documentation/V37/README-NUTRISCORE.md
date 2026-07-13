# Nutri-Score estimé — V37.3

## Statut

Le site affiche un **Nutri-Score estimé — non officiel**. Le logo officiel n’est pas utilisé.

Le nouvel algorithme est applicable en France depuis le **16 mars 2025**. Le calcul est réalisé pour 100 g à partir de l’énergie, des sucres, des acides gras saturés, du sel, des protéines, des fibres et de la proportion estimée de fruits, légumes et légumineuses.

## Limites propres aux recettes maison

- les valeurs nutritionnelles sont des estimations ;
- la masse finale après cuisson peut varier ;
- la proportion de fruits, légumes et légumineuses est estimée ;
- les ingrédients optionnels sont exclus ;
- le résultat ne constitue pas un classement réglementaire.

## Algorithme des aliments généraux

Points défavorables : énergie (0–10), sucres (0–15), saturés (0–10), sel (0–20).

Points favorables : protéines (0–7), fibres (0–5), fruits/légumes/légumineuses (0, 1, 2 ou 5).

Si les points défavorables sont au moins égaux à 11, les protéines ne sont pas soustraites pour les aliments généraux.

Classes : A ≤ 0 ; B = 1–2 ; C = 3–10 ; D = 11–18 ; E ≥ 19.

## Sources officielles

- Santé publique France — Nutri-Score : https://www.santepubliquefrance.fr/nutrition-et-activite-physique/nutri-score
- Rapport scientifique 2022 — algorithme des aliments solides : fichier `2022-main-algorithm-report-update_FINAL.pdf`
- Calculateur officiel actualisé : fichier `Nutri-Score_algorithme-actualise_20240404.xlsx`
- Manger Bouger — méthode de calcul : https://www.mangerbouger.fr/manger-mieux/s-informer-sur-les-produits-qu-on-achete/nouveau-nutri-score/comment-calcule-t-on-le-nutri-score
