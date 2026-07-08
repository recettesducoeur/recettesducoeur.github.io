function getCellValue(cell) {
  return (cell?.textContent || "").trim();
}

function compareValues(a, b, direction) {
  const na = Number(String(a).replace(",", "."));
  const nb = Number(String(b).replace(",", "."));
  const bothNumbers = !Number.isNaN(na) && !Number.isNaN(nb) && a !== "" && b !== "";
  const result = bothNumbers ? na - nb : String(a).localeCompare(String(b), "fr", { numeric: true, sensitivity: "base" });
  return direction === "asc" ? result : -result;
}

function initDataTable(table) {
  if (!table) return;

  const headers = [...table.querySelectorAll("thead th")];
  headers.forEach((th, index) => {
    th.dataset.sortDirection = "";
    th.addEventListener("click", event => {
      if (event.target.classList.contains("col-resizer")) return;

      const direction = th.dataset.sortDirection === "asc" ? "desc" : "asc";
      headers.forEach(h => h.dataset.sortDirection = "");
      th.dataset.sortDirection = direction;

      const tbody = table.querySelector("tbody");
      if (!tbody) return;

      const rows = [...tbody.querySelectorAll("tr")];
      rows.sort((ra, rb) => {
        const a = getCellValue(ra.children[index]);
        const b = getCellValue(rb.children[index]);
        return compareValues(a, b, direction);
      });

      rows.forEach(row => tbody.appendChild(row));
    });
  });

  enableResizableColumns(table);
  enableStickyFirstColumn(table);
}

function buildColumnToggles(table, container) {
  if (!table || !container) return;

  const headers = [...table.querySelectorAll("thead th")];
  container.innerHTML = headers.map((th, index) => `
    <label class="check-pill">
      <input type="checkbox" data-col="${index}" checked>
      <span>${th.textContent.trim() || `Colonne ${index + 1}`}</span>
    </label>
  `).join("");

  container.querySelectorAll("input[data-col]").forEach(input => {
    input.addEventListener("change", () => {
      const col = Number(input.dataset.col);
      const visible = input.checked;
      table.querySelectorAll("tr").forEach(row => {
        if (row.children[col]) row.children[col].style.display = visible ? "" : "none";
      });
    });
  });
}

function enableResizableColumns(table) {
  if (!table || table.dataset.resizableReady === "1") return;
  table.dataset.resizableReady = "1";

  const ths = [...table.querySelectorAll("thead th")];
  ths.forEach((th, index) => {
    th.style.position = th.style.position || "sticky";
    th.style.minWidth = th.offsetWidth ? `${th.offsetWidth}px` : "120px";

    const resizer = document.createElement("span");
    resizer.className = "col-resizer";
    resizer.setAttribute("aria-hidden", "true");
    th.appendChild(resizer);

    let startX = 0;
    let startWidth = 0;

    resizer.addEventListener("mousedown", event => {
      event.preventDefault();
      event.stopPropagation();
      startX = event.pageX;
      startWidth = th.offsetWidth;

      document.body.classList.add("resizing-column");

      const onMove = moveEvent => {
        const width = Math.max(70, startWidth + moveEvent.pageX - startX);
        setColumnWidth(table, index, width);
      };

      const onUp = () => {
        document.body.classList.remove("resizing-column");
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  });
}

function setColumnWidth(table, index, width) {
  table.querySelectorAll("tr").forEach(row => {
    const cell = row.children[index];
    if (cell) {
      cell.style.width = `${width}px`;
      cell.style.minWidth = `${width}px`;
      cell.style.maxWidth = `${width}px`;
    }
  });
}

function enableStickyFirstColumn(table) {
  if (!table || table.dataset.stickyFirstColReady === "1") return;
  table.dataset.stickyFirstColReady = "1";
  table.classList.add("sticky-first-column");
}
