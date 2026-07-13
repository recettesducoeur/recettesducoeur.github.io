#!/usr/bin/env python3
from pathlib import Path
import re, json, sys

ROOT = Path(__file__).resolve().parents[2]
ARCHIVE_NAMES = {"zzz_archive", "zzz_archives"}


def ignored(path: Path) -> bool:
    return any(part in ARCHIVE_NAMES for part in path.relative_to(ROOT).parts)


def resolve_ref(source: Path, ref: str):
    clean = ref.split('#')[0].split('?')[0]
    if not clean or ref.startswith(('http:', 'https:', 'mailto:', 'tel:', '#', 'javascript:', 'data:')):
        return None
    return (source.parent / clean).resolve()

broken = []
for pattern, regex in [
    ('*.html', r'(?:href|src)=["\']([^"\']+)'),
    ('*.md', r'!?(?:\[[^\]]*\])\(([^)]+)\)'),
]:
    for p in ROOT.rglob(pattern):
        if ignored(p):
            continue
        text = p.read_text(encoding='utf-8', errors='ignore')
        for ref in re.findall(regex, text):
            ref = ref.strip().strip('<>')
            target = resolve_ref(p, ref)
            if target is None:
                continue
            try:
                target.relative_to(ROOT.resolve())
            except ValueError:
                continue
            if not target.exists():
                broken.append({'file': str(p.relative_to(ROOT)), 'ref': ref})

out = ROOT / 'data/audit/audit_site_local.json'
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps({'broken_links': broken}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Audit terminé : {len(broken)} lien(s) cassé(s).')
sys.exit(1 if broken else 0)
