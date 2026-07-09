# Les Recettes du Cœur

Site web statique complet prêt pour GitHub Pages.

## Dépôt cible
https://github.com/recettesducoeur/lesrecettesducoeur

## URL GitHub Pages attendue
https://recettesducoeur.github.io/

## À remplacer
Dans les fichiers HTML, remplacer le placeholder du formulaire :
`suggerer-recette.html`

## Déploiement
Copier tout le contenu de ce dossier à la racine du dépôt GitHub, puis activer GitHub Pages sur la branche `main`, dossier `/root`.


## Page de maintenance

Une page non mise en avant dans la navigation permet de visualiser et filtrer la base JSON :

`dev/base-recettes-dev.html`

## Calculateur de portions

Chaque fiche recette contient un calculateur qui adapte les quantités en fonction du nombre de portions souhaitées.

## Calculateur de portions — unités

Le calculateur adapte les quantités selon le nombre de portions choisi.

Il gère maintenant :
- `g` → `kg` à partir de 1000 g ;
- `kg` → `g` quand la quantité passe sous 1 kg ;
- `ml` → `L` à partir de 1000 ml ;
- `L` → `ml` quand la quantité passe sous 1 L ;
- fractions lisibles pour pièces, tranches, œufs, cuillères et pincées.

Exemples :
- `1200 g` devient `1,2 kg`
- `1500 ml` devient `1,5 L`
- `0,5 pièce` devient `1/2 pièce`
- `0,25 c. à café` devient `1/4 c. à café`

## Pages développeur / maintenance

Ces pages ne sont pas référencées dans la navigation principale :

- `dev/base-recettes-dev.html` : visualiser, filtrer, trier et contrôler `data/recettes.json`.
- `dev/dictionnaire-donnees-dev.html` : dictionnaire complet des champs de la base.
- `dev/import-texte-dev.html` : convertir un fichier texte structuré en bloc JSON à intégrer dans la base.

## Tables

Le CSS global ajoute des tableaux avec :
- ascenseurs horizontaux et verticaux ;
- tri par clic sur les en-têtes ;
- affichage / masquage des colonnes ;
- style homogène pour toutes les pages dev.

## Dictionnaire des données

La page `dev/dictionnaire-donnees-dev.html` contient maintenant une colonne supplémentaire :

`Valeurs possibles / exemples détaillés`

Un export JSON du dictionnaire est aussi disponible :

`data/dictionnaire_donnees.json`

## Page 404 illustrée

La page `404.html` utilise l’image humoristique validée :

`assets/images/site/404-recette-echappee-du-four.webp`

Une version PNG est également conservée :

`assets/images/site/404-recette-echappee-du-four.png`

## Template vierge de recette

Une fiche modèle a été ajoutée :

`recettes/00000000-000.html`

Elle correspond à une entrée invisible dans `data/recettes.json` :

`visible: false`

Elle sert de base à copier pour créer de nouvelles fiches recettes.

## Bouton de suggestion sur les fiches

Toutes les fiches recettes contiennent maintenant, en fin de page, un bouton :

`💡 Suggérer une recette`

Ce bouton pointe vers le placeholder :

`suggerer-recette.html`

## Responsive V8

Le CSS a été renforcé pour PC, tablette et smartphone.

Page dev ajoutée :

`dev/responsive-audit-dev.html`

Fichier d’audit :

`data/audit_responsive.json`

Principes appliqués :
- menu mobile sous 900px ;
- cartes recettes en 3 / 2 / 1 colonnes ;
- fiches recettes en une colonne sur mobile ;
- boutons pleine largeur sur smartphone ;
- tableaux dev avec scroll interne horizontal et vertical ;
- image 404 responsive ;
- prévention des débordements horizontaux.

## V9 — Recherche normalisée et URL racine

URL cible corrigée :

`https://recettesducoeur.github.io/`

La recherche ignore maintenant :
- la casse ;
- les accents ;
- les apostrophes ;
- la plupart des signes de ponctuation ;
- les différences simples entre singulier et pluriel.

Exemples :
- `pates`, `pâtes`, `pate` donnent les mêmes résultats ;
- `tomate` trouve aussi `tomates` ;
- `courgette` trouve aussi `courgettes` ;
- `oeuf`, `œuf`, `oeufs`, `œufs` sont rapprochés ;
- `creme` trouve aussi `crème`.

Fichier d’audit :

`data/audit_recherche_normalisee.json`

## V10 — Recherche, tags, semaine et positionnement

Améliorations ajoutées :
- calcul automatique de la semaine ISO en cours ;
- affichage de la recette de la semaine filtrée sur la semaine courante ;
- filtres année/mois pour afficher les sélections semaine par semaine ;
- onglet de recherche renommé `Nom recette` ;
- recherche ingrédient simplifiée vers l’ingrédient principal ;
- exemples : `thon égoutté` → `thon`, `banane mûre` → `banane` ;
- tags filtrables en sélection multiple ;
- positionnement renforcé : cuisine simple, solidaire et anti-gaspi ;
- mention renforcée : site participatif indépendant, non affilié aux Restos du Cœur ni à une banque alimentaire.

Fichier d’audit :

`data/audit_v10_ameliorations.json`

## V11 — Tags cliquables

Les tags affichés dans les fiches recettes sont maintenant cliquables.

Exemple :

`recettes/20000101-001.html` → clic sur `anti_gaspi` → `recherche.html?tag=anti_gaspi`

La page recherche :
- active automatiquement l’onglet `Tags` ;
- coche le tag transmis dans l’URL ;
- filtre les recettes associées ;
- accepte aussi plusieurs tags avec `?tag=a&tag=b` ou `?tags=a,b`.

Fichier d’audit :

`data/audit_v11_tags_cliquables.json`

## V12 — Champs filtrables cliquables

Extension du système de tags cliquables à tous les champs utiles pouvant servir de filtre.

Champs pris en charge :
- catégorie ;
- sous-catégorie ;
- température de service ;
- type de cuisson ;
- budget ;
- difficulté ;
- moment du repas ;
- équipement ;
- régimes ;
- allergènes ;
- tags.

Exemples d’URL :
- `recherche.html?categorie=plat`
- `recherche.html?cuisson=four`
- `recherche.html?budget=economique`
- `recherche.html?difficulte=facile`
- `recherche.html?equipement=four`
- `recherche.html?tag=anti_gaspi`

La page `recherche.html` contient maintenant un onglet `Filtres rapides`.

Fichier d’audit :

`data/audit_v12_filtres_champs_cliquables.json`

## V13 — Index technique `/dev/`

Ajout d’un sous-répertoire :

`dev/index.html`

Cette page sert d’index pratique vers les pages techniques `*-dev.html`.

Pages référencées :
- `dev/base-recettes-dev.html`
- `dev/dictionnaire-donnees-dev.html`
- `dev/import-texte-dev.html`
- `dev/responsive-audit-dev.html`

Mesures ajoutées :
- aucun lien public dans la navigation principale ;
- balise `meta robots="noindex,nofollow"` sur `/dev/index.html` ;
- fichier `robots.txt` demandant de ne pas indexer `/dev/` ni les pages `*-dev.html`.

Attention : GitHub Pages reste un hébergement statique public. Ces pages ne sont pas mises en avant, mais elles restent accessibles à toute personne connaissant l’URL.

## V14 — Note chaleureuse de contribution

La note importante a été remplacée par une version plus chaleureuse :

> Ce projet est ouvert à toutes les bonnes volontés.
> Que vous souhaitiez proposer une recette, corriger une fiche, partager une astuce, suggérer une variante ou simplement aider à améliorer le site, votre contribution est la bienvenue.
> Les Recettes du Cœur est une initiative participative, bénévole et indépendante, non affiliée aux Restos du Cœur ni à une banque alimentaire.

Pages mises à jour :
- `index.html`
- `presentation-projet.html`
- `contact.html`

Fichier d’audit :

`data/audit_v14_note_chaleureuse.json`

## V15 — Largeur desktop 100 % et impression des quantités sélectionnées

Améliorations :
- au-dessus de `1200px`, les pages utilisent toute la largeur disponible ;
- les fiches recettes ne sont plus limitées à une largeur étroite sur PC ;
- les tableaux passent à `width: 100%` sur grands écrans ;
- les quantités recalculées sont synchronisées avant impression / export PDF ;
- le nombre de portions sélectionné apparaît dans la version imprimée ;
- ajout d’un bloc imprimable `Quantités imprimées` ;
- mise en page A4 optimisée : image réduite, ingrédients en colonnes, sections plus compactes.

Fichier d’audit :

`data/audit_v15_largeur_print_quantites.json`

## V16 — Bandeau haut fixe sur écran PC

Le bandeau de navigation reste maintenant toujours visible sur les écrans de type PC.

Règles :
- à partir de `1024px`, le header passe en `position: fixed` ;
- la hauteur réelle du bandeau est calculée en JavaScript ;
- le contenu reçoit automatiquement un décalage supérieur pour ne pas passer sous le bandeau ;
- sous `1024px`, le bandeau reste en `sticky`, plus adapté au mobile/tablette ;
- l’impression/PDF n’est pas affectée.

Fichier d’audit :

`data/audit_v16_bandeau_pc_fixe.json`

## V17 — Bloc `Adapter les quantités` compact

Le bloc `⚖️ Adapter les quantités` des fiches recettes a été rendu plus compact.

Comportement :
- à partir de `900px`, le bloc passe sur une ligne horizontale ;
- le titre, le libellé, le champ de portions et l’information de calcul sont alignés ;
- le padding est réduit pour améliorer la lisibilité des ingrédients juste en dessous ;
- sous `900px`, le bloc reste empilé pour garder un bon affichage mobile.

Fichier d’audit :

`data/audit_v17_bloc_quantites_compact.json`

## V18 — Réparation déploiement URL racine

Version préparée pour l’URL :

`https://recettesducoeur.github.io/`

Corrections :
- QR codes régénérés avec l’URL racine ;
- anciennes URL `/lesrecettesducoeur/` remplacées ;
- ajout d’une page de diagnostic :
  `dev/diagnostic-deploiement.html`
- ajout d’un guide :
  `REPARATION_DEPLOIEMENT_ROOT.md`
- archive ZIP générée sans dossier parent pour faciliter l’upload GitHub.

Point critique :
`index.html`, `assets/`, `data/`, `images/`, `qrcodes/` et `recettes/` doivent être directement à la racine du dépôt `recettesducoeur.github.io`.

Fichier d’audit :

`data/audit_v18_reparation_deploiement_root.json`

## V19 — Réparation recettes, PDF statiques et variantes Google

Correctifs et ajouts :
- affichage statique de secours des recettes dans `index.html`, `recettes.html` et `recette-semaine.html` ;
- meilleure gestion d’erreur si `data/recettes.json` ne charge pas ;
- génération d’un PDF statique par recette dans `pdf/recettes/` ;
- les PDF utilisent les quantités de base de la recette ;
- sur PC : bouton PDF statique + bouton impression/PDF dynamique avec quantités sélectionnées ;
- sur mobile/tablette : bouton PDF statique uniquement ;
- ajout d’un lien Google sous `Variantes possibles` dans chaque fiche recette ;
- ajout des allergènes `fruits_a_coque` et `crustaces` ;
- ajout de la valeur de cuisson `sans_cuisson`, affichée `Sans cuisson` ;
- ajout de `data/valeurs_reference.json` ;
- ajout d’un lien vers le template vierge dans `/dev/index.html`.

Fichier d’audit :

`data/audit_v19_fiches_pdf_recherche.json`

## V20 — Base JSON vérifiée et mise à jour

Contrôle effectué sur `data/recettes.json`.

Résultat :
- 13 entrées dans la base ;
- 12 recettes visibles ;
- 1 template invisible : `00000000-000` ;
- aucun doublon d’ID ;
- aucun champ obligatoire manquant ;
- aucun fichier HTML/image/QR/PDF manquant ;
- l’ancienne URL `/lesrecettesducoeur/` est absente ;
- le champ `pdf` est maintenant présent dans chaque recette.

Champ ajouté :

`pdf`

Format :

`pdf/recettes/AAAAMMJJ-XXX.pdf`

Fichier d’audit :

`data/audit_v20_base_json_a_jour.json`

## V21 — Correctif JS, layout centralisé et PDF enrichis

Correctifs :
- réparation du JavaScript cassé dans `assets/js/app.js` ;
- réécriture propre de `layout.js`, `app.js`, `search.js` et `recette-semaine.js` ;
- centralisation de l’en-tête et du pied de page via `assets/js/layout.js` ;
- pied de page unique : `Cuisine simple, solidaire et anti-gaspi. Site participatif indépendant.` ;
- correction des liens Google : recherche uniquement sur le nom de la recette ;
- PDF régénérés avec logo et image de la recette ;
- contrôle `node --check` sur les scripts principaux ;
- vérification JSON : ID, fichiers HTML, images, QR codes, PDF ;
- QR codes régénérés pour `https://recettesducoeur.github.io/`.

Fichier d’audit :

`data/audit_v21_correctif_js_layout_pdf.json`

## V22 — Page suggérer une recette, boutons PDF/Imprimer et QR dans PDF

Ajouts et correctifs :
- création de `suggerer-recette.html` ;
- intégration de deux visuels :
  - `assets/images/site/suggerer-recette-boite-a-idees.webp`
  - `assets/images/site/suggerer-recette-ensemble.webp`
- correction du lien mort de suggestion ;
- fiches recettes : deux boutons distincts `🖨️ Imprimer` et `📄 Télécharger le PDF` ;
- mobile/tablette : le bouton impression est masqué, le PDF reste disponible ;
- lien Google sous `Variantes possibles`, basé uniquement sur le nom de la recette ;
- PDF régénérés avec logo, image de recette et QR code de la recette ;
- page recette de la semaine renforcée contre les résultats vides ;
- contrôles JS/JSON/fichiers effectués.

Fichier d’audit :

`data/audit_v22_suggerer_recette_pdf_qr.json`

## V23 — Catalogue paginé, boutons uniformes, tableaux améliorés

Améliorations :
- `recettes.html` : images limitées à environ 1/4 de l’écran sur PC ;
- `recettes.html` : pagination dynamique à 20 recettes maximum par page ;
- correction des liens `Suggérer une recette` vers `suggerer-recette.html` ;
- pied de page centralisé mis à jour :
  `Cuisine simple, solidaire et anti-gaspi. Site participatif indépendant.`
- fiches recettes : les quatre boutons d’action ont la même taille et la même police ;
- tableaux dev : colonnes redimensionnables à la souris ;
- tableaux dev : première ligne et première colonne sticky.

Fichier d’audit :

`data/audit_v23_pagination_tableaux_footer.json`

## V24 — Accueil, QR code, recherche et recette de la semaine

Améliorations :
- accueil : logo limité à maximum 1/3 de la largeur d’écran sur PC ;
- accueil : ajout du QR code vers `https://recettesducoeur.github.io/` ;
- contact : suppression du texte parasite `` ;
- contact : ajout du QR code du site ;
- page `suggerer-recette.html` : ajout du QR code du site ;
- recherche : résultats en 3 colonnes maximum sur PC, 2 sur tablette, 1 sur smartphone ;
- `recette-semaine.html` : script de filtrage par semaine / année / mois réécrit et sécurisé ;
- ajout d’une garde anti-boucle dans le calcul des semaines d’un mois ;
- contrôles JS/JSON/fichiers effectués.

Fichier d’audit :

`data/audit_v24_logo_qr_recherche_semaine.json`

## V25 — Grilles recettes limitées à 8 colonnes maximum

Amélioration de l’affichage des recettes sur toutes les pages contenant des grilles de recettes.

Règles responsive :
- smartphone : 1 colonne ;
- tablette : 2 colonnes ;
- PC courant : 3 à 4 colonnes ;
- très grand écran : 6 colonnes ;
- écran très large : 8 colonnes maximum.

Le catalogue `recettes.html` suit désormais cette logique globale.
La page recherche conserve son plafond spécifique de 3 colonnes, qui reste inférieur à la limite globale de 8.

Fichier d’audit :

`data/audit_v25_grilles_recettes_max_8_colonnes.json`

## V26 — Centralisation design, tableaux et dossier dev

Améliorations :
- centralisation des grilles de recettes dans `assets/css/style.css` ;
- largeur des cartes recettes limitée à environ `1/5` de l’écran sur PC ;
- plafond visuel de `8 colonnes` maximum sur très grands écrans ;
- harmonisation de `.recipe-grid`, `.catalog-grid` et des résultats de recherche ;
- centralisation des boutons, QR cards et comportements responsive ;
- généralisation des tableaux `.data-table` et `.dev-table` :
  - scroll horizontal ;
  - scroll vertical ;
  - première ligne sticky ;
  - première colonne sticky ;
  - tri croissant/décroissant sur chaque colonne ;
  - colonnes redimensionnables à la souris ;
- déplacement des pages HTML de développement/test vers `/dev/` ;
- mise à jour de `/dev/index.html` avec des liens corrigés ;
- mise à jour des liens internes vers les pages dev déplacées.

Fichier d’audit :

`data/audit_v26_centralisation_dev_tables.json`

## V27 — Recettes améliorées, sources web, images et PDF

Améliorations :
- les 12 recettes visibles ont été retravaillées après recherche web ;
- ajout de sources d’inspiration dans `data/recettes.json` ;
- ajout du lien `recherche_web_url` dans chaque recette visible ;
- ajout d’une section `Sources d’inspiration` dans chaque fiche recette ;
- enrichissement des textes : résumé, explication, étapes, astuce anti-gaspi et variantes ;
- génération d’une nouvelle illustration web pour chaque recette visible ;
- régénération des PDF avec image, QR code, textes améliorés et sources ;
- contrôle JS, JSON, fichiers, liens et rendu PDF.

Fichier d’audit :

`data/audit_v27_recettes_ameliorees_sources_images_pdf.json`

## V28 — Cuisson au four, ingrédients vérifiés, images et PDF

Améliorations :
- ajout d’une section `Cuisson indicative` dans chaque fiche recette visible ;
- ajout d’une température et d’un temps indicatifs pour les recettes au four ;
- ajout d’une option gratin pour la recette chou-fleur/quinoa ;
- vérification et complétion des listes `principaux`, `secondaires`, `optionnels` ;
- régénération des images web dans un style plus proche d’une photo maison ;
- mise à jour de `data/recettes.json` ;
- régénération des fiches HTML recettes ;
- régénération des PDF avec cuisson indicative, image, QR code et sources ;
- contrôles JS, JSON, fichiers, liens et rendu PDF.

Fichier d’audit :

`data/audit_v28_cuisson_four_ingredients_images_pdf.json`

## V29 — Nutrition estimée, repères alimentaires et aide documentée

Améliorations :
- déplacement des sources d’inspiration dans la rubrique `Variantes possibles`, sous la recherche Google ;
- ajout d’une rubrique `Valeurs nutritionnelles estimées` dans chaque fiche recette visible ;
- ajout d’un `Nutri-Score estimé non officiel` avec disclaimer ;
- ajout d’un lien vers `aide.html#valeurs-nutritionnelles` depuis chaque fiche ;
- ajout des `Repères alimentaires` : sans porc, végétarien, vegan possible, contient poisson/lait/œuf/gluten, etc. ;
- ajout du filtre `repere` dans la recherche ;
- mise à jour de `data/valeurs_reference.json` ;
- enrichissement de `aide.html` avec une rubrique sur la fiabilité, les limites, le Nutri-Score estimé et les sources officielles ;
- liens d’aide ajoutés vers Anses/Ciqual, Santé publique France, Manger Bouger, Commission européenne, règlement UE, OMS et Open Food Facts ;
- régénération des PDF avec nutrition estimée et repères alimentaires.

Fichier d’audit :

`data/audit_v29_nutrition_reperes_sources_aide.json`

## V30 — Aide structurée, ancres, allergènes et PDF

Améliorations :
- déplacement de `🔥 Cuisson indicative` dans la rubrique `👩‍🍳 Préparation détaillée`, sous forme de commentaire ;
- suppression de la section autonome `Cuisson indicative` dans les fiches recettes ;
- enrichissement des repères alimentaires avec les allergènes : `Contient [allergène]` ou `Sans [allergène] possible` ;
- mise à jour de `data/valeurs_reference.json` ;
- PDF : ajout de la fiche en ligne en pied de page ;
- PDF : suppression du texte `Aide nutrition` et du lien d’aide nutrition en pied de page ;
- page aide : regroupement des recherches dans une seule rubrique `Recherche` ;
- page aide : ajout de rubriques tutoriel `Cuisiner`, `Imprimer`, `Partager et suggérer` ;
- page aide : sources et références utiles en section repliable/dépliable fermée par défaut ;
- généralisation automatique des ancres sur tous les titres `H1`, `H2` et `H3` du site ;
- régénération des fiches HTML et des PDF.

Fichier d’audit :

`data/audit_v30_aide_ancres_allergenes_pdf.json`
