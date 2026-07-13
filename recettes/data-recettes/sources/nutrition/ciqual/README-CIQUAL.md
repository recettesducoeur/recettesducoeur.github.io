# CIQUAL 2025 — référence nutritionnelle

## Contenu

- `Table Ciqual 2025_FR_2025_11_03.xlsx` : fichier officiel.
- `correspondance-ciqual.json` : lien entre chaque ingrédient du site et le code CIQUAL.
- `README-CIQUAL.md` : règles de fonctionnement et de maintenance.

## Source

- Organisme : **Anses**
- DOI : **10.57745/RDMHWY**
- Jeu de données :
  `https://entrepot.recherche.data.gouv.fr/dataset.xhtml?persistentId=doi:10.57745/RDMHWY`
- Site de consultation :
  `https://ciqual.anses.fr/`

Citation :

> Anses. 2025. Table de composition nutritionnelle des aliments Ciqual 2025. https://doi.org/10.57745/RDMHWY

## Code unique

La colonne `alim_code` est conservée comme clé de référence. Elle permet de retrouver l’aliment, vérifier une correspondance et corriger une future mise à jour.

## Ingrédients simples

Les ingrédients principaux et secondaires ne contiennent plus de formulation composée du type `A ou B`.

La recette utilise un ingrédient de référence unique. Les alternatives peuvent apparaître dans **Optionnels** et dans **Variantes possibles**.

## Calculs

Seuls les ingrédients principaux et secondaires participent :

- aux valeurs nutritionnelles ;
- au Nutri-Score estimé ;
- aux allergènes principaux ;
- aux régimes ;
- aux compatibilités.

Les ingrédients optionnels sont exclus des calculs automatiques.

## Valeurs extraites pour 100 g

- énergie kJ et kcal ;
- protéines ;
- glucides ;
- sucres ;
- lipides ;
- acides gras saturés ;
- fibres ;
- sel.

## Formules

```text
valeur ingrédient = valeur pour 100 g × quantité en g ÷ 100
valeur totale = somme des ingrédients principaux et secondaires
valeur par personne = valeur totale ÷ personnes de référence
valeur pour 100 g = valeur totale × 100 ÷ masse totale
```

Les mesures en ml, cuillères, pièces ou pincées nécessitent une conversion validée vers les grammes.

## Confiance

- `exacte`
- `equivalente`
- `approximative`
- `a-valider`

## Source alternative

Une seule source active est autorisée par ingrédient. CIQUAL est prioritaire. Une source alternative unique n’est utilisée qu’en l’absence de correspondance CIQUAL acceptable. Elle doit conserver son nom, son identifiant, l’URL consultée, la raison et la confiance.

## Nutri-Score

Le site affichera uniquement : **Nutri-Score estimé — non officiel**. Il ne s’agit pas du logo réglementaire.
