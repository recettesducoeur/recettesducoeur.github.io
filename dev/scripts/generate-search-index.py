#!/usr/bin/env python3
"""Génère le référentiel d’ingrédients et l’index léger de recherche.

Ce script conserve les champs historiques `ingredients` et ajoute `ingredient_refs`
sans casser les pages existantes. Il distingue explicitement les pâtes alimentaires
des pâtes culinaires (brisée, feuilletée, pizza, etc.).
"""
from pathlib import Path
import json, re, unicodedata

ROOT = Path(__file__).resolve().parents[2]
RECIPES_PATH = ROOT / "data" / "recettes.json"


def normalize(value):
    text = str(value or "").lower().replace("œ", "oe").replace("æ", "ae")
    text = "".join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn")
    text = re.sub(r"[’']", " ", text)
    return re.sub(r"[^a-z0-9]+", " ", text).strip()


def slugify(value):
    return normalize(value).replace(" ", "-") or "ingredient"


def canonical(name):
    normalized = normalize(name)
    culinary_doughs = {
        "pate brisee": "Pâte brisée",
        "pate feuilletee": "Pâte feuilletée",
        "pate a pizza": "Pâte à pizza",
        "pate sablee": "Pâte sablée",
        "pate a tarte": "Pâte à tarte",
        "pate a tartiner": "Pâte à tartiner",
    }
    for key, label in culinary_doughs.items():
        if key in normalized:
            return slugify(key), label
    if re.search(r"\bpates?\b", normalized):
        return "pates-alimentaires", "Pâtes alimentaires"

    cleaned = re.sub(
        r"\b(egoutte|egouttee|mur|mure|murs|mures|rape|rapee|cuit|cuite|frais|fraiche|sec|seche|concasse|concassee|hache|hachee)\b",
        " ",
        normalized,
    )
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return slugify(cleaned), str(name).strip()


def main():
    recipes = json.loads(RECIPES_PATH.read_text(encoding="utf-8"))
    catalog = {}

    for recipe in recipes:
        refs = {"principaux": [], "secondaires": [], "optionnels": []}
        for role in refs:
            names = list(recipe.get("ingredients", {}).get(role, []) or [])
            for item in recipe.get("ingredients_detail", {}).get(role, []) or []:
                if item.get("nom") and item["nom"] not in names:
                    names.append(item["nom"])

            seen = set()
            for name in names:
                ingredient_id, label = canonical(name)
                if ingredient_id in seen:
                    continue
                seen.add(ingredient_id)
                weight = {"principaux": 4, "secondaires": 2, "optionnels": 0.5}[role]
                refs[role].append({
                    "id": ingredient_id,
                    "nom": name,
                    "obligatoire": role == "principaux",
                    "poids": weight,
                })
                entry = catalog.setdefault(ingredient_id, {
                    "id": ingredient_id,
                    "nom": label,
                    "synonymes": set(),
                    "categorie": "a_classer",
                })
                entry["synonymes"].add(str(name).strip())

        for alias in recipe.get("ingredients", {}).get("recherche", []) or []:
            alias_normalized = normalize(alias)
            candidates = []
            for group in refs.values():
                for ref in group:
                    ref_normalized = normalize(ref["nom"])
                    if alias_normalized == ref_normalized or alias_normalized in ref_normalized or ref_normalized in alias_normalized:
                        candidates.append(ref["id"])
            if len(set(candidates)) == 1:
                catalog[candidates[0]]["synonymes"].add(str(alias).strip())

        recipe["ingredient_refs"] = refs

    ingredients = []
    for ingredient_id in sorted(catalog):
        entry = catalog[ingredient_id]
        synonyms = sorted(
            {s for s in entry["synonymes"] if normalize(s) != normalize(entry["nom"])},
            key=normalize,
        )
        ingredients.append({
            "id": entry["id"],
            "nom": entry["nom"],
            "synonymes": synonyms,
            "categorie": entry["categorie"],
            "actif": True,
        })

    RECIPES_PATH.write_text(json.dumps(recipes, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (ROOT / "data" / "ingredients.json").write_text(json.dumps({
        "version": 1,
        "description": "Référentiel central des ingrédients. Les identifiants sont stables et distincts des libellés affichés.",
        "ingredients": ingredients,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    index_fields = [
        "id", "titre", "slug", "url", "image", "resume", "categorie", "sous_categorie",
        "moment_repas", "temperature_service", "type_cuisson", "equipement", "temps_total_min",
        "personnes", "difficulte", "budget", "tags", "regimes", "allergenes",
        "reperes_alimentaires", "visible",
    ]
    index = []
    for recipe in recipes:
        item = {key: recipe.get(key) for key in index_fields if key in recipe}
        item["ingredients"] = recipe.get("ingredients", {})
        item["ingredient_refs"] = recipe.get("ingredient_refs", {})
        item["mots_cles"] = sorted(set(
            recipe.get("tags", []) + recipe.get("type_cuisson", []) + recipe.get("equipement", [])
            + recipe.get("regimes", []) + recipe.get("allergenes", [])
        ))
        index.append(item)

    (ROOT / "data" / "search-index.json").write_text(json.dumps({
        "version": 1,
        "generated_from": "data/recettes.json",
        "recipes": index,
    }, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")

    print(f"Index généré : {len(recipes)} recettes, {len(ingredients)} ingrédients.")


if __name__ == "__main__":
    main()
