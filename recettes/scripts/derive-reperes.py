#!/usr/bin/env python3
from __future__ import annotations
import json
from pathlib import Path

def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))

def main() -> int:
    project = Path(__file__).resolve().parents[2]
    db = load(project / "recettes/data-recettes/ingredients.json")
    lookup = {x["id"]: x for x in db["ingredients"]}
    recipes = sorted((project / "recettes/json-recettes").glob("*.json"))
    output, errors = [], []

    for path in recipes:
        recipe = load(path)
        mandatory = [
            item for group in ("principaux", "secondaires")
            for item in recipe["ingredients"].get(group, [])
        ]
        unknown = [x["id"] for x in mandatory if x["id"] not in lookup]
        if unknown:
            errors.append({"recette": recipe["id"], "ingredients_inconnus": unknown})
            continue

        entries = [lookup[x["id"]] for x in mandatory]
        allergens = {
            a for entry in entries
            for a in entry["proprietes_alimentaires"].get("allergenes", [])
        }

        vegetarian = all(e["proprietes_alimentaires"].get("vegetarien") is True for e in entries)
        vegan = all(e["proprietes_alimentaires"].get("vegan") is True for e in entries)
        no_pork = all(e["proprietes_alimentaires"].get("contient_por") is False for e in entries)
        no_alcohol = all(e["proprietes_alimentaires"].get("contient_alcool") is False for e in entries)

        manual = recipe.get("repères_manuels", {})
        regimes = set()
        if vegetarian:
            regimes.add("vegetarien")
        if vegan:
            regimes.add("vegan")
        regimes.update(manual.get("regimes_forces", []))
        regimes.difference_update(manual.get("regimes_exclus", []))

        compat = set()
        if no_pork:
            compat.add("sans-porc")
        if no_alcohol:
            compat.add("sans-alcool")
        compat.update(manual.get("compatibilites_forcees", []))
        compat.difference_update(manual.get("compatibilites_exclues", []))

        allergens.update(manual.get("allergenes_forces", []))
        allergens.difference_update(manual.get("allergenes_exclus", []))

        vigilances = list(manual.get("vigilances", []))
        for item in recipe["ingredients"].get("optionnels", []):
            entry = lookup.get(item["id"])
            if not entry:
                continue
            for allergen in entry["proprietes_alimentaires"].get("allergenes", []):
                vigilances.append(
                    f"Allergène possible avec l’ingrédient optionnel « {item['libelle']} » : {allergen}."
                )
            if entry.get("risques_conditionnels"):
                vigilances.append(
                    f"Vérifier la composition de l’ingrédient optionnel « {item['libelle']} »."
                )

        output.append({
            "id": recipe["id"],
            "regimes": sorted(regimes),
            "compatibilites": sorted(compat),
            "allergenes": sorted(allergens),
            "vigilances": sorted(set(vigilances))
        })

    target = project / "recettes/data-recettes/generated/reperes-alimentaires.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(
        {"version": 1, "recettes": output, "erreurs": errors},
        ensure_ascii=False, indent=2
    ) + "\n", encoding="utf-8")
    print(f"Repères calculés : {len(output)}")
    print(f"Erreurs : {len(errors)}")
    return 1 if errors else 0

if __name__ == "__main__":
    raise SystemExit(main())
