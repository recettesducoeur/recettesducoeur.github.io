# ⚙️ 02 — Architecture technique

> **Document :** DOC-02  
> **Version :** V36  
> **Statut :** 🟢 Conforme  
> **Dernière mise à jour :** 12 juillet 2026  
> **Source de vérité :** Oui  
> **Documents liés :** DOC-01, DOC-09, DOC-10, DOC-11

## 🧭 Principe fondamental

> Une donnée possède une seule source officielle. Les autres représentations sont générées, calculées ou dérivées.

## 🗺️ Vue d’ensemble

```text
              Données JSON
                   │
       ┌───────────┴───────────┐
       │                       │
   Templates                Médias
       │                       │
       └───────────┬───────────┘
                   │
             Scripts de build
                   │
      ┌────────────┼────────────┐
      │            │            │
    HTML          PDF       QR / index
      └────────────┴────────────┘
                   │
              Audit qualité
                   │
       GitHub Pages — racine
```

## 📚 Hiérarchie des sources

1. Données JSON validées.
2. Templates, scripts, CSS, JavaScript et médias validés.
3. HTML, PDF, index et QR codes générés.
4. Rapports d’audit, indicateurs uniquement.
5. Archives, toujours exclues.

Un fichier généré ne doit pas être corrigé manuellement lorsqu’une source, un template ou un script peut être corrigé.

## 📂 Dossiers maîtres

| Dossier | Rôle | Nature |
|---|---|---|
| `data/` | Données JSON | Source |
| `data/audit/` | Rapports de contrôle | Généré |
| `dev/templates/` | Modèles HTML | Source |
| `dev/scripts/` | Génération et audit | Source |
| `dev/outils/` | Interfaces de développement | Source |
| `dev/references/` | Synthèses de sources externes | Référence |
| `dev/documentation/` | Documentation officielle | Source |
| `assets/css/` | Styles communs | Source |
| `assets/js/` | Scripts partagés | Source |
| `assets/images/` | Illustrations générales | Source/export |
| `assets/logos/` | Logos et favicons | Source/export |
| `recettes/` | Fiches, médias, PDF et QR | Majoritairement généré |
| `astuces/` | Fiches, médias, PDF et QR | Majoritairement généré |
| `qrcodes/` | QR codes généraux | Généré |

## ✏️ Fichiers modifiables

JSON, templates, scripts, CSS, JavaScript source, documentation et médias validés.

## ⚙️ Fichiers générés

| Sortie | Source principale |
|---|---|
| HTML des recettes | `data/recettes.json` + templates |
| HTML des astuces | `data/astuces.json` + templates |
| `data/search-index.json` | `data/recettes.json` |
| `data/ingredients.json` | Données des recettes |
| QR codes | URL et scripts de génération |
| PDF | Données et modèles associés |
| Rapports d’audit | État du dépôt |

## 🔄 Cycle officiel

```text
Édition source → validation JSON → build → sorties générées → audit → contrôle humain → publication
```

## 🍲 Cycle d’une recette

```text
Création → validation éditoriale → illustration/photo → relecture → génération → audit → publication
```

## 🧺 Cycle d’une astuce

```text
Projet d’astuce → JSON → validation → illustration → génération → audit → publication
```

## 🗄️ Archives

Les dossiers `zzz_archive/` et `zzz_archives/` sont exclus des générations, audits fonctionnels, index, inventaires actifs et publications. Aucun fichier actif ne doit en dépendre.
