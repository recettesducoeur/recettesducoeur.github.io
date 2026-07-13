#!/usr/bin/env python3
"""Point d’entrée de construction locale.
Exécute les générateurs de données/QR puis l’audit. Les templates V33 restent la référence structurelle."""
from pathlib import Path
import subprocess,sys
HERE=Path(__file__).resolve().parent
for script in ['generate-recipes.py','generate-astuces.py','generate-search-index.py','generate-qrcodes.py','audit-site.py']:
 print(f'== {script} =='); subprocess.run([sys.executable,str(HERE/script)],check=True)
print('Build local terminé.')
