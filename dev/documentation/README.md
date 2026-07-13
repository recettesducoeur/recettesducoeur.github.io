# 🍲 Les Recettes du Cœur — Documentation

> **Document :** DOC-00  
> **Version :** V36  
> **Statut :** 🟢 Conforme  
> **Dernière mise à jour :** 12 juillet 2026  
> **Source de vérité :** Oui  
> **Documents liés :** DOC-01 à DOC-11, DOC-99

<img src="assets/logos/logo-principal.png" alt="Logo officiel" width="204">

## 🚀 Accès rapide

| Besoin | Document maître |
|---|---|
| Comprendre le projet | [01 — Projet](01_Projet.md) |
| Comprendre l’architecture | [02 — Architecture technique](02_Architecture_Technique.md) |
| Rédiger une recette ou une astuce | [03 — Charte éditoriale](03_Charte_Editoriale.md) |
| Appliquer l’identité visuelle | [04 — Charte graphique](04_Charte_Graphique.md) |
| Utiliser les composants UI | [05 — Design System UI](05_Design_System_UI.md) |
| Utiliser les mascottes | [06 — Mascottes](06_Mascottes.md) |
| Produire une illustration | [07 — Illustrations IA](07_Illustrations_IA.md) |
| Produire une photo de recette | [08 — Photographies](08_Photographies.md) |
| Développer et générer le site | [09 — Guide technique](09_Guide_Technique.md) |
| Vérifier les sources et règles | [10 — Sources et gouvernance](10_Sources_et_Gouvernance.md) |
| Tester et livrer une version | [11 — Qualité, tests et livraison](11_Qualite_Tests_Livraison.md) |
| Consulter les évolutions | [Changelog](CHANGELOG.md) |

## 📊 Registre documentaire

| ID | Document | Source de vérité | Statut |
|---:|---|:---:|:---:|
| DOC-00 | README | Oui | 🟢 |
| DOC-01 | Projet | Oui | 🟢 |
| DOC-02 | Architecture technique | Oui | 🟢 |
| DOC-03 | Charte éditoriale | Oui | 🟢 |
| DOC-04 | Charte graphique | Oui | 🟢 |
| DOC-05 | Design System UI | Oui | 🟢 |
| DOC-06 | Mascottes | Oui | 🟢 |
| DOC-07 | Illustrations IA | Oui | 🟢 |
| DOC-08 | Photographies | Oui | 🟢 |
| DOC-09 | Guide technique | Oui | 🟢 |
| DOC-10 | Sources et gouvernance | Oui | 🟢 |
| DOC-11 | Qualité, tests et livraison | Oui | 🟢 |
| DOC-99 | Changelog | Historique | 🟢 |

### Statuts

- 🟢 **Conforme** : à jour et contrôlé.
- 🟠 **À actualiser** : utilisable, mais incomplet.
- 🔴 **Bloquant** : incohérence empêchant une livraison.
- ⚪ **Prévu** : non encore intégré.

## 📌 Règles communes

- **Une information = un document maître.** Les autres documents renvoient vers lui.
- **Une donnée = une source de vérité.** Les autres représentations sont dérivées ou générées.
- Les images documentaires sont stockées dans `dev/documentation/assets/` et référencées par chemins relatifs.
- Les dossiers `zzz_archive/` et `zzz_archives/` sont ignorés. Ils ne constituent jamais une source de vérité.
- Aucun fichier actif ne doit dépendre d’une ressource archivée.
- Toute évolution significative est résumée dans `CHANGELOG.md`.

## 📁 Arborescence documentaire

```text
dev/documentation/
├── README.md
├── 01_Projet.md … 11_Qualite_Tests_Livraison.md
├── CHANGELOG.md
└── assets/
```
