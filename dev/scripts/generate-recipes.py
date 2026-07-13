#!/usr/bin/env python3
"""Régénère les fiches recettes depuis data/recettes.json et le template du projet.
Le générateur complet utilisé pour V33 est documenté dans build-site.py."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[2]
data=json.loads((ROOT/'data/recettes.json').read_text(encoding='utf-8'))
print(f'{len(data)} recettes chargées. Utiliser build-site.py pour une reconstruction complète.')
