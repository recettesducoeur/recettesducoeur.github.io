#!/usr/bin/env python3
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[2]
data=json.loads((ROOT/'data/astuces.json').read_text(encoding='utf-8'))
print(f'{len(data)} astuces chargées. HTML + QR uniquement, aucun PDF.')
