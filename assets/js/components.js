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

        if (!file) {
            return;
        }

        try {
            const response = await fetch(file, {
                cache: "no-cache"
            });

            if (!response.ok) {
                throw new Error(
                    "Component request failed: " +
                    response.status
                );
            }

            const html = await response.text();

            element.innerHTML = html;

            element.setAttribute(
                "data-component-loaded",
                "true"
            );

        } catch (error) {
            console.error(
                "DOZNI component error:",
                error
            );

            element.setAttribute(
                "data-component-error",
                "true"
            );
        }
    }


    async function loadComponents() {
        const components = document.querySelectorAll(
            "[data-component]"
        );

        if (!components.length) {
            return;
        }

        const requests = [];

        components.forEach(function (element) {
            requests.push(
                loadComponent(element)
            );
        });

        await Promise.all(requests);

        /*
         * Notify other scripts that components
         * are now available in the DOM.
         */
        document.dispatchEvent(
            new CustomEvent("dozni:components-loaded")
        );
    }


    /* =========================================================
       2. Dynamic Copyright Year
       ========================================================= */

    function updateCopyrightYear() {
        const currentYear = new Date().getFullYear();

        const elements = document.querySelectorAll(
            "[data-current-year]"
        );

        elements.forEach(function (element) {
            element.textContent = currentYear;
        });
    }


    /* =========================================================
       3. External Links
       ========================================================= */

    function setupExternalLinks() {
        const links = document.querySelectorAll(
            "a[href]"
        );

        links.forEach(function (link) {
            const href = link.getAttribute("href");

            if (!href) {
                return;
            }

            /*
             * Ignore:
             * - anchors
             * - telephone links
             * - email links
             * - javascript links
             * - relative URLs
             */
            if (
                href.startsWith("#") ||
                href.startsWith("/") ||
                href.startsWith("./") ||
                href.startsWith("../") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:") ||
                href.startsWith("javascript:")
            ) {
                return;
            }

            let url;

            try {
                url = new URL(href);
            } catch {
                return;
            }

            /*
             * Only treat different origins as external.
             */
            if (
                url.origin !== window.location.origin
            ) {
                link.setAttribute(
                    "target",
                    "_blank"
                );

                link.setAttribute(
                    "rel",
                    "noopener noreferrer"
                );

                link.setAttribute(
                    "data-external-link",
                    "true"
                );
            }
        });
    }


    /* =========================================================
       4. Smooth Anchor Navigation
       ========================================================= */

    function setupAnchorNavigation() {
        document.addEventListener(
            "click",
            function (event) {

                const link =
                    event.target.closest(
                        'a[href^="#"]'
                    );

                if (!link) {
                    return;
                }

                const href =
                    link.getAttribute("href");

                if (
                    !href ||
                    href === "#" ||
                    href.length < 2
                ) {
                    return;
                }

                const target =
                    document.querySelector(href);

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                /*
                 * Update URL without causing a page jump.
                 */
                if (
                    window.history &&
                    window.history.pushState
                ) {
                    window.history.pushState(
                        null,
                        "",
                        href
                    );
                }

                /*
                 * Improve keyboard accessibility.
                 */
                if (
                    !target.hasAttribute("tabindex")
                ) {
                    target.setAttribute(
                        "tabindex",
                        "-1"
                    );
                }

                target.focus({
                    preventScroll: true
                });
            }
        );
    }


    /* =========================================================
       5. Copy-to-Clipboard
       ========================================================= */

    async function copyText(text) {
        if (!text) {
            return false;
        }

        try {
            await navigator.clipboard.writeText(
                text
            );

            return true;

        } catch (error) {

            /*
             * Fallback for browsers where
             * Clipboard API is unavailable.
             */
            const textarea =
                document.createElement("textarea");

            textarea.value = text;

            textarea.setAttribute(
                "readonly",
                ""
            );

            textarea.style.position =
                "fixed";

            textarea.style.opacity = "0";

            document.body.appendChild(
                textarea
            );

            textarea.select();

            let success = false;

            try {
                success =
                    document.execCommand(
                        "copy"
                    );
            } catch {
                success = false;
            }

            textarea.remove();

            return success;
        }
    }


    function setupCopyButtons() {
        document.addEventListener(
            "click",
            async function (event) {

                const button =
                    event.target.closest(
                        "[data-copy]"
                    );

                if (!button) {
                    return;
                }

                const selector =
                    button.getAttribute(
                        "data-copy"
                    );

                if (!selector) {
                    return;
                }

                const target =
                    document.querySelector(
                        selector
                    );

                if (!target) {
                    return;
                }

                const text =
                    target.value !== undefined
                        ? target.value
                        : target.textContent;

                const success =
                    await copyText(
                        text.trim()
                    );

                if (success) {
                    showCopySuccess(button);
                }
            }
        );
    }


    function showCopySuccess(button) {
        const originalText =
            button.getAttribute(
                "data-copy-original"
            ) ||
            button.textContent;

        if (
            !button.hasAttribute(
                "data-copy-original"
            )
        ) {
            button.setAttribute(
                "data-copy-original",
                originalText
            );
        }

        button.textContent = "Copied";

        button.classList.add(
            "is-copied"
        );

        window.setTimeout(
            function () {

                button.textContent =
                    button.getAttribute(
                        "data-copy-original"
                    ) ||
                    "Copy";

                button.classList.remove(
                    "is-copied"
                );

            },
            1600
        );
    }


    /* =========================================================
       6. Back To Top
       ========================================================= */

    function setupBackToTop() {
        const button = document.querySelector(
            "[data-back-to-top]"
        );

        if (!button) {
            return;
        }

        function updateVisibility() {
            if (window.scrollY > 500) {
                button.classList.add(
                    "is-visible"
                );
            } else {
                button.classList.remove(
                    "is-visible"
                );
            }
        }

        button.addEventListener(
            "click",
            function () {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );

        updateVisibility();

        window.addEventListener(
            "scroll",
            updateVisibility,
            {
                passive: true
            }
        );
    }


    /* =========================================================
       7. Current Year
       ========================================================= */

    function setupCurrentYear() {
        updateCopyrightYear();

        /*
         * Components such as the footer may be loaded
         * after the initial DOM is ready.
         */
        document.addEventListener(
            "dozni:components-loaded",
            updateCopyrightYear
        );
    }


    /* =========================================================
       8. Lazy Images
       ========================================================= */

    function setupLazyImages() {
        const images = document.querySelectorAll(
            "img[data-src]"
        );

        if (!images.length) {
            return;
        }

        /*
         * Native lazy loading is preferred.
         */
        images.forEach(function (image) {
            const source =
                image.getAttribute(
                    "data-src"
                );

            if (!source) {
                return;
            }

            image.setAttribute(
                "loading",
                "lazy"
            );

            image.setAttribute(
                "src",
                source
            );

            image.removeAttribute(
                "data-src"
            );
        });
    }


    /* =========================================================
       9. Scroll Reveal
       ========================================================= */

    function setupScrollReveal() {
        const elements =
            document.querySelectorAll(
                "[data-reveal]"
            );

        if (!elements.length) {
            return;
        }

        /*
         * If IntersectionObserver is unavailable,
         * simply show everything.
         */
        if (
            !("IntersectionObserver" in window)
        ) {
            elements.forEach(function (element) {
                element.classList.add(
                    "is-visible"
                );
            });

            return;
        }

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {
                                entry.target.classList.add(
                                    "is-visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );

                },
                {
                    threshold: 0.08,
                    rootMargin: "0px 0px -40px 0px"
                }
            );

        elements.forEach(function (element) {
            observer.observe(element);
        });
    }


    /* =========================================================
       10. Current Page Loading State
       ========================================================= */

    function removePageLoadingState() {
        document.documentElement.classList.add(
            "page-ready"
        );

        document.documentElement.classList.remove(
            "page-loading"
        );
    }


    /* =========================================================
       11. Initialize
       ========================================================= */

    async function initializeComponents() {

        /*
         * Load reusable HTML components first.
         */
        await loadComponents();

        /*
         * Then initialize common UI behavior.
         */
        setupCurrentYear();
        setupExternalLinks();
        setupAnchorNavigation();
        setupCopyButtons();
        setupBackToTop();
        setupLazyImages();
        setupScrollReveal();

        removePageLoadingState();

        document.dispatchEvent(
            new CustomEvent("dozni:ready")
        );
    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeComponents
        );

    } else {

        initializeComponents();

    }

})();
