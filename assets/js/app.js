function ajusterBandeauFixePC() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const setHeight = () => {
    const h = Math.ceil(header.getBoundingClientRect().height || 96);
    document.documentElement.style.setProperty("--header-height", `${h}px`);
  };

  setHeight();
  window.addEventListener("resize", setHeight);
  window.addEventListener("orientationchange", setHeight);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(setHeight);
    observer.observe(header);
  }
}

// Normalisation de recherche : casse, accents, apostrophes, pluriel/singulier.
function normaliserTexte(value) {
  return String(value || "")
    .toLowerCase()
    .replaceAll("œ", "oe")
    .replaceAll("æ", "ae")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function singulariserMot(mot) {
  let m = String(mot || "").trim();
  if (m.length <= 3) return m;

  const exceptions = {
    "oeufs": "oeuf",
    "legumes": "legume",
    "pates": "pate",
    "tomates": "tomate",
    "courgettes": "courgette",
    "pommes": "pomme",
    "bananes": "banane",
    "oignons": "oignon",
    "herbes": "herbe",
    "tranches": "tranche",
    "pieces": "piece",
    "morceaux": "morceau",
    "noix": "noix",
    "riz": "riz"
  };

  if (exceptions[m]) return exceptions[m];

  if (m.endsWith("s") && !m.endsWith("is") && !m.endsWith("us")) {
    return m.slice(0, -1);
  }

  if (m.endsWith("x") && m.length > 4) {
    return m.slice(0, -1);
  }

  return m;
}

const MOTS_DESCRIPTIFS_INGREDIENTS = new Set([
  "egoutte", "egouttee", "egouttes", "egouttees",
  "mur", "mure", "murs", "mures",
  "pure", "puree", "mixee", "mixees",
  "cuit", "cuite", "cuits", "cuites",
  "cru", "crue", "crus", "crues",
  "frais", "fraiche", "fraiches",
  "sec", "seche", "secs", "seches",
  "rape", "rapee", "rapes", "rapees",
  "hache", "hachee", "haches", "hachees",
  "coupe", "coupee", "coupes", "coupees",
  "concasse", "concassee", "concasses", "concassees",
  "entier", "entiere", "entiers", "entieres",
  "liquide", "epaisse", "epais",
  "petit", "petite", "petits", "petites",
  "gros", "grosse", "grosses",
  "beau", "belle", "beaux", "belles",
  "bien", "tres",
  "en", "de", "du", "des", "d", "la", "le", "les", "un", "une", "au", "aux", "a"
]);

const INGREDIENTS_COMPOSES = [
  "pomme de terre",
  "pommes de terre",
  "chou fleur",
  "chou-fleur",
  "haricot vert",
  "haricots verts",
  "lait de coco",
  "sauce tomate",
  "concentre tomate",
  "concentre de tomate",
  "huile olive",
  "huile d olive"
];

function ingredientPrincipal(value) {
  const brut = String(value || "").split(/[,(;:]/)[0];
  const norm = normaliserTexte(brut);
  if (!norm) return "";

  for (const compose of INGREDIENTS_COMPOSES) {
    const c = normaliserTexte(compose);
    if (norm.includes(c)) {
      return tokensRecherche(c).join(" ");
    }
  }

  const tokens = norm
    .split(" ")
    .map(singulariserMot)
    .filter(t => t.length > 1 && !MOTS_DESCRIPTIFS_INGREDIENTS.has(t));

  if (!tokens.length) return norm.split(" ")[0] || "";

  // On garde les deux premiers mots utiles au maximum :
  // "thon égoutté" -> "thon" ; "banane mûre" -> "banane" ;
  // "chou fleur" reste géré plus haut comme ingrédient composé.
  return [...new Set(tokens)].slice(0, 2).join(" ");
}

function tokensRecherche(value) {
  const base = normaliserTexte(value);
  if (!base) return [];

  const tokens = base.split(" ").filter(Boolean);
  const variants = [];

  for (const token of tokens) {
    variants.push(token);
    const singular = singulariserMot(token);
    if (singular && singular !== token) variants.push(singular);
  }

  if (tokens.length > 1) {
    variants.push(tokens.join(" "));
    variants.push(tokens.map(singulariserMot).join(" "));
  }

  return [...new Set(variants.filter(Boolean))];
}

function tokensIngredient(value) {
  const principal = ingredientPrincipal(value);
  return tokensRecherche([value, principal].filter(Boolean).join(" "));
}

function ingredientsRechercheRecette(recette) {
  const values = [
    ...(recette.ingredients?.principaux || []),
    ...(recette.ingredients?.secondaires || []),
    ...(recette.ingredients?.optionnels || []),
    ...(recette.ingredients?.recherche || [])
  ];

  for (const group of ["principaux", "secondaires", "optionnels"]) {
    for (const item of recette.ingredients_detail?.[group] || []) {
      if (item?.nom) values.push(item.nom);
    }
  }

  const simplified = values.map(ingredientPrincipal).filter(Boolean);
  return [...values, ...simplified].join(" ");
}

function zoneRechercheRecette(recette) {
  return [
    recette.id,
    recette.titre,
    recette.slug,
    recette.resume,
    recette.explication,
    recette.categorie,
    recette.sous_categorie,
    recette.temperature_service,
    recette.difficulte,
    recette.budget,
    ...(recette.moment_repas || []),
    ...(recette.type_cuisson || []),
    ...(recette.equipement || []),
    ...(recette.tags || []),
    ...(recette.regimes || []),
    ...(recette.allergenes || []),
    ingredientsRechercheRecette(recette)
  ].join(" ");
}

function correspondRechercheDansTexte(zone, query) {
  const qTokens = tokensRecherche(query).filter(t => t.length > 1);
  if (!qTokens.length) return true;

  const zTokens = tokensRecherche(zone);
  const zSet = new Set(zTokens);
  const zText = zTokens.join(" ");

  return qTokens.every(q =>
    zSet.has(q) ||
    zText.includes(q) ||
    zTokens.some(z => z.startsWith(q) || z.includes(q))
  );
}

function correspondRechercheIngredient(zone, query) {
  const simple = ingredientPrincipal(query);
  return correspondRechercheDansTexte(zone, query) ||
    (!!simple && correspondRechercheDansTexte(zone, simple));
}

function correspondRechercheRecette(recette, query) {
  return correspondRechercheDansTexte(zoneRechercheRecette(recette), query);
}

function ingredientDisponible(ingredientName, userTokens, userText) {
  const tokens = tokensIngredient(ingredientName).filter(t => t.length > 2);
  if (!tokens.length) return false;

  const phraseVariants = tokens.filter(t => t.includes(" "));
  if (phraseVariants.some(p => userText.includes(p))) return true;

  return tokens.some(t => userTokens.has(t));
}

document.addEventListener("DOMContentLoaded", () => {
  ajusterBandeauFixePC();
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-main-nav]");

  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }

  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach(a => {
    if (a.getAttribute("href") === current) a.classList.add("active");
  });

  afficherAccueil();
  afficherCatalogue();
});

function formatLabel(v) {
  return String(v || "")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function tagBadge(tag) {
  return filterBadge(formatLabel(tag), "tag", tag);
}" title="Voir les recettes avec le tag ${escapeHtml(formatLabel(tag))}">${formatLabel(tag)}</a>`;
}

function filterSearchHref(field, value) {
  return `recherche.html?${encodeURIComponent(field)}=${encodeURIComponent(value)}`;
}

function filterBadge(label, field, value) {
  return `<a class="badge filter-link" href="${filterSearchHref(field, value)}" title="Filtrer : ${escapeHtml(label)}">${escapeHtml(label)}</a>`;
}

async function chargerRecettes() {
  return fetch("data/recettes.json")
    .then(r => r.json())
    .then(a => a.filter(r => r.visible !== false));
}

function carte(r, d = null) {
  const tags = (r.tags || []).slice(0, 4)
    .map(t => tagBadge(t))
    .join("");

  const details = d ? `
    <div class="match-details">
      <div>⭐ Score : ${Math.round(d.score * 100)} %</div>
      <div class="present">✅ Présents : ${d.disponibles.length ? d.disponibles.join(", ") : "aucun"}</div>
      <div class="missing">❌ Manquants : ${d.manquants.length ? d.manquants.join(", ") : "aucun"}</div>
    </div>
  ` : "";

  return `
    <article class="recipe-card">
      <img src="${r.image}" alt="Illustration : ${escapeHtml(r.titre)}" loading="lazy">
      <div class="recipe-card-content">
        <h3>${escapeHtml(r.titre)}</h3>
        <p>${escapeHtml(r.resume)}</p>
        <div class="meta">
          <span>⏱️ ${r.temps_total_min} min</span>
          <span>👥 ${r.personnes}</span>
          <span>🍽️ ${filterBadge(formatLabel(r.categorie), "categorie", r.categorie)}</span>
          <span>🔥 ${(r.type_cuisson || []).map(c => filterBadge(formatLabel(c), "cuisson", c)).join(" ")}</span>
        </div>
        <div class="badges">${tags}</div>
        ${details}
        <a class="button" href="${r.url}">Voir la recette</a>
      </div>
    </article>
  `;
}

function render(list, id) {
  const c = document.getElementById(id);
  if (!c) return;

  c.innerHTML = list.length
    ? list.map(r => carte(r, r._matchDetails)).join("")
    : `<div class="notice">Aucune recette trouvée.</div>`;
}

async function afficherAccueil() {
  const c = document.getElementById("recettes-accueil");
  if (!c) return;

  const r = await chargerRecettes();
  c.innerHTML = r.slice(0, 3).map(x => carte(x)).join("");
}

async function afficherCatalogue() {
  const c = document.getElementById("liste-recettes");
  if (!c) return;

  const recettes = await chargerRecettes();
  render(recettes, "liste-recettes");

  const inp = document.getElementById("filtre-catalogue");
  if (inp) {
    inp.addEventListener("input", () => {
      render(recettes.filter(r => correspondRechercheRecette(r, inp.value)), "liste-recettes");
    });
  }
}
