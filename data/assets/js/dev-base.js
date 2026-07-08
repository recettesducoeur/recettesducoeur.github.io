
// Interface de visualisation interne de data/recettes.json.
// Page non référencée dans la navigation principale.

document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("dev-table-body");
  const search = document.getElementById("dev-search");
  const cat = document.getElementById("dev-cat");
  const tag = document.getElementById("dev-tag");
  const visible = document.getElementById("dev-visible");
  const count = document.getElementById("dev-count");
  const raw = document.getElementById("dev-json");
  const colToggles = document.getElementById("dev-column-toggles");
  const table = document.getElementById("dev-recipes-table");

  if (!tbody || !table) return;

  const recettes = await fetch("data/recettes.json").then(r => r.json());

  const categories = [...new Set(recettes.map(r => r.categorie).filter(Boolean))].sort();
  const tags = [...new Set(recettes.flatMap(r => r.tags || []))].sort();

  cat.innerHTML = `<option value="">Toutes les catégories</option>` + categories.map(x => `<option value="${x}">${formatLabel(x)}</option>`).join("");
  tag.innerHTML = `<option value="">Tous les tags</option>` + tags.map(x => `<option value="${x}">${formatLabel(x)}</option>`).join("");

  function listValue(value) {
    if (Array.isArray(value)) return value.join(", ");
    return value ?? "";
  }

  function ingList(r, group) {
    return (r.ingredients_detail?.[group] || r.ingredients?.[group] || [])
      .map(x => typeof x === "string" ? x : `${x.nom} (${x.quantite ?? ""} ${x.unite ?? ""})`)
      .join(", ");
  }

  function zone(r) {
    return zoneRechercheRecette(r);
  }

  function row(r) {
    return `
      <tr>
        <td><code>${r.id}</code></td>
        <td><a href="${r.url}">${r.titre}</a></td>
        <td>${r.slug || ""}</td>
        <td>${formatLabel(r.categorie)}</td>
        <td>${formatLabel(r.sous_categorie)}</td>
        <td>${formatLabel(r.temperature_service)}</td>
        <td>${listValue(r.type_cuisson)}</td>
        <td>${r.temps_preparation_min ?? ""}</td>
        <td>${r.temps_cuisson_min ?? ""}</td>
        <td>${r.temps_total_min ?? ""}</td>
        <td>${r.personnes ?? ""}</td>
        <td>${formatLabel(r.difficulte)}</td>
        <td>${formatLabel(r.budget)}</td>
        <td>${ingList(r, "principaux")}</td>
        <td>${ingList(r, "secondaires")}</td>
        <td>${ingList(r, "optionnels")}</td>
        <td>${(r.tags || []).map(x => `<span class="badge">${formatLabel(x)}</span>`).join(" ")}</td>
        <td>${listValue(r.allergenes)}</td>
        <td>${r.anti_gaspi ? "✅" : "❌"}</td>
        <td>${r.recette_semaine_candidate ? "✅" : "❌"}</td>
        <td>${r.visible ? "✅" : "❌"}</td>
        <td>${r.date_creation || ""}</td>
        <td>${r.date_modification || ""}</td>
        <td>${r.url}</td>
      </tr>
    `;
  }

  function filterList() {
    const q = normaliserTexte(search.value);
    const c = cat.value;
    const t = tag.value;
    const v = visible.value;

    return recettes.filter(r => {
      return (!q || correspondRechercheDansTexte(zone(r), search.value))
        && (!c || r.categorie === c)
        && (!t || (r.tags || []).includes(t))
        && (!v || String(Boolean(r.visible)) === v);
    });
  }

  function render() {
    const list = filterList();
    count.textContent = `${list.length} recette${list.length > 1 ? "s" : ""}`;
    tbody.innerHTML = list.map(row).join("");
    raw.textContent = JSON.stringify(list, null, 2);

    initDataTable(table);
    buildColumnToggles(table, colToggles);
  }

  [search, cat, tag, visible].forEach(el => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  render();
});
