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

const LABELS = {
  "sans_porc": "Sans porc",
  "vegetarien": "Végétarien",
  "vegetarien_possible": "Végétarien possible",
  "vegetalien": "Végétalien",
  "vegan_possible": "Vegan possible",
  "sans_viande": "Sans viande",
  "contient_poisson": "Contient poisson",
  "contient_lait": "Contient lait",
  "contient_oeuf": "Contient œuf",
  "contient_gluten": "Contient gluten",
  "contient_arachides": "Contient arachides",
  "contient_soja": "Contient soja",
  "contient_fruits_a_coque": "Contient fruits à coque",
  "contient_crustaces": "Contient crustacés",
  "contient_mollusques": "Contient mollusques",
  "contient_celeri": "Contient céleri",
  "contient_moutarde": "Contient moutarde",
  "contient_sesame": "Contient sésame",
  "contient_sulfites": "Contient sulfites",
  "contient_lupin": "Contient lupin",
  "sans_gluten_possible": "Sans gluten possible",
  "sans_lait_possible": "Sans lait possible",
  "sans_oeuf_possible": "Sans œuf possible",
  "sans_poisson_possible": "Sans poisson possible",
  "sans_arachides_possible": "Sans arachides possible",
  "sans_soja_possible": "Sans soja possible",
  "sans_fruits_a_coque_possible": "Sans fruits à coque possible",
  "sans_crustaces_possible": "Sans crustacés possible",
  "sans_mollusques_possible": "Sans mollusques possible",
  "sans_celeri_possible": "Sans céleri possible",
  "sans_moutarde_possible": "Sans moutarde possible",
  "sans_sesame_possible": "Sans sésame possible",
  "sans_sulfites_possible": "Sans sulfites possible",
  "sans_lupin_possible": "Sans lupin possible",
  "anti_gaspi": "Anti-gaspi",
  "sans_cuisson": "Sans cuisson",
  "fruits_a_coque": "Fruits à coque",
  "crustaces": "Crustacés",
  "micro_ondes": "Micro-ondes",
  "froid_ou_tiede": "Froid ou tiède",
  "economique": "Économique",
  "facile": "Facile",
  "plat": "Plat",
  "dessert": "Dessert",
  "entree": "Entrée"
};

function formatLabel(value) {
  const raw = String(value || "");
  if (LABELS[raw]) return LABELS[raw];
  return raw
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\p{L}/gu, c => c.toUpperCase());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function pageDepthPrefix() {
  const path = window.location.pathname;
  const parts = path.split("/").filter(Boolean);
  const fileLike = parts.length && /\.[a-z0-9]+$/i.test(parts[parts.length - 1]);
  const dirs = fileLike ? parts.slice(0, -1) : parts;
  if (!dirs.length) return "";
  return "../".repeat(dirs.length);
}

function rootPrefix() {
  return pageDepthPrefix();
}

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
    oeufs: "oeuf",
    legumes: "legume",
    pates: "pate",
    tomates: "tomate",
    courgettes: "courgette",
    pommes: "pomme",
    bananes: "banane",
    oignons: "oignon",
    herbes: "herbe",
    tranches: "tranche",
    pieces: "piece",
    morceaux: "morceau",
    noix: "noix",
    riz: "riz"
  };

  if (exceptions[m]) return exceptions[m];
  if (m.endsWith("s") && !m.endsWith("is") && !m.endsWith("us")) return m.slice(0, -1);
  if (m.endsWith("x") && m.length > 4) return m.slice(0, -1);
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
    if (norm.includes(c)) return tokensRecherche(c).join(" ");
  }

  const tokens = norm
    .split(" ")
    .map(singulariserMot)
    .filter(t => t.length > 1 && !MOTS_DESCRIPTIFS_INGREDIENTS.has(t));

  if (!tokens.length) return norm.split(" ")[0] || "";
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

async function chargerRecettes() {
  const prefix = rootPrefix();

  try {
    const response = await fetch(`${prefix}data/recettes.json`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.filter(r => r.visible !== false);
  } catch (error) {
    console.error("Erreur de chargement recettes :", error);
    document.querySelectorAll("[data-json-error]").forEach(node => {
      node.innerHTML = `<div class="notice">⚠️ Les données dynamiques n’ont pas pu être chargées. Les recettes statiques restent disponibles. Vérifiez que <code>data/recettes.json</code> est bien à la racine du dépôt.</div>`;
    });
    return [];
  }
}

function filterSearchHref(field, value) {
  const prefix = rootPrefix();
  return `${prefix}recherche.html?${encodeURIComponent(field)}=${encodeURIComponent(value)}`;
}

function filterBadge(label, field, value) {
  return `<a class="badge filter-link" href="${filterSearchHref(field, value)}" title="Filtrer : ${escapeHtml(label)}">${escapeHtml(label)}</a>`;
}

function tagBadge(tag) {
  return filterBadge(formatLabel(tag), "tag", tag);
}

function normalizeAssetPath(path) {
  const prefix = rootPrefix();
  const raw = String(path || "");
  if (!raw || raw.startsWith("http") || raw.startsWith("../") || raw.startsWith("/")) return raw;
  return prefix + raw;
}

function carte(r, d = null) {
  const tags = (r.tags || []).slice(0, 4).map(t => tagBadge(t)).join("");

  const details = d ? `
    <div class="match-details">
      <div>⭐ Score : ${Math.round(d.score * 100)} %</div>
      <div class="present">✅ Présents : ${d.disponibles.length ? d.disponibles.map(escapeHtml).join(", ") : "aucun"}</div>
      <div class="missing">❌ Manquants : ${d.manquants.length ? d.manquants.map(escapeHtml).join(", ") : "aucun"}</div>
    </div>
  ` : "";

  return `
    <article class="recipe-card">
      <img src="${normalizeAssetPath(r.image)}" alt="Illustration : ${escapeHtml(r.titre)}" loading="lazy">
      <div class="recipe-card-content">
        <h3>${escapeHtml(r.titre)}</h3>
        <p>${escapeHtml(r.resume)}</p>
        <div class="meta">
          <span>⏱️ ${escapeHtml(r.temps_total_min)} min</span>
          <span>👥 ${escapeHtml(r.personnes)}</span>
          <span>🍽️ ${filterBadge(formatLabel(r.categorie), "categorie", r.categorie)}</span>
          <span>🔥 ${(r.type_cuisson || []).map(c => filterBadge(formatLabel(c), "cuisson", c)).join(" ")}</span>
        </div>
        <div class="badges">${tags}</div>
        ${details}
        <a class="button" href="${normalizeAssetPath(r.url)}">Voir la recette</a>
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
  if (r.length) c.innerHTML = r.slice(0, 3).map(x => carte(x)).join("");
}

function paginateList(list, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: list.slice(start, start + pageSize),
    page: safePage,
    totalPages
  };
}

function renderPagination(list, currentPage, pageSize, onPageChange) {
  const nav = document.getElementById("pagination-recettes");
  const count = document.getElementById("catalogue-count");
  if (!nav) return;

  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  if (count) {
    count.textContent = `${list.length} recette${list.length > 1 ? "s" : ""} — ${pageSize} maximum par page.`;
  }

  if (totalPages <= 1) {
    nav.innerHTML = "";
    return;
  }

  const buttons = [];
  buttons.push(`<button type="button" class="page-button" data-page="${Math.max(1, currentPage - 1)}" ${currentPage === 1 ? "disabled" : ""}>← Précédent</button>`);

  for (let i = 1; i <= totalPages; i++) {
    buttons.push(`<button type="button" class="page-button ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`);
  }

  buttons.push(`<button type="button" class="page-button" data-page="${Math.min(totalPages, currentPage + 1)}" ${currentPage === totalPages ? "disabled" : ""}>Suivant →</button>`);

  nav.innerHTML = buttons.join("");
  nav.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => onPageChange(Number(button.dataset.page)));
  });
}

async function afficherCatalogue() {
  const c = document.getElementById("liste-recettes");
  if (!c) return;

  const recettes = await chargerRecettes();
  const pageSize = Number(c.dataset.pageSize || 20);
  let currentPage = 1;
  let filtered = recettes.length ? recettes : [];

  function renderPage(page = 1) {
    currentPage = page;
    if (!filtered.length) {
      render([], "liste-recettes");
      renderPagination([], 1, pageSize, renderPage);
      return;
    }

    const result = paginateList(filtered, currentPage, pageSize);
    render(result.items, "liste-recettes");
    renderPagination(filtered, result.page, pageSize, renderPage);
  }

  if (recettes.length) {
    renderPage(1);
  } else {
    renderPagination([...document.querySelectorAll("#liste-recettes .recipe-card")], 1, pageSize, () => {});
  }

  const inp = document.getElementById("filtre-catalogue");
  if (inp && recettes.length) {
    inp.addEventListener("input", () => {
      filtered = recettes.filter(r => correspondRechercheRecette(r, inp.value));
      renderPage(1);
    });
  }
}


function slugifyHeading(value) {
  return String(value || "")
    .toLowerCase()
    .replaceAll("œ", "oe")
    .replaceAll("æ", "ae")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "section";
}

function ajouterAncresTitres() {
  const used = new Map();
  document.querySelectorAll("main h1, main h2, main h3").forEach(heading => {
    if (heading.dataset.anchorReady === "1") return;

    const base = heading.id || slugifyHeading(heading.textContent);
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    const id = count ? `${base}-${count + 1}` : base;
    heading.id = id;
    heading.dataset.anchorReady = "1";

    const link = document.createElement("a");
    link.className = "heading-anchor no-print";
    link.href = `#${id}`;
    link.setAttribute("aria-label", `Lien direct vers ${heading.textContent.trim()}`);
    link.textContent = "#";
    heading.appendChild(link);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  ajouterAncresTitres();
  if (typeof renderSiteLayout === "function") renderSiteLayout();

  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-main-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }

  ajusterBandeauFixePC();
  afficherAccueil();
  afficherCatalogue();
});
