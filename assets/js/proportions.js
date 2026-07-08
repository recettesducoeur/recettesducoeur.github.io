// Calculateur de proportions pour les fiches recettes.
// Gère :
// - conversions automatiques g → kg et kg → g ;
// - conversions automatiques ml → L et L → ml ;
// - fractions lisibles pour pièces, tranches, cuillères et pincées ;
// - synchronisation impression / export PDF avec les quantités sélectionnées.

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("portions-input");
  const baseNode = document.getElementById("base-portions");
  if (!input || !baseNode) return;

  const base = Number(baseNode.dataset.basePortions || input.value || 1);

  const FRACTIONS = [
    { value: 0.25, label: "1/4" },
    { value: 0.33, label: "1/3" },
    { value: 0.5, label: "1/2" },
    { value: 0.66, label: "2/3" },
    { value: 0.75, label: "3/4" }
  ];

  function normalizeUnit(unit) {
    return String(unit || "")
      .toLowerCase()
      .trim()
      .replaceAll(".", "")
      .replace(/\s+/g, " ");
  }

  function decimalFr(n, maxDecimals = 1) {
    if (!Number.isFinite(n)) return "";
    if (Math.abs(n - Math.round(n)) < 0.01) return String(Math.round(n));
    return String(Number(n.toFixed(maxDecimals))).replace(".", ",");
  }

  function fractionLabel(value) {
    if (!Number.isFinite(value)) return "";

    const integer = Math.floor(value);
    const decimal = value - integer;

    if (decimal < 0.08) return String(integer);
    if (1 - decimal < 0.08) return String(integer + 1);

    let nearest = FRACTIONS[0];
    for (const f of FRACTIONS) {
      if (Math.abs(decimal - f.value) < Math.abs(decimal - nearest.value)) {
        nearest = f;
      }
    }

    if (Math.abs(decimal - nearest.value) <= 0.09) {
      if (integer === 0) return nearest.label;
      return `${integer} ${nearest.label}`;
    }

    return decimalFr(value, 1);
  }

  function isFractionUnit(unit) {
    const u = normalizeUnit(unit);
    return [
      "piece", "pieces", "pièce", "pièces",
      "tranche", "tranches",
      "oeuf", "oeufs", "œuf", "œufs",
      "cuillere", "cuilleres", "cuillère", "cuillères",
      "c a soupe", "c à soupe", "cas",
      "c a cafe", "c à café", "cac",
      "pincee", "pincée", "pincees", "pincées"
    ].includes(u);
  }

  function pluralizeUnit(value, unit) {
    const u = String(unit || "").trim();
    const n = Math.abs(value);

    if (!u) return "";
    if (n > 0.99 && n < 1.01) {
      return u
        .replace("pièces", "pièce")
        .replace("tranches", "tranche")
        .replace("pincées", "pincée")
        .replace("œufs", "œuf")
        .replace("oeufs", "oeuf");
    }

    if (["pièce", "tranche", "pincée"].includes(u)) return `${u}s`;
    if (u === "œuf") return "œufs";
    if (u === "oeuf") return "oeufs";
    return u;
  }

  function formatQuantity(quantity, unit) {
    if (!Number.isFinite(quantity)) return "";

    const rawUnit = String(unit || "").trim();
    const u = normalizeUnit(rawUnit);

    if (["g", "gr", "gramme", "grammes"].includes(u)) {
      if (Math.abs(quantity) >= 1000) {
        return `${decimalFr(quantity / 1000, 2)} kg`;
      }
      return `${decimalFr(quantity, quantity < 10 ? 1 : 0)} g`;
    }

    if (["kg", "kilo", "kilos", "kilogramme", "kilogrammes"].includes(u)) {
      if (Math.abs(quantity) < 1) {
        return `${decimalFr(quantity * 1000, 0)} g`;
      }
      return `${decimalFr(quantity, 2)} kg`;
    }

    if (["ml", "millilitre", "millilitres"].includes(u)) {
      if (Math.abs(quantity) >= 1000) {
        return `${decimalFr(quantity / 1000, 2)} L`;
      }
      return `${decimalFr(quantity, quantity < 10 ? 1 : 0)} ml`;
    }

    if (["l", "litre", "litres"].includes(u)) {
      if (Math.abs(quantity) < 1) {
        return `${decimalFr(quantity * 1000, 0)} ml`;
      }
      return `${decimalFr(quantity, 2)} L`;
    }

    if (isFractionUnit(rawUnit)) {
      return `${fractionLabel(quantity)} ${pluralizeUnit(quantity, rawUnit)}`.trim();
    }

    return `${decimalFr(quantity, 1)} ${rawUnit}`.trim();
  }

  function selectedPortions() {
    const raw = Number(input.value || base);
    return Math.max(1, raw);
  }

  function ensurePrintSummary() {
    let box = document.getElementById("print-portion-summary");
    const tool = document.querySelector(".portion-tool");

    if (!box && tool) {
      box = document.createElement("section");
      box.id = "print-portion-summary";
      box.className = "print-summary print-only";
      box.innerHTML = `
        <h2>⚖️ Quantités imprimées</h2>
        <p>
          Les quantités ci-dessous sont calculées pour
          <strong><span data-print-portions></span></strong>
          portion<span data-print-portions-plural></span>.
        </p>
        <p class="small" data-print-ratio></p>
      `;
      tool.insertAdjacentElement("afterend", box);
    }

    return box;
  }

  function updatePrintSummary(portions, ratio) {
    const box = ensurePrintSummary();
    if (!box) return;

    box.querySelectorAll("[data-print-portions]").forEach(el => {
      el.textContent = String(portions);
    });

    box.querySelectorAll("[data-print-portions-plural]").forEach(el => {
      el.textContent = portions > 1 ? "s" : "";
    });

    const ratioNode = box.querySelector("[data-print-ratio]");
    if (ratioNode) {
      ratioNode.textContent = `Base de la fiche : ${base} portion${base > 1 ? "s" : ""}. Coefficient appliqué : ×${decimalFr(ratio, 2)}.`;
    }
  }

  function update() {
    const portions = selectedPortions();
    const ratio = portions / base;

    document.querySelectorAll("[data-base-qty]").forEach(el => {
      const q = Number(el.dataset.baseQty);
      const unit = el.dataset.unit || "";
      el.textContent = formatQuantity(q * ratio, unit);
      el.dataset.currentQty = String(q * ratio);
      el.dataset.currentLabel = el.textContent;
    });

    // Le compteur principal de portions doit refléter le choix utilisateur,
    // y compris dans le PDF/impression.
    baseNode.textContent = String(portions);
    baseNode.dataset.currentPortions = String(portions);

    const info = document.getElementById("ratio-info");
    if (info) {
      info.textContent = `Quantités calculées pour ${portions} portion${portions > 1 ? "s" : ""}.`;
    }

    updatePrintSummary(portions, ratio);
  }

  input.addEventListener("input", update);
  input.addEventListener("change", update);

  // Important : certains navigateurs déclenchent l'impression avant de
  // repeindre la page. On force donc la mise à jour juste avant window.print().
  document.querySelectorAll(".print-button").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      update();
      requestAnimationFrame(() => window.print());
    });
  });

  window.addEventListener("beforeprint", update);
  update();
});
