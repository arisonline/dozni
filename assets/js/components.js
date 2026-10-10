/* =========================================================
   DOZNI — Components
   File: assets/js/components.js
   ========================================================= */

(function () {
    "use strict";

    /* =========================================================
       1. Component Loader
       ========================================================= */

    async function loadComponent(element) {
        const file = element.getAttribute("data-component");

        if (!file) return;

        try {
            const response = await fetch(file, { cache: "no-cache" });
            if (!response.ok) throw new Error("Component request failed: " + response.status);
            const html = await response.text();
            element.innerHTML = html;
            element.setAttribute("data-component-loaded", "true");
        } catch (error) {
            console.error("DOZNI component error:", error);
            element.setAttribute("data-component-error", "true");
        }
    }

    function ensureSharedFeatureComponent() {
        /*
         * The homepage uses the same reusable feature/About/How-To component
         * as tool pages. This keeps the sections identical across the site
         * without duplicating their HTML inside every page.
         */
        const path = window.location.pathname.replace(/\/+$/, "") || "/";
        if (path !== "/") return;
        if (document.querySelector('[data-component="/components/features.html"]')) return;

        const mount = document.createElement("div");
        mount.setAttribute("data-component", "/components/features.html");

        const footerComponent = document.querySelector('[data-component="/components/footer.html"]');
        if (footerComponent) {
            footerComponent.parentNode.insertBefore(mount, footerComponent);
        } else {
            const main = document.querySelector("main");
            (main || document.body).appendChild(mount);
        }
    }

    async function loadComponents() {
        ensureSharedFeatureComponent();

        const components = document.querySelectorAll("[data-component]");
        if (!components.length) return;

        await Promise.all(Array.from(components).map(loadComponent));
        document.dispatchEvent(new CustomEvent("dozni:components-loaded"));
    }

    /* =========================================================
       2. Dynamic Copyright Year
       ========================================================= */

    function updateCopyrightYear() {
        const currentYear = new Date().getFullYear();
        document.querySelectorAll("[data-current-year]").forEach(function (element) {
            element.textContent = currentYear;
        });
    }

    /* =========================================================
       3. External Links
       ========================================================= */

    function setupExternalLinks() {
        document.querySelectorAll("a[href]").forEach(function (link) {
            const href = link.getAttribute("href");
            if (!href || href.startsWith("#") || href.startsWith("/") || href.startsWith("./") || href.startsWith("../") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return;

            let url;
            try { url = new URL(href); } catch { return; }

            if (url.origin !== window.location.origin) {
                link.setAttribute("target", "_blank");
                link.setAttribute("rel", "noopener noreferrer");
                link.setAttribute("data-external-link", "true");
            }
        });
    }

    /* =========================================================
       4. Smooth Anchor Navigation
       ========================================================= */

    function setupAnchorNavigation() {
        document.addEventListener("click", function (event) {
            const link = event.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute("href");
            if (!href || href === "#" || href.length < 2) return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });

            if (window.history && window.history.pushState) {
                window.history.pushState(null, "", href);
            }

            if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
        });
    }

    /* =========================================================
       5. Copy-to-Clipboard
       ========================================================= */

    async function copyText(text) {
        if (!text) return false;
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            let success = false;
            try { success = document.execCommand("copy"); } catch { success = false; }
            textarea.remove();
            return success;
        }
    }

    function showCopySuccess(button) {
        const originalText = button.getAttribute("data-copy-original") || button.textContent;
        if (!button.hasAttribute("data-copy-original")) button.setAttribute("data-copy-original", originalText);
        button.textContent = "Copied";
        button.classList.add("is-copied");
        window.setTimeout(function () {
            button.textContent = button.getAttribute("data-copy-original") || "Copy";
            button.classList.remove("is-copied");
        }, 1600);
    }

    function setupCopyButtons() {
        document.addEventListener("click", async function (event) {
            const button = event.target.closest("[data-copy]");
            if (!button) return;

            const selector = button.getAttribute("data-copy");
            if (!selector) return;

            const target = document.querySelector(selector);
            if (!target) return;

            const text = target.value !== undefined ? target.value : target.textContent;
            if (await copyText(text.trim())) showCopySuccess(button);
        });
    }

    /* =========================================================
       6. Back To Top
       ========================================================= */

    function setupBackToTop() {
        const button = document.querySelector("[data-back-to-top]");
        if (!button) return;

        function updateVisibility() {
            button.classList.toggle("is-visible", window.scrollY > 500);
        }

        button.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        updateVisibility();
        window.addEventListener("scroll", updateVisibility, { passive: true });
    }

    /* =========================================================
       7. Current Year
       ========================================================= */

    function setupCurrentYear() {
        updateCopyrightYear();
        document.addEventListener("dozni:components-loaded", updateCopyrightYear);
    }

    /* =========================================================
       8. Lazy Images
       ========================================================= */

    function setupLazyImages() {
        document.querySelectorAll("img[data-src]").forEach(function (image) {
            const source = image.getAttribute("data-src");
            if (!source) return;
            image.setAttribute("loading", "lazy");
            image.setAttribute("src", source);
            image.removeAttribute("data-src");
        });
    }

    /* =========================================================
       9. Scroll Reveal
       ========================================================= */

    function setupScrollReveal() {
        const elements = document.querySelectorAll("[data-reveal]");
        if (!elements.length) return;

        if (!("IntersectionObserver" in window)) {
            elements.forEach(function (element) { element.classList.add("is-visible"); });
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

        elements.forEach(function (element) { observer.observe(element); });
    }

    /* =========================================================
       10. Current Page Loading State
       ========================================================= */

    function removePageLoadingState() {
        document.documentElement.classList.add("page-ready");
        document.documentElement.classList.remove("page-loading");
    }

    /* =========================================================
       11. Initialize
       ========================================================= */

    async function initializeComponents() {
        await loadComponents();
        setupCurrentYear();
        setupExternalLinks();
        setupAnchorNavigation();
        setupCopyButtons();
        setupBackToTop();
        setupLazyImages();
        setupScrollReveal();
        removePageLoadingState();
        document.dispatchEvent(new CustomEvent("dozni:ready"));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeComponents);
    } else {
        initializeComponents();
    }
})();
