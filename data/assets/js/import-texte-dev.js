
// Outil statique d'aide à la mise à jour de data/recettes.json depuis un fichier texte.
// Ne peut pas écrire directement dans GitHub : il génère un JSON à copier ou télécharger.

function parseBlock(text) {
  const obj = {};
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    obj[key] = value;
  }

  const id = obj.id || obj.identifiant || "";
  const titre = obj.titre || obj.nom || "";
  const personnes = Number(obj.personnes || 4);

  function splitList(v) {
    return String(v || "").split(/[,;]+/).map(x => x.trim()).filter(Boolean);
  }

  function ingredientsDetail(v) {
    // Format conseillé : "courgettes|800|g; tomates|500|g"
    return String(v || "").split(";").map(x => x.trim()).filter(Boolean).map(item => {
      const [nom, quantite, unite] = item.split("|").map(x => x?.trim());
      return {
        nom: nom || "",
        quantite: quantite && !Number.isNaN(Number(quantite)) ? Number(quantite) : quantite || "",
        unite: unite || ""
      };
    });
  }

  const principaux = ingredientsDetail(obj["ingredients principaux"] || obj.principaux);
  const secondaires = ingredientsDetail(obj["ingredients secondaires"] || obj.secondaires);
  const optionnels = ingredientsDetail(obj["ingredients optionnels"] || obj.optionnels);

  const searchIngredients = [...principaux, ...secondaires, ...optionnels]
    .map(x => x.nom)
    .filter(Boolean);

  return {
    id,
    titre,
    slug: titre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    url: `recettes/${id}.html`,
    image: `images/recettes/${id}.webp`,
    qrcode: `qrcodes/recettes/${id}.png`,
    resume: obj.resume || "",
    explication: obj.explication || "",
    categorie: obj.categorie || "plat",
    sous_categorie: obj["sous categorie"] || obj.sous_categorie || "",
    moment_repas: splitList(obj["moment repas"] || "dejeuner,diner"),
    temperature_service: obj.temperature || obj.temperature_service || "chaud",
    type_cuisson: splitList(obj.cuisson || obj.type_cuisson),
    equipement: splitList(obj.equipement || obj.cuisson),
    temps_preparation_min: Number(obj.preparation || obj.temps_preparation_min || 0),
    temps_cuisson_min: Number(obj["temps cuisson"] || obj.temps_cuisson_min || 0),
    temps_total_min: Number(obj.preparation || 0) + Number(obj["temps cuisson"] || 0),
    personnes,
    difficulte: obj.difficulte || "facile",
    budget: obj.budget || "economique",
    ingredients: {
      principaux: principaux.map(x => x.nom),
      secondaires: secondaires.map(x => x.nom),
      optionnels: optionnels.map(x => x.nom),
      recherche: searchIngredients
    },
    ingredients_detail: { principaux, secondaires, optionnels },
    tags: splitList(obj.tags),
    regimes: splitList(obj.regimes),
    allergenes: splitList(obj.allergenes),
    conservation: obj.conservation || "",
    rechauffage: obj.rechauffage || "",
    niveau_urgence_produits: splitList(obj.urgence),
    anti_gaspi: String(obj.anti_gaspi || "").toLowerCase() === "true",
    recette_semaine_candidate: String(obj.recette_semaine_candidate || "true").toLowerCase() !== "false",
    visible: String(obj.visible || "true").toLowerCase() !== "false",
    date_creation: obj.date_creation || "",
    date_modification: obj.date_modification || "",
    etapes: splitList(obj.etapes),
    astuce: obj.astuce || "",
    variantes: obj.variantes || ""
  };
}

function downloadText(filename, content) {
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("import-file");
  const textarea = document.getElementById("import-text");
  const output = document.getElementById("import-output");
  const parseBtn = document.getElementById("parse-btn");
  const downloadBtn = document.getElementById("download-btn");

  fileInput?.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    textarea.value = await file.text();
  });

  function parse() {
    const blocks = textarea.value.split(/\n---+\n/).map(x => x.trim()).filter(Boolean);
    const parsed = blocks.map(parseBlock);
    const json = JSON.stringify(parsed.length === 1 ? parsed[0] : parsed, null, 2);
    output.textContent = json;
    return json;
  }

  parseBtn?.addEventListener("click", parse);
  downloadBtn?.addEventListener("click", () => {
    const json = parse();
    downloadText("recettes_importees.json", json);
  });
});
