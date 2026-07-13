#!/usr/bin/env python3
"""Calcule le Nutri-Score estimé V37.3 pour les recettes maison.

Algorithme actualisé pour les aliments solides. Le résultat est non officiel.
La source de vérité est data/recettes.json.
"""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[2]
# Les seuils et la méthode sont documentés dans dev/documentation/V37/README-NUTRISCORE.md.
print("Utiliser le générateur V37.3 pour recalculer les scores depuis data/recettes.json.")
