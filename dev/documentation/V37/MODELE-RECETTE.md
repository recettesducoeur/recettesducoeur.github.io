# MODELE-RECETTE V37

## Objet

Ce document définit le contrat entre :

- les JSON individuels des recettes ;
- les données calculées pendant le build ;
- le template `recette.html` ;
- le PDF standard ;
- l’impression dynamique de la page ;
- le QR code de la fiche.

## Identité visuelle

Le template conserve l’identité actuelle du site :

- cartes arrondies et aérées ;
- palette douce du site ;
- badges par familles ;
- allergènes en rouge ;
- régimes et compatibilités en vert ;
- informations secondaires en bleu ;
- boutons principaux, secondaires et fantômes existants ;
- image de recette cliquable ;
- navigation et pied de page communs.

Aucune nouvelle charte visuelle parallèle ne doit être créée.

## Ordre des blocs

1. En-tête de la recette et image.
2. Badges principaux.
3. Métadonnées : personnes, temps, température, équipements, budget, difficulté.
4. Adaptation des portions.
5. Ingrédients principaux, secondaires et optionnels.
6. Préparation détaillée.
7. Cuisson indicative.
8. Astuce anti-gaspi.
9. Variantes possibles.
10. Sources d’inspiration repliables.
11. Repères alimentaires, allergènes et conservation.
12. Valeurs nutritionnelles estimées.
13. Filtres associés.
14. QR code de la fiche.
15. Actions : imprimer, télécharger le PDF, suggérer une recette, retour.

## Sources d’inspiration

La section garde le titre :

`📚 Sources d’inspiration`

Elle est repliable et contient toujours :

1. une recherche Google générique générée depuis le titre ;
2. les sources particulières présentes dans le JSON.

Aucun QR code Google n’est généré.

## Ingrédients et portions

Le champ de portions adapte à l’écran toutes les quantités principales, secondaires et optionnelles.

Le bouton d’impression imprime les quantités actuellement visibles.

Les valeurs nutritionnelles restent calculées sur la recette de référence et ne changent pas lors de l’adaptation des portions, sauf évolution future explicitement validée.

## Nutrition

Trois états sont prévus :

- `complet` : toutes les valeurs sont calculées ;
- `partiel` : des ingrédients génériques sont exclus et la fiche l’indique ;
- `indisponible` : aucun tableau final n’est présenté.

Les ingrédients optionnels et variantes sont toujours exclus du calcul.

Le libellé doit rester :

`Nutri-Score estimé — non officiel`

## QR code

Un seul QR code est généré : celui de la fiche en ligne.

Chemin :

`qrcodes/recettes/<id>.webp`

Il apparaît sur la fiche HTML et dans le PDF.

## PDF

Le PDF standard est généré depuis les portions de référence.

Chemin :

`pdf/recettes/<id>.pdf`

Il reprend le contenu utile de la recette, sans navigation du site.

## Impression dynamique

Le module générique `assets/js/print-page.js` imprime la zone définie par `data-print-target`.

Il peut être réutilisé pour :

- les recettes ;
- les astuces ;
- les guides ;
- toute autre fiche imprimable.

L’impression conserve l’état actuel du DOM, notamment les quantités recalculées.

## Accessibilité

- titres hiérarchisés ;
- textes alternatifs des images ;
- liens explicites ;
- boutons de type `button` ;
- accordéons natifs `details/summary` ;
- indications non fondées uniquement sur la couleur ;
- contenu imprimable compréhensible sans navigation.

## Règle de maintenance

Le template ne contient aucune donnée propre à une recette.

Toute donnée spécifique provient du JSON source ou d’un calcul du build.
