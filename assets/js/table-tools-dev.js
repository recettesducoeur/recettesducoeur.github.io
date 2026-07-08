
// Outils génériques pour tableaux HTML.
// Fonctionne sur les tableaux .data-table : tri par colonne + affichage/masquage de colonnes.

function tableTextValue(cell) {
  return (cell?.innerText || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function inferSortValue(text) {
  const normalized = text.replace(",", ".").replace(/[^\d.-]/g, "");
  const num = Number(normalized);
  if (normalized && Number.isFinite(num)) return num;
  return text;
}

function sortDataTable(table, colIndex, direction) {
  const tbody = table.tBodies[0];
  if (!tbody) return;

  const rows = Array.from(tbody.rows);
  rows.sort((a, b) => {
    const av = inferSortValue(tableTextValue(a.cells[colIndex]));
    const bv = inferSortValue(tableTextValue(b.cells[colIndex]));

    if (typeof av === "number" && typeof bv === "number") {
      return direction === "asc" ? av - bv : bv - av;
    }

    return direction === "asc"
      ? String(av).localeCompare(String(bv), "fr")
      : String(bv).localeCompare(String(av), "fr");
  });

  rows.forEach(row => tbody.appendChild(row));
}

function setColumnVisibility(table, colIndex, visible) {
  Array.from(table.rows).forEach(row => {
    const cell = row.cells[colIndex];
    if (cell) cell.style.display = visible ? "" : "none";
  });
}

function initDataTable(table) {
  if (table.dataset.tableToolsReady === "1") return;
  table.dataset.tableToolsReady = "1";

  const headers = Array.from(table.tHead?.rows?.[0]?.cells || []);
  headers.forEach((th, index) => {
    th.classList.add("sortable");
    th.dataset.sortDirection = "";
    th.addEventListener("click", () => {
      const next = th.dataset.sortDirection === "asc" ? "desc" : "asc";
      headers.forEach(h => {
        h.dataset.sortDirection = "";
        h.classList.remove("sort-asc", "sort-desc");
      });
      th.dataset.sortDirection = next;
      th.classList.add(next === "asc" ? "sort-asc" : "sort-desc");
      sortDataTable(table, index, next);
    });
  });
}

function buildColumnToggles(table, container) {
  if (!table || !container) return;
  container.innerHTML = "";

  const headers = Array.from(table.tHead?.rows?.[0]?.cells || []);
  headers.forEach((th, index) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = th.style.display !== "none";

    checkbox.addEventListener("change", () => {
      setColumnVisibility(table, index, checkbox.checked);
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(th.innerText.trim() || `Colonne ${index + 1}`));
    container.appendChild(label);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("table.data-table").forEach(initDataTable);
});
