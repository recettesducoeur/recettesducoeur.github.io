#!/usr/bin/env python3
from pathlib import Path
import json,qrcode
ROOT=Path(__file__).resolve().parents[2]
for dataset,folder in [('recettes.json','recettes'),('astuces.json','astuces')]:
 data=json.loads((ROOT/'data'/dataset).read_text(encoding='utf-8'))
 for item in data:
  if not item.get('visible'): continue
  ident=item['id']; url=f'https://recettesducoeur.github.io/{folder}/{ident}.html'
  out=ROOT/folder/'qrcodes'/f'{ident}.png'; out.parent.mkdir(parents=True,exist_ok=True)
  qrcode.make(url).save(out)
print('QR codes PNG régénérés.')
