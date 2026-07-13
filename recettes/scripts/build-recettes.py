#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import sys
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

import qrcode
from jinja2 import Environment, FileSystemLoader, StrictUndefined


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def google_search_url(title: str) -> str:
    return "https://www.google.com/search?q=" + urllib.parse.quote_plus(title)


def canonical_url(base_url: str, recipe_id: str) -> str:
    return f"{base_url.rstrip('/')}/recettes/{recipe_id}.html"


def make_qr(url: str, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image = qrcode.make(url)
    image.save(path)


def taxon_map(taxonomy: dict, family: str) -> dict[str, str]:
    return {item["id"]: item["label"] for item in taxonomy.get(family, [])}


def equipment_map(taxonomy: dict) -> dict[str, str]:
    return {
        item["id"]: item["label"]
        for group in taxonomy.get("equipements_groupes", [])
        for item in group.get("valeurs", [])
    }


def derive_dietary_data(recipe: dict, taxonomy: dict, root: Path | None = None) -> tuple[list, list, list, list]:
    if root is None:
        return [], [], [], []
    path = root / "recettes/data-recettes/generated/reperes-alimentaires.json"
    if not path.exists():
        return [], [], [], []
    data = load_json(path)
    record = next((x for x in data.get("recettes", []) if x["id"] == recipe["id"]), None)
    if not record:
        return [], [], [], []

    maps = {
        "regimes": taxon_map(taxonomy, "regimes"),
        "compatibilites": taxon_map(taxonomy, "compatibilites"),
        "allergenes": taxon_map(taxonomy, "allergenes")
    }
    regimes = [{"id": x, "label": maps["regimes"].get(x, x)} for x in record["regimes"]]
    compat = [{"id": x, "label": maps["compatibilites"].get(x, x)} for x in record["compatibilites"]]
    allergens = [{"id": x, "label": maps["allergenes"].get(x, x)} for x in record["allergenes"]]
    vigilances = [{"id": f"vigilance-{i+1}", "label": x} for i, x in enumerate(record["vigilances"])]
    return regimes, compat, allergens, vigilances

def placeholder_nutrition() -> dict:
    return {
        "nutri_score": "?",
        "statut": "a-completer",
        "lignes": [
            {"label": "Énergie", "par_personne": "À calculer", "pour_100g": "À calculer"},
            {"label": "Protéines", "par_personne": "À calculer", "pour_100g": "À calculer"},
            {"label": "Glucides", "par_personne": "À calculer", "pour_100g": "À calculer"},
            {"label": "dont sucres", "par_personne": "À calculer", "pour_100g": "À calculer"},
            {"label": "Lipides", "par_personne": "À calculer", "pour_100g": "À calculer"},
            {"label": "dont saturés", "par_personne": "À calculer", "pour_100g": "À calculer"},
            {"label": "Fibres", "par_personne": "À calculer", "pour_100g": "À calculer"},
            {"label": "Sel", "par_personne": "À calculer", "pour_100g": "À calculer"}
        ]
    }


def enrich_recipe(recipe: dict, taxonomy: dict, cfg: dict, root: Path) -> tuple[dict, dict]:
    enriched = json.loads(json.dumps(recipe, ensure_ascii=False))
    title = enriched["contenu"]["titre"]
    base_url = cfg["site"]["url_base"]

    enriched["urls"] = {"canonique": canonical_url(base_url, enriched["id"])}
    enriched["recherche_google"] = {"url": google_search_url(title)}

    regimes, compat, allergens, vigilances = derive_dietary_data(enriched, taxonomy, root)
    enriched["regimes"] = regimes
    enriched["compatibilites"] = compat
    enriched["allergenes"] = allergens
    enriched["vigilances"] = vigilances
    enriched["nutrition"] = placeholder_nutrition()

    meta = {
        "id": enriched["id"],
        "build_date": datetime.now(timezone.utc).isoformat(),
        "source_sha256": hashlib.sha256(
            json.dumps(recipe, ensure_ascii=False, sort_keys=True).encode("utf-8")
        ).hexdigest(),
        "url_canonique": enriched["urls"]["canonique"],
        "url_recherche_google": enriched["recherche_google"]["url"],
        "nutrition_statut": enriched["nutrition"]["statut"],
        "allergenes_calcules": allergens,
        "regimes_calcules": regimes,
        "compatibilites_calculees": compat
    }
    return enriched, meta


def make_search_entry(recipe: dict) -> dict:
    ingredients = []
    for group in ("principaux", "secondaires", "optionnels"):
        ingredients.extend(
            item["id"] for item in recipe["ingredients"].get(group, [])
        )

    return {
        "id": recipe["id"],
        "titre": recipe["contenu"]["titre"],
        "resume": recipe["contenu"]["accroche"],
        "url": f"recettes/{recipe['id']}.html",
        "image": f"recettes/images/{recipe['image']['fichier']}",
        "categorie": recipe["classification"]["categorie"]["id"],
        "sous_categorie": (
            recipe["classification"]["sous_categorie"]["id"]
            if recipe["classification"].get("sous_categorie")
            else None
        ),
        "caracteristiques": [
            x["id"] for x in recipe["classification"].get("caracteristiques", [])
        ],
        "temperatures": [
            x["id"] for x in recipe["classification"].get("temperature_service", [])
        ],
        "equipements": [x["id"] for x in recipe.get("equipements", [])],
        "ingredients": ingredients,
        "temps_minutes": recipe["temps"]["total_minutes"],
        "temps_tranche": recipe["temps"]["tranche"],
        "budget": recipe["budget"]["id"],
        "difficulte": recipe["difficulte"]["id"],
        "regimes": [x["id"] for x in recipe.get("regimes", [])],
        "compatibilites": [x["id"] for x in recipe.get("compatibilites", [])],
        "allergenes": [x["id"] for x in recipe.get("allergenes", [])]
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    cfg = load_json(root / "recettes/data-recettes/config-recettes.json")
    taxonomy = load_json(root / "recettes/data-recettes/taxonomie-recettes.json")

    json_dir = root / cfg["chemins"]["json_recettes"]
    template_path = root / cfg["chemins"]["template_recette"]
    html_dir = root / cfg["chemins"]["sortie_html"]
    index_path = root / cfg["chemins"]["index_recherche"]
    meta_dir = root / cfg["chemins"]["meta_calculees"]
    qr_fiche_dir = root / cfg["chemins"]["qrcodes_fiches"]
    qr_google_dir = root / cfg["chemins"]["qrcodes_google"]

    html_dir.mkdir(parents=True, exist_ok=True)
    meta_dir.mkdir(parents=True, exist_ok=True)

    env = Environment(
        loader=FileSystemLoader(str(template_path.parent)),
        undefined=StrictUndefined,
        autoescape=True,
        trim_blocks=True,
        lstrip_blocks=True
    )
    template = env.get_template(template_path.name)

    search_index = []
    errors = []

    for recipe_path in sorted(json_dir.glob("*.json")):
        try:
            source = load_json(recipe_path)
            recipe, meta = enrich_recipe(source, taxonomy, cfg, root)

            if cfg["generation"]["generer_qr_fiche"]:
                make_qr(recipe["urls"]["canonique"], qr_fiche_dir / f"{recipe['id']}.png")
            if cfg["generation"]["generer_qr_google"]:
                make_qr(recipe["recherche_google"]["url"], qr_google_dir / f"{recipe['id']}.png")

            if cfg["generation"]["generer_html"]:
                html = template.render(recette=recipe)
                (html_dir / f"{recipe['id']}.html").write_text(html, encoding="utf-8")

            save_json(meta_dir / f"{recipe['id']}.meta.json", meta)
            search_index.append(make_search_entry(recipe))

        except Exception as exc:
            errors.append({"fichier": recipe_path.name, "erreur": str(exc)})

    if cfg["generation"]["generer_index"]:
        search_index.sort(key=lambda x: x["id"], reverse=True)
        save_json(index_path, {
            "version": 1,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "count": len(search_index),
            "recettes": search_index
        })

    report = {
        "recettes_generees": len(search_index),
        "erreurs": errors
    }
    save_json(root / "recettes/data-recettes/generated/rapport-build.json", report)

    print(f"Recettes générées : {len(search_index)}")
    print(f"Erreurs : {len(errors)}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
