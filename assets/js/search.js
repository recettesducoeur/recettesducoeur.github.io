const FILTER_FIELDS = {
  categorie: { label: "Catégorie", type: "single", getter: r => r.categorie },
  sous_categorie: { label: "Sous-catégorie", type: "single", getter: r => r.sous_categorie },
  temperature: { label: "Température", type: "single", getter: r => r.temperature_service },
  cuisson: { label: "Cuisson", type: "array", getter: r => r.type_cuisson || [] },
  budget: { label: "Budget", type: "single", getter: r => r.budget },
  difficulte: { label: "Difficulté", type: "single", getter: r => r.difficulte },
  moment: { label: "Moment du repas", type: "array", getter: r => r.moment_repas || [] },
  equipement: { label: "Équipement", type: "array", getter: r => r.equipement || [] },
  regime: { label: "Régime", type: "array", getter: r => r.regimes || [] },
  allergene: { label: "Allergène", type: "array", getter: r => r.allergenes || [] },
  repere: { label: "Repère alimentaire", type: "array", getter: r => r.reperes_alimentaires || [] },
  tag: { label: "Tag", type: "array", getter: r => r.tags || [] }
};

function parseIng(v) {
  return String(v || "")
    .split(/[;,\n]+/)
    .map(x => x.trim())
    .filter(Boolean);
}

function score(r, ingredientsUtilisateur) {
  const userZone = ingredientsUtilisateur.map(x => [x, ingredientPrincipal(x)].join(" ")).join(" ");
  const userTokens = new Set(tokensIngredient(userZone));
  const userText = tokensIngredient(userZone).join(" ");

  const principaux = r.ingredients?.principaux || [];
  const secondaires = r.ingredients?.secondaires || [];
  const necessaires = [...principaux, ...secondaires];

  const disponibles = necessaires.filter(i => ingredientDisponible(i, userTokens, userText));
  const manquants = necessaires.filter(i => !ingredientDisponible(i, userTokens, userText));
  const principauxManquants = principaux.filter(i => !ingredientDisponible(i, userTokens, userText));

  return {
    score: necessaires.length ? disponibles.length / necessaires.length : 0,
    recettePossible: principauxManquants.length === 0,
    disponibles,
    manquants,
    principauxManquants
  };
}

function opts(vals, label) {
  const u = [...new Set(vals.filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), "fr"));

  return `<option value="">${label}</option>` +
    u.map(v => `<option value="${escapeHtml(v)}">${formatLabel(v)}</option>`).join("");
}

function valuesFor(recettes, field) {
  const def = FILTER_FIELDS[field];
  if (!def) return [];

  return recettes.flatMap(r => {
    const raw = def.getter(r);
    return Array.isArray(raw) ? raw : [raw];
  }).filter(Boolean);
}

function selectedTagValues(container) {
  return [...container.querySelectorAll("input[type='checkbox']:checked")].map(x => x.value);
}

function selectedQuickFilters() {
  const map = {
    categorie: "filter-categorie",
    sous_categorie: "filter-sous-categorie",
    temperature: "filter-temperature",
    cuisson: "filter-cuisson",
    budget: "filter-budget",
    difficulte: "filter-difficulte",
    moment: "filter-moment",
    equipement: "filter-equipement",
    regime: "filter-regime",
    allergene: "filter-allergene"
  };

  const out = {};
  for (const [field, id] of Object.entries(map)) {
    const v = document.getElementById(id)?.value;
    if (v) out[field] = [v];
  }

  const tagBox = document.getElementById("search-tags");
  const tags = tagBox ? selectedTagValues(tagBox) : [];
  if (tags.length) out.tag = tags;

  return out;
}

function filterRecipesByMap(recettes, filters) {
  const entries = Object.entries(filters).filter(([, values]) => values && values.length);
  if (!entries.length) return recettes;

  return recettes.filter(r => entries.every(([field, values]) => {
    const def = FILTER_FIELDS[field];
    if (!def) return true;

    const raw = def.getter(r);
    const vals = Array.isArray(raw) ? raw : [raw];
    const normalizedVals = vals.map(v => normaliserTexte(v));

    return values.every(v => normalizedVals.includes(normaliserTexte(v)));
  }));
}

function paramsFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const filters = {};

  for (const field of Object.keys(FILTER_FIELDS)) {
    const aliases = [field];

    if (field === "tag") aliases.push("tags");
    if (field === "categorie") aliases.push("category");
    if (field === "sous_categorie") aliases.push("souscategorie", "sous-categorie");
    if (field === "cuisson") aliases.push("type_cuisson");
    if (field === "temperature") aliases.push("temperature_service");
    if (field === "difficulte") aliases.push("difficulty");
    if (field === "allergene") aliases.push("allergenes");
    if (field === "regime") aliases.push("regimes");

    const values = aliases.flatMap(a =>
      params.getAll(a).flatMap(v => String(v).split(","))
    ).map(v => decodeURIComponent(String(v || "").trim())).filter(Boolean);

    if (values.length) filters[field] = [...new Set(values)];
  }

  return filters;
}

function activateSearchTab(name) {
  const target = document.querySelector(`[data-tab="${name}"]`);
  document.querySelectorAll("[data-tab]").forEach(x => x.classList.toggle("active", x === target));
  document.querySelectorAll("[data-panel]").forEach(p => p.classList.toggle("hidden", p.dataset.panel !== name));
}

function setSelect(id, value) {
  const el = document.getElementById(id);
  if (!el || !value) return;

  const wanted = normaliserTexte(value);
  const opt = [...el.options].find(o => normaliserTexte(o.value) === wanted);
  if (opt) el.value = opt.value;
}

function applyFiltersToControls(filters) {
  setSelect("filter-categorie", filters.categorie?.[0]);
  setSelect("filter-sous-categorie", filters.sous_categorie?.[0]);
  setSelect("filter-temperature", filters.temperature?.[0]);
  setSelect("filter-cuisson", filters.cuisson?.[0]);
  setSelect("filter-budget", filters.budget?.[0]);
  setSelect("filter-difficulte", filters.difficulte?.[0]);
  setSelect("filter-moment", filters.moment?.[0]);
  setSelect("filter-equipement", filters.equipement?.[0]);
  setSelect("filter-regime", filters.regime?.[0]);
  setSelect("filter-allergene", filters.allergene?.[0]);

  const tagBox = document.getElementById("search-tags");
  if (tagBox && filters.tag?.length) {
    const wanted = new Set(filters.tag.map(normaliserTexte));
    tagBox.querySelectorAll("input[type='checkbox']").forEach(input => {
      input.checked = wanted.has(normaliserTexte(input.value));
    });
  }
}

function renderUrlFilterNotice(filters) {
  const box = document.getElementById("url-filter-notice");
  if (!box) return;

  const parts = Object.entries(filters).flatMap(([field, values]) => {
    const label = FILTER_FIELDS[field]?.label || field;
    return values.map(v => `${label} : ${formatLabel(v)}`);
  });

  box.innerHTML = parts.length
    ? `<div class="notice">Filtre actif : <strong>${parts.map(escapeHtml).join(" · ")}</strong></div>`
    : "";
}

function fillQuickFilters(recettes) {
  const map = {
    "filter-categorie": ["categorie", "Toutes les catégories"],
    "filter-sous-categorie": ["sous_categorie", "Toutes les sous-catégories"],
    "filter-temperature": ["temperature", "Toutes les températures"],
    "filter-cuisson": ["cuisson", "Tous les types de cuisson"],
    "filter-budget": ["budget", "Tous les budgets"],
    "filter-difficulte": ["difficulte", "Toutes les difficultés"],
    "filter-moment": ["moment", "Tous les moments"],
    "filter-equipement": ["equipement", "Tous les équipements"],
    "filter-regime": ["regime", "Tous les régimes"],
    "filter-allergene": ["allergene", "Tous les allergènes"]
  };

  for (const [id, [field, label]] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = opts(valuesFor(recettes, field), label);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const recettes = await chargerRecettes();
  const res = document.getElementById("resultats-recherche");
  if (!res) return;

  function rr(list) {
    res.innerHTML = list.length
      ? list.map(r => carte(r, r._matchDetails)).join("")
      : `<div class="notice">Aucune recette trouvée.</div>`;
  }

  document.querySelectorAll("[data-tab]").forEach(b => {
    b.addEventListener("click", () => {
      activateSearchTab(b.dataset.tab);
      rr(recettes);
    });
  });

  if (!recettes.length) {
    activateSearchTab("nom");
    return;
  }

  fillQuickFilters(recettes);

  document.getElementById("search-nom")?.addEventListener("input", e => {
    rr(recettes.filter(r => correspondRechercheRecette(r, e.target.value)));
  });

  document.getElementById("search-ingredient")?.addEventListener("input", e => {
    const query = e.target.value;
    rr(recettes.filter(r => correspondRechercheIngredient(ingredientsRechercheRecette(r), query)));
  });

  document.getElementById("search-mes-ingredients")?.addEventListener("input", e => {
    const ings = parseIng(e.target.value);
    if (!ings.length) return rr(recettes);

    rr(recettes.map(r => ({ ...r, _matchDetails: score(r, ings) }))
      .sort((a, b) =>
        (+b._matchDetails.recettePossible - +a._matchDetails.recettePossible) ||
        b._matchDetails.score - a._matchDetails.score
      )
    );
  });

  const cat = document.getElementById("search-categorie");
  if (cat) {
    cat.innerHTML = opts(valuesFor(recettes, "categorie"), "Toutes les catégories");
    cat.onchange = () => rr(cat.value ? filterRecipesByMap(recettes, { categorie: [cat.value] }) : recettes);
  }

  const temp = document.getElementById("search-temperature");
  if (temp) {
    temp.innerHTML = opts(valuesFor(recettes, "temperature"), "Chaud / froid");
    temp.onchange = () => rr(temp.value ? filterRecipesByMap(recettes, { temperature: [temp.value] }) : recettes);
  }

  const cui = document.getElementById("search-cuisson");
  if (cui) {
    cui.innerHTML = opts(valuesFor(recettes, "cuisson"), "Tous les types de cuisson");
    cui.onchange = () => rr(cui.value ? filterRecipesByMap(recettes, { cuisson: [cui.value] }) : recettes);
  }

  const tagBox = document.getElementById("search-tags");
  if (tagBox) {
    const allTags = [...new Set(valuesFor(recettes, "tag"))]
      .sort((a, b) => String(a).localeCompare(String(b), "fr"));

    tagBox.innerHTML = allTags.map(t => `
      <label class="check-pill">
        <input type="checkbox" value="${escapeHtml(t)}">
        <span>${formatLabel(t)}</span>
      </label>
    `).join("");

    tagBox.addEventListener("change", () => {
      rr(filterRecipesByMap(recettes, { tag: selectedTagValues(tagBox) }));
    });
  }

  document.querySelectorAll("#filter-categorie,#filter-sous-categorie,#filter-temperature,#filter-cuisson,#filter-budget,#filter-difficulte,#filter-moment,#filter-equipement,#filter-regime,#filter-allergene")
    .forEach(el => el.addEventListener("change", () => rr(filterRecipesByMap(recettes, selectedQuickFilters()))));

  document.getElementById("filter-reset")?.addEventListener("click", () => {
    document.querySelectorAll("#filter-categorie,#filter-sous-categorie,#filter-temperature,#filter-cuisson,#filter-budget,#filter-difficulte,#filter-moment,#filter-equipement,#filter-regime,#filter-allergene")
      .forEach(el => el.value = "");
    document.querySelectorAll("#search-tags input[type='checkbox']").forEach(x => x.checked = false);
    history.replaceState(null, "", "recherche.html");
    renderUrlFilterNotice({});
    rr(recettes);
  });

  const urlFilters = paramsFromUrl();
  if (Object.keys(urlFilters).length) {
    applyFiltersToControls(urlFilters);
    renderUrlFilterNotice(urlFilters);

    if (urlFilters.tag && Object.keys(urlFilters).length === 1) {
      activateSearchTab("tags");
    } else {
      activateSearchTab("filtres");
    }

    rr(filterRecipesByMap(recettes, urlFilters));
    return;
  }

  activateSearchTab("nom");
  rr(recettes);
});
