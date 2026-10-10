/* DOZNI — Header search and component navigation */
(function () {
  "use strict";

  function init() {
    const overlay = document.querySelector("[data-search-overlay]");
    const open = document.querySelector("[data-search-open]");
    const close = document.querySelector("[data-search-close]");
    const input = document.querySelector("[data-search-input]");
    const menu = document.querySelector("[data-mobile-menu]");
    const menuButton = document.querySelector("[data-mobile-menu-button]");

    if (overlay && open && !open.dataset.ready) {
      open.dataset.ready = "true";
      const show = function () {
        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("search-open");
        if (input) setTimeout(function () { input.focus(); }, 30);
      };
      const hide = function () {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("search-open");
      };
      open.addEventListener("click", show);
      if (close) close.addEventListener("click", hide);
      overlay.addEventListener("click", function (event) {
        if (event.target === overlay) hide();
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") hide();
      });
    }

    if (menu && menuButton && !menuButton.dataset.ready) {
      menuButton.dataset.ready = "true";
      menuButton.addEventListener("click", function (event) {
        event.stopPropagation();
        const isOpen = menu.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
      menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          menu.classList.remove("is-open");
          menuButton.setAttribute("aria-expanded", "false");
        });
      });
    }

    const current = window.location.pathname.replace(/\/$/, "") || "/";
    document.querySelectorAll(".main-nav-link, .mobile-nav-link").forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      try {
        const path = new URL(href, window.location.origin).pathname.replace(/\/$/, "") || "/";
        if ((current === "/" && path === "/") || (path !== "/" && current.startsWith(path))) {
          link.classList.add("is-active");
          link.setAttribute("aria-current", "page");
        }
      } catch (_) {}
    });
  }

  document.addEventListener("dozni:components-loaded", init);
  if (document.readyState !== "loading") init();
})();
