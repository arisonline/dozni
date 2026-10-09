/* =========================================================
   DOZNI — Navigation
   File: assets/js/navigation.js
   ========================================================= */

(function () {
    "use strict";

    const body = document.body;

    function getElement(selector) {
        return document.querySelector(selector);
    }

    function getElements(selector) {
        return document.querySelectorAll(selector);
    }

    /* ---------------------------------------------------------
       Mobile Menu
       --------------------------------------------------------- */

    function openMobileMenu(button, menu) {
        if (!button || !menu) return;

        button.setAttribute("aria-expanded", "true");
        menu.classList.add("is-open");
        body.classList.add("menu-open");
    }

    function closeMobileMenu(button, menu) {
        if (!button || !menu) return;

        button.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
        body.classList.remove("menu-open");
    }

    function toggleMobileMenu(button, menu) {
        const isOpen = button.getAttribute("aria-expanded") === "true";

        if (isOpen) {
            closeMobileMenu(button, menu);
        } else {
            openMobileMenu(button, menu);
        }
    }

    function setupMobileMenu() {
        const button = getElement("[data-mobile-menu-button]");
        const menu = getElement("[data-mobile-menu]");

        if (!button || !menu) return;

        button.setAttribute("aria-expanded", "false");

        button.addEventListener("click", function () {
            toggleMobileMenu(button, menu);
        });

        /*
         * Close menu when a navigation link is selected.
         */
        const links = menu.querySelectorAll("a");

        links.forEach(function (link) {
            link.addEventListener("click", function () {
                closeMobileMenu(button, menu);
            });
        });

        /*
         * Close menu when clicking outside.
         */
        document.addEventListener("click", function (event) {
            const clickedInsideMenu = menu.contains(event.target);
            const clickedButton = button.contains(event.target);

            if (
                !clickedInsideMenu &&
                !clickedButton &&
                button.getAttribute("aria-expanded") === "true"
            ) {
                closeMobileMenu(button, menu);
            }
        });

        /*
         * Close menu with Escape.
         */
        document.addEventListener("keydown", function (event) {
            if (
                event.key === "Escape" &&
                button.getAttribute("aria-expanded") === "true"
            ) {
                closeMobileMenu(button, menu);
                button.focus();
            }
        });
    }


    /* ---------------------------------------------------------
       Dropdown Menus
       --------------------------------------------------------- */

    function closeDropdown(dropdown) {
        if (!dropdown) return;

        dropdown.classList.remove("is-open");

        const button = dropdown.querySelector(
            "[data-dropdown-button]"
        );

        if (button) {
            button.setAttribute("aria-expanded", "false");
        }
    }

    function closeAllDropdowns(except) {
        const dropdowns = getElements("[data-dropdown]");

        dropdowns.forEach(function (dropdown) {
            if (dropdown !== except) {
                closeDropdown(dropdown);
            }
        });
    }

    function toggleDropdown(dropdown) {
        if (!dropdown) return;

        const button = dropdown.querySelector(
            "[data-dropdown-button]"
        );

        if (!button) return;

        const isOpen = dropdown.classList.contains("is-open");

        closeAllDropdowns(dropdown);

        if (isOpen) {
            closeDropdown(dropdown);
        } else {
            dropdown.classList.add("is-open");
            button.setAttribute("aria-expanded", "true");
        }
    }

    function setupDropdowns() {
        const dropdowns = getElements("[data-dropdown]");

        dropdowns.forEach(function (dropdown) {
            const button = dropdown.querySelector(
                "[data-dropdown-button]"
            );

            if (!button) return;

            button.setAttribute("aria-expanded", "false");

            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                toggleDropdown(dropdown);
            });
        });

        /*
         * Close dropdowns when clicking elsewhere.
         */
        document.addEventListener("click", function (event) {
            const clickedDropdown = event.target.closest(
                "[data-dropdown]"
            );

            if (!clickedDropdown) {
                closeAllDropdowns();
            }
        });

        /*
         * Close dropdowns with Escape.
         */
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeAllDropdowns();
            }
        });
    }


    /* ---------------------------------------------------------
       Mobile Dropdowns
       --------------------------------------------------------- */

    function setupMobileDropdowns() {
        const dropdowns = getElements(
            "[data-mobile-dropdown]"
        );

        dropdowns.forEach(function (dropdown) {

            const button = dropdown.querySelector(
                "[data-mobile-dropdown-button]"
            );

            const content = dropdown.querySelector(
                "[data-mobile-dropdown-content]"
            );

            if (!button || !content) return;

            button.setAttribute("aria-expanded", "false");

            button.addEventListener("click", function () {
                const isOpen =
                    dropdown.classList.contains("is-open");

                dropdown.classList.toggle("is-open");

                button.setAttribute(
                    "aria-expanded",
                    isOpen ? "false" : "true"
                );
            });
        });
    }


    /* ---------------------------------------------------------
       Active Navigation Link
       --------------------------------------------------------- */

    function normalizePath(path) {
        if (!path) return "/";

        /*
         * Remove query string and hash.
         */
        path = path.split("?")[0].split("#")[0];

        /*
         * Ensure leading slash.
         */
        if (!path.startsWith("/")) {
            path = "/" + path;
        }

        /*
         * Normalize trailing slash.
         */
        if (
            path.length > 1 &&
            !path.endsWith("/")
        ) {
            path += "/";
        }

        return path;
    }

    function setActiveNavigation() {
        const currentPath = normalizePath(
            window.location.pathname
        );

        const links = getElements(
            ".main-nav-link, .mobile-nav-link"
        );

        links.forEach(function (link) {
            const href = link.getAttribute("href");

            if (!href || href.startsWith("#")) {
                return;
            }

            /*
             * Only process same-site paths.
             */
            let linkUrl;

            try {
                linkUrl = new URL(
                    href,
                    window.location.origin
                );
            } catch {
                return;
            }

            if (
                linkUrl.origin !== window.location.origin
            ) {
                return;
            }

            const linkPath = normalizePath(
                linkUrl.pathname
            );

            /*
             * Homepage.
             */
            if (
                currentPath === "/" &&
                linkPath === "/"
            ) {
                link.classList.add("is-active");
                link.setAttribute("aria-current", "page");
                return;
            }

            /*
             * Section matching.
             *
             * Example:
             * /tools/pdf/
             *
             * activates:
             * /tools/
             */
            if (
                linkPath !== "/" &&
                currentPath.startsWith(linkPath)
            ) {
                link.classList.add("is-active");
                link.setAttribute("aria-current", "page");
            }
        });
    }


    /* ---------------------------------------------------------
       Header Scroll State
       --------------------------------------------------------- */

    function setupHeaderScroll() {
        const header = getElement(".site-header");

        if (!header) return;

        function updateHeader() {
            if (window.scrollY > 8) {
                header.classList.add("is-scrolled");
            } else {
                header.classList.remove("is-scrolled");
            }
        }

        updateHeader();

        window.addEventListener(
            "scroll",
            updateHeader,
            {
                passive: true
            }
        );
    }


    /* ---------------------------------------------------------
       Prevent Body Scroll While Mobile Menu Is Open
       --------------------------------------------------------- */

    function setupBodyScrollLock() {
        const style = document.createElement("style");

        style.textContent = `
            body.menu-open {
                overflow: hidden;
            }

            @media (min-width: 901px) {
                body.menu-open {
                    overflow: visible;
                }
            }
        `;

        document.head.appendChild(style);
    }


    /* ---------------------------------------------------------
       Resize Handling
       --------------------------------------------------------- */

    function setupResizeHandler() {
        const button = getElement(
            "[data-mobile-menu-button]"
        );

        const menu = getElement(
            "[data-mobile-menu]"
        );

        if (!button || !menu) return;

        window.addEventListener("resize", function () {
            if (
                window.innerWidth > 900 &&
                button.getAttribute("aria-expanded") === "true"
            ) {
                closeMobileMenu(button, menu);
            }
        });
    }


    /* ---------------------------------------------------------
       Initialize
       --------------------------------------------------------- */

    function initializeNavigation() {
        setupMobileMenu();
        setupDropdowns();
        setupMobileDropdowns();
        setActiveNavigation();
        setupHeaderScroll();
        setupBodyScrollLock();
        setupResizeHandler();
    }


    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeNavigation
        );
    } else {
        initializeNavigation();
    }

})();
