/* =========================================================
   DOZNI — Main Site Controller
   File: assets/js/main.js
   ========================================================= */

(function () {
    "use strict";


    /* =========================================================
       1. Global Site Configuration
       ========================================================= */

    const DOZNI = {
        name: "DOZNI",
        url: "https://dozni.com/",
        version: "1.0.0"
    };


    /* =========================================================
       2. DOM Helpers
       ========================================================= */

    const $ = function (selector, parent) {
        return (parent || document).querySelector(
            selector
        );
    };

    const $$ = function (selector, parent) {
        return (parent || document).querySelectorAll(
            selector
        );
    };


    /* =========================================================
       3. External Site Links
       ========================================================= */

    function setupExternalSiteLinks() {

        const links = $$(
            "[data-external-site]"
        );

        links.forEach(function (link) {

            const url =
                link.getAttribute(
                    "data-external-site"
                );

            if (!url) {
                return;
            }

            link.setAttribute(
                "href",
                url
            );

            link.setAttribute(
                "target",
                "_blank"
            );

            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );
        });
    }


    /* =========================================================
       4. Current URL Information
       ========================================================= */

    function getPagePath() {
        return window.location.pathname;
    }


    function getPageSection() {

        const path =
            getPagePath();

        if (
            path === "/" ||
            path === ""
        ) {
            return "home";
        }

        const parts =
            path
                .split("/")
                .filter(Boolean);

        return parts[0] || "home";
    }


    function setPageAttributes() {

        const section =
            getPageSection();

        document.documentElement.setAttribute(
            "data-page-section",
            section
        );

        document.body.setAttribute(
            "data-page-section",
            section
        );
    }


    /* =========================================================
       5. Page Loading State
       ========================================================= */

    function setupPageLoading() {

        document.documentElement.classList.add(
            "page-loading"
        );

        /*
         * Remove the loading state after the
         * page and its main components are ready.
         */
        window.addEventListener(
            "load",
            function () {

                window.setTimeout(
                    function () {

                        document.documentElement.classList.remove(
                            "page-loading"
                        );

                        document.documentElement.classList.add(
                            "page-ready"
                        );

                    },
                    50
                );
            }
        );
    }


    /* =========================================================
       6. Year Helper
       ========================================================= */

    function updateYears() {

        const year =
            new Date().getFullYear();

        $$("[data-year]").forEach(
            function (element) {

                element.textContent =
                    year;
            }
        );
    }


    /* =========================================================
       7. Search Form
       ========================================================= */

    function setupSearchForms() {

        const forms =
            $$("[data-site-search]");

        forms.forEach(
            function (form) {

                form.addEventListener(
                    "submit",
                    function (event) {

                        const input =
                            form.querySelector(
                                "[data-search-input]"
                            );

                        if (!input) {
                            return;
                        }

                        const query =
                            input.value.trim();

                        if (!query) {
                            event.preventDefault();
                            input.focus();
                            return;
                        }

                        /*
                         * Default site search URL.
                         *
                         * This can later be replaced
                         * with the actual DOZNI search
                         * implementation.
                         */
                        const searchUrl =
                            "/search/?q=" +
                            encodeURIComponent(
                                query
                            );

                        event.preventDefault();

                        window.location.href =
                            searchUrl;
                    }
                );
            }
        );
    }


    /* =========================================================
       8. Newsletter / Simple Form Protection
       ========================================================= */

    function setupForms() {

        const forms =
            $$("form[data-prevent-empty]");

        forms.forEach(
            function (form) {

                form.addEventListener(
                    "submit",
                    function (event) {

                        const requiredFields =
                            form.querySelectorAll(
                                "[required]"
                            );

                        let valid = true;

                        requiredFields.forEach(
                            function (field) {

                                if (
                                    !field.value.trim()
                                ) {
                                    valid = false;

                                    field.setAttribute(
                                        "aria-invalid",
                                        "true"
                                    );
                                } else {
                                    field.removeAttribute(
                                        "aria-invalid"
                                    );
                                }
                            }
                        );

                        if (!valid) {
                            event.preventDefault();
                        }
                    }
                );
            }
        );
    }


    /* =========================================================
       9. Keyboard Accessibility
       ========================================================= */

    function setupKeyboardAccessibility() {

        document.addEventListener(
            "keydown",
            function (event) {

                /*
                 * Add a keyboard-user class when
                 * navigation occurs with Tab.
                 */
                if (
                    event.key === "Tab"
                ) {
                    document.documentElement.classList.add(
                        "using-keyboard"
                    );
                }
            }
        );

        document.addEventListener(
            "mousedown",
            function () {

                document.documentElement.classList.remove(
                    "using-keyboard"
                );
            }
        );
    }


    /* =========================================================
       10. Detect Touch Device
       ========================================================= */

    function detectTouchDevice() {

        const isTouch =
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0;

        if (isTouch) {
            document.documentElement.classList.add(
                "is-touch"
            );
        } else {
            document.documentElement.classList.add(
                "is-pointer"
            );
        }
    }


    /* =========================================================
       11. Online / Offline Status
       ========================================================= */

    function setupConnectionStatus() {

        function updateStatus() {

            document.documentElement.toggleAttribute(
                "data-offline",
                !navigator.onLine
            );
        }

        updateStatus();

        window.addEventListener(
            "online",
            updateStatus
        );

        window.addEventListener(
            "offline",
            updateStatus
        );
    }


    /* =========================================================
       12. Prevent Broken Placeholder Links
       ========================================================= */

    function setupPlaceholderLinks() {

        document.addEventListener(
            "click",
            function (event) {

                const link =
                    event.target.closest(
                        'a[href="#"]'
                    );

                if (!link) {
                    return;
                }

                /*
                 * Only prevent the default action.
                 * Actual navigation will be added
                 * when the feature is implemented.
                 */
                event.preventDefault();
            }
        );
    }


    /* =========================================================
       13. Debug Information
       ========================================================= */

    function setupDebugInfo() {

        /*
         * Keep console output disabled by default.
         *
         * Enable with:
         *
         * localStorage.setItem(
         *     "dozni-debug",
         *     "true"
         * );
         */

        const debug =
            localStorage.getItem(
                "dozni-debug"
            ) === "true";

        if (!debug) {
            return;
        }

        console.info(
            "DOZNI",
            DOZNI
        );

        console.info(
            "Page:",
            getPagePath()
        );

        console.info(
            "Section:",
            getPageSection()
        );
    }


    /* =========================================================
       14. Global DOZNI Object
       ========================================================= */

    window.DOZNI = DOZNI;


    /* =========================================================
       15. Initialize
       ========================================================= */

    function initialize() {

        setPageAttributes();

        updateYears();

        setupExternalSiteLinks();

        setupPageLoading();

        setupSearchForms();

        setupForms();

        setupKeyboardAccessibility();

        detectTouchDevice();

        setupConnectionStatus();

        setupPlaceholderLinks();

        setupDebugInfo();

        /*
         * Tell other scripts that the main
         * site controller has initialized.
         */
        document.dispatchEvent(
            new CustomEvent(
                "dozni:main-ready"
            )
        );
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }

})();
