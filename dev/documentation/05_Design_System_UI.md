# 🧩 05 — Design System UI

> **Document :** DOC-05  
> **Version :** V36  
> **Statut :** 🟢 Conforme  
> **Dernière mise à jour :** 12 juillet 2026  
> **Source de vérité :** Oui  
> **Documents liés :** DOC-04, DOC-09, DOC-11

## 🎯 Objectif

Centraliser les composants réutilisables afin d’éviter les variantes divergentes.

## 🧱 Composants officiels

- en-tête et navigation ;
- héros de page ;
- cartes de recette et d’astuce ;
- filtres, recherche et compteur ;
- pagination ;
- blocs de quantités, badges et tableaux ;
- navigation par ancres ;
- blocs QR code, impression et PDF ;
- messages d’état et écran vide ;
- pied de page et page 404.

## 📌 Règle

Tout nouveau composant réutilisé sur plusieurs pages doit être ajouté au Design System avant duplication.

## ♿ Accessibilité

Focus visible, navigation clavier, libellés explicites, contraste suffisant, état actif identifiable et information non portée uniquement par la couleur.

## 📄 Pagination

Elle s’applique après filtres et recherche, revient à la première page après modification des critères, n’affiche jamais une page vide et expose l’état actif aux technologies d’assistance.

## 🖨️ Impression

Masquer la navigation inutile, préserver la lisibilité A4, éviter les coupures critiques et garantir la lecture des quantités et QR codes.
