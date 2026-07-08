(function () {
  const FOOTER_TEXT = "Cuisine simple, solidaire et anti-gaspi. Site participatif indépendant, non affilié à une association.";

  function pageDepthPrefix() {
    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean);
    const fileLike = parts.length && /\.[a-z0-9]+$/i.test(parts[parts.length - 1]);
    const dirs = fileLike ? parts.slice(0, -1) : parts;
    if (!dirs.length) return "";
    return "../".repeat(dirs.length);
  }

  function currentFile() {
    const last = window.location.pathname.split("/").filter(Boolean).pop() || "index.html";
    if (!last.includes(".")) return "index.html";
    return last;
  }

  function navLink(prefix, href, label, current) {
    const active = current === href ? ' class="active"' : "";
    return `<a href="${prefix}${href}"${active}>${label}</a>`;
  }

  window.renderSiteLayout = function renderSiteLayout() {
    const prefix = pageDepthPrefix();
    const current = currentFile();

    document.querySelectorAll("[data-site-header]").forEach(node => {
      node.innerHTML = `
        <a class="skip-link" href="#contenu">Aller au contenu</a>
        <header class="site-header no-print">
          <div class="header-inner">
            <a class="brand" href="${prefix}index.html">
              <img class="site-logo" src="${prefix}assets/logos/logo-principal.png" alt="Logo Les Recettes du Cœur">
              <span>Les Recettes<br>du Cœur</span>
            </a>
            <button class="nav-toggle" data-nav-toggle aria-label="Ouvrir le menu">☰ Menu</button>
            <nav class="main-nav" data-main-nav>
              ${navLink(prefix, "index.html", "Accueil", current)}
              ${navLink(prefix, "presentation-projet.html", "Projet", current)}
              ${navLink(prefix, "recettes.html", "Recettes", current)}
              ${navLink(prefix, "recherche.html", "Recherche", current)}
              ${navLink(prefix, "recette-semaine.html", "Semaine", current)}
              ${navLink(prefix, "aide.html", "Aide", current)}
              ${navLink(prefix, "contact.html", "Contact", current)}
            </nav>
          </div>
        </header>
      `;
    });

    document.querySelectorAll("[data-site-footer]").forEach(node => {
      node.innerHTML = `
        <footer class="site-footer no-print">
          <div class="footer-inner">
            <div>
              <strong>Les Recettes du Cœur</strong><br>
              ${FOOTER_TEXT}
            </div>
            <div class="footer-links">
              <a href="${prefix}presentation-projet.html">Projet</a>
              <a href="${prefix}aide.html">Aide</a>
              <a href="${prefix}contact.html">Contact</a>
              <a href="${prefix}suggerer-recette.html">💡 Suggérer une recette</a>
            </div>
          </div>
        </footer>
      `;
    });
  };
})();
