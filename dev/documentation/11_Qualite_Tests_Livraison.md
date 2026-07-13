# ✅ 11 — Qualité, tests et livraison

> **Document :** DOC-11  
> **Version :** V36  
> **Statut :** 🟢 Conforme  
> **Dernière mise à jour :** 12 juillet 2026  
> **Source de vérité :** Oui  
> **Documents liés :** DOC-02, DOC-09, DOC-10, DOC-99

## 🧪 Niveaux d’audit

| Niveau | Effet |
|---|---|
| Erreur | Bloque la livraison |
| Avertissement | Doit être examiné |
| Information | Indicateur sans blocage |

## ⛔ Critères bloquants

JSON invalide, identifiant dupliqué, lien interne cassé, fichier obligatoire absent, page principale inaccessible, erreur JavaScript bloquante, dépendance à une archive, lien vers l’ancien sous-chemin GitHub Pages, build incomplet, index invalide ou documentation incohérente.

## ⚠️ Avertissements admis

Ancien nom d’asset non conforme, duplication PNG/WebP justifiée, image temporaire identifiée, audit historique, amélioration future ou dette technique documentée.

## ✅ Checklist de publication

- [ ] Build terminé sans erreur
- [ ] Index de recherche régénéré
- [ ] Audit sans erreur bloquante
- [ ] Aucun lien vers les archives ou l’ancien sous-chemin
- [ ] Accueil, recettes, astuces, recherche, filtres, pagination et 404 testés
- [ ] Contrôles mobile 320/375–430/768/1024/1440 px
- [ ] Navigation clavier et contrastes vérifiés
- [ ] Impression A4, PDF et QR codes vérifiés
- [ ] Changelog et inventaire du livrable actualisés

## 📦 Convention de version

Version majeure : `V36`. Correctif limité : `V36.1`. Livrable : `lesrecettesducoeur_v36.zip`.

## 📁 Contenu du ZIP

Site public, données, développement, documentation, scripts, templates, assets actifs, `.nojekyll` et changelog. Exclure caches, fichiers temporaires, `.DS_Store`, `Thumbs.db`, `__pycache__` et `.pyc`.

Les archives historiques peuvent être conservées mais restent inactives et sans dépendance.

## 🧾 Inventaire V36

- Version : V36
- Date : 12 juillet 2026
- URL cible : `https://recettesducoeur.github.io/`
- Contenus : 14 recettes et 11 astuces
- Audit final : 0 lien cassé, build complet réussi
- Livrable : `lesrecettesducoeur_v36.zip`

## 🧱 Problèmes connus non bloquants

- anciens noms d’assets à normaliser progressivement ;
- réorganisation physique complète des mascottes non réalisée ;
- pagination dans l’URL non implémentée ;
- configuration centrale `data/config.json` reportée ;
- anciens rapports d’audit à archiver progressivement.

## 👁️ Validation finale

Audit automatique conforme + contrôle humain conforme = version livrable.
