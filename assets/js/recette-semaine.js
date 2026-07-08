function pad2(n) {
  return String(n).padStart(2, "0");
}

function dateISO(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function dateFR(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

function mondayOf(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return d;
}

function sundayOf(date) {
  const d = mondayOf(date);
  d.setDate(d.getDate() + 6);
  return d;
}

function isoWeekInfo(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const year = d.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return { year, week, key: `${year}-W${pad2(week)}` };
}

function weekObjectFromDate(date) {
  const start = mondayOf(date);
  const end = sundayOf(date);
  const info = isoWeekInfo(date);
  return {
    key: info.key,
    year: info.year,
    week: info.week,
    start,
    end,
    startISO: dateISO(start),
    endISO: dateISO(end)
  };
}

function semainesDuMois(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const last = new Date(year, monthIndex + 1, 0);
  let cursor = mondayOf(first);
  const weeks = [];

  while (cursor <= last || sundayOf(cursor) >= first) {
    weeks.push(weekObjectFromDate(cursor));
    cursor.setDate(cursor.getDate() + 7);
  }

  const seen = new Set();
  return weeks.filter(w => {
    if (seen.has(w.key)) return false;
    seen.add(w.key);
    return true;
  });
}

async function chargerSelectionSemaine() {
  try {
    const response = await fetch(`${rootPrefix()}data/selection_semaine.json`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erreur sélection semaine :", error);
    return { semaines: [] };
  }
}

function findBlocPourSemaine(cfg, week) {
  const semaines = cfg?.semaines || [];
  return semaines.find(s =>
    s.semaine_iso === week.key ||
    (s.date_debut && s.date_fin && week.startISO <= s.date_fin && week.endISO >= s.date_debut)
  );
}

function stableIndex(key, length) {
  if (!length) return 0;
  let n = 0;
  for (const ch of key) n = (n * 31 + ch.charCodeAt(0)) % 100000;
  return n % length;
}

function fallbackPourSemaine(recettes, week) {
  const visibles = recettes.filter(r => r.visible !== false);
  const start = stableIndex(week.key, visibles.length);
  return [...visibles.slice(start), ...visibles.slice(0, start)].slice(0, 3);
}

function recettesPourSemaine(recettes, cfg, week) {
  const bloc = findBlocPourSemaine(cfg, week);
  if (bloc?.recettes?.length) {
    const wanted = new Set(bloc.recettes);
    return {
      source: "selection",
      list: recettes.filter(r => r.visible !== false && wanted.has(r.id))
    };
  }

  return {
    source: "fallback",
    list: fallbackPourSemaine(recettes, week)
  };
}

function renderWeekBlock(week, list, source) {
  const badge = source === "selection"
    ? `<span class="badge">sélection programmée</span>`
    : `<span class="badge">rotation automatique</span>`;

  return `
    <section class="week-block">
      <div class="week-heading">
        <div>
          <h2>${week.key}</h2>
          <p class="small">Du ${dateFR(week.start)} au ${dateFR(week.end)}</p>
        </div>
        ${badge}
      </div>
      <div class="recipe-grid">${list.map(r => carte(r)).join("")}</div>
    </section>
  `;
}

function remplirSelecteursSemaine(cfg) {
  const yearSelect = document.getElementById("semaine-annee");
  const monthSelect = document.getElementById("semaine-mois");
  if (!yearSelect || !monthSelect) return;

  const now = new Date();
  const cfgYears = (cfg?.semaines || [])
    .flatMap(s => [s.date_debut, s.date_fin])
    .filter(Boolean)
    .map(d => Number(String(d).slice(0, 4)));

  const years = [...new Set([now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1, ...cfgYears])]
    .sort((a, b) => a - b);

  yearSelect.innerHTML = years.map(y => `<option value="${y}">${y}</option>`).join("");
  monthSelect.innerHTML = Array.from({ length: 12 }, (_, i) => {
    const label = new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(new Date(2020, i, 1));
    return `<option value="${i}">${label}</option>`;
  }).join("");

  yearSelect.value = String(now.getFullYear());
  monthSelect.value = String(now.getMonth());
}

document.addEventListener("DOMContentLoaded", async () => {
  const c = document.getElementById("recettes-semaine");
  if (!c) return;

  const [recettes, cfg] = await Promise.all([
    chargerRecettes(),
    chargerSelectionSemaine()
  ]);

  const info = document.getElementById("semaine-info");
  const btnCourante = document.getElementById("semaine-courante");
  const btnAfficher = document.getElementById("semaine-afficher");

  if (!recettes.length) {
    if (info) info.textContent = "Les recettes dynamiques n’ont pas pu être chargées. Les recettes statiques de secours restent affichées.";
    return;
  }

  function afficherSemaineCourante() {
    const week = weekObjectFromDate(new Date());
    const result = recettesPourSemaine(recettes, cfg, week);

    if (info) {
      info.innerHTML = `
        <strong>Semaine en cours : ${week.key}</strong><br>
        Du ${dateFR(week.start)} au ${dateFR(week.end)}.<br>
        Mode : ${result.source === "selection" ? "sélection programmée" : "rotation automatique"}.
      `;
    }

    c.innerHTML = result.list.length
      ? result.list.map(x => carte(x)).join("")
      : `<div class="notice">Aucune recette disponible pour cette semaine.</div>`;
  }

  function afficherMois() {
    const year = Number(document.getElementById("semaine-annee")?.value || new Date().getFullYear());
    const month = Number(document.getElementById("semaine-mois")?.value || new Date().getMonth());
    const weeks = semainesDuMois(year, month);

    const label = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(new Date(year, month, 1));

    if (info) {
      info.innerHTML = `
        <strong>Affichage mensuel : ${label}</strong><br>
        ${weeks.length} semaine(s) affichée(s), avec sélection programmée si disponible, sinon rotation automatique.
      `;
    }

    c.innerHTML = weeks.map(w => {
      const result = recettesPourSemaine(recettes, cfg, w);
      return renderWeekBlock(w, result.list, result.source);
    }).join("");
  }

  remplirSelecteursSemaine(cfg);
  btnCourante?.addEventListener("click", afficherSemaineCourante);
  btnAfficher?.addEventListener("click", afficherMois);
  afficherSemaineCourante();
});
