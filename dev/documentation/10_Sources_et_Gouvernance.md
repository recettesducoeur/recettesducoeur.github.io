# 📚 10 — Sources et gouvernance

> **Document :** DOC-10  
> **Version :** V36  
> **Statut :** 🟢 Conforme  
> **Dernière mise à jour :** 12 juillet 2026  
> **Source de vérité :** Oui  
> **Documents liés :** DOC-02, DOC-03, DOC-09, DOC-11

## 🏛️ Principes

Une information possède un document maître ; une donnée possède une source de vérité. L’IA assiste mais ne valide pas seule.

## 🧭 Sources de vérité

| Domaine | Source |
|---|---|
| Recettes | `data/recettes.json` |
| Ingrédients | `data/ingredients.json` |
| Astuces | `data/astuces.json` |
| Sélection hebdomadaire | `data/selection_semaine.json` |
| Structure des fiches | `dev/templates/` |
| Styles | `assets/css/` |
| Comportements | `assets/js/` |
| Règles éditoriales | DOC-03 |
| Règles graphiques | DOC-04 à DOC-08 |
| Rapports d’audit | Indicateurs, jamais sources |
| HTML généré | Sortie, jamais source |
| Archives | Exclues |

## 🔎 Sources externes

Toute source importante indique organisme, objet, URL, date de consultation, domaine et synthèse. Les organismes officiels et réglementaires sont prioritaires pour sécurité alimentaire, nutrition, conservation, hygiène, accessibilité et normes.

Statuts : `active`, `to-review`, `obsolete`, `archived`.

## 🔄 Validation d’une évolution

1. Mettre à jour la source de vérité.
2. Reconstruire les fichiers générés.
3. Vérifier l’absence de régression.
4. Actualiser les documents concernés.
5. Inscrire l’évolution significative au changelog.

## 🗄️ Non-dépendance aux archives

Aucune page, script, donnée, feuille de style ou documentation maître ne doit dépendre de `zzz_archive/` ou `zzz_archives/`.

## 🧰 Maintenance documentaire

À chaque version majeure ou changement d’architecture, vérifier les documents concernés. Une règle n’est pas recopiée : elle est liée depuis son document maître.
