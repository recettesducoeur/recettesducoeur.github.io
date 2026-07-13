# Les Recettes du Cœur — Version 37.3

## Modifications intégrées

- Architecture JSON par recette et template unique.
- Classeur maître des ingrédients avec CIQUAL comme source de vérité.
- Base `ingredients.json` générée.
- Ingrédients atomiques ; variantes déplacées vers les optionnels.
- Assaisonnements non indispensables reclassés en optionnels.
- Distinction eau de référence / bouillon optionnel.
- 13 fiches recette conservées avec identité visuelle existante.
- Impression dynamique des quantités affichées.
- PDF standard et QR code de la fiche conservés.
- Suppression du QR code Google.
- Recherche Google ajoutée comme première source dans « Sources d’inspiration ».
- Page d’accueil limitée aux 10 dernières recettes.
- Documentation V37 et sources CIQUAL intégrées.
- URL racine GitHub Pages : `https://recettesducoeur.github.io/`.

## Limites connues

- Certaines données nutritionnelles restent incomplètes ou génériques ; elles sont documentées dans les rapports et ne doivent pas être présentées comme officielles.
- Le PDF téléchargé reste la version standard de référence ; pour un PDF personnalisé, utiliser Imprimer puis Enregistrer au format PDF.


## Évolution 37.3

- recalcul des 13 Nutri-Scores estimés avec le nouvel algorithme 2025 ;
- ajout du détail des points dans `data/recettes.json` ;
- ajout des sources officielles et du calculateur Santé publique France ;
- conservation de la mention « estimé — non officiel ».
