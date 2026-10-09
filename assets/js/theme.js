/* =========================================================
   DOZNI — Theme Manager
   File: assets/js/theme.js
   ========================================================= */

(function () {
    "use strict";

    const STORAGE_KEY = "dozni-theme";
    const root = document.documentElement;

    function getSystemTheme() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    function getSavedTheme() {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (
            saved === "light" ||
            saved === "dark" ||
            saved === "system"
        ) {
            return saved;
        }

        return "system";
    }

    function getEffectiveTheme(theme) {
        return theme === "system" ? getSystemTheme() : theme;
    }

    function applyTheme(theme) {
        const effectiveTheme = getEffectiveTheme(theme);

        root.setAttribute("data-theme", effectiveTheme);
        root.setAttribute("data-theme-preference", theme);

        updateThemeControls(theme);
    }

    function saveTheme(theme) {
        localStorage.setItem(STORAGE_KEY, theme);
        applyTheme(theme);
    }

    function updateThemeControls(theme) {
        const buttons = document.querySelectorAll("[data-theme-value]");

        buttons.forEach(function (button) {
            const value = button.getAttribute("data-theme-value");

            button.setAttribute(
                "aria-pressed",
                value === theme ? "true" : "false"
            );
        });

        const toggle = document.querySelector("[data-theme-toggle]");

        if (toggle) {
            const effectiveTheme = getEffectiveTheme(theme);

            toggle.setAttribute(
                "aria-label",
                effectiveTheme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
            );

            toggle.setAttribute(
                "title",
                effectiveTheme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
            );
        }
    }

    function toggleTheme() {
        const current = root.getAttribute("data-theme") || "light";

        const next = current === "dark"
            ? "light"
            : "dark";

        saveTheme(next);
    }

    function setupThemeControls() {
        document.addEventListener("click", function (event) {

            const valueButton = event.target.closest("[data-theme-value]");

            if (valueButton) {
                const value = valueButton.getAttribute("data-theme-value");

                if (
                    value === "light" ||
                    value === "dark" ||
                    value === "system"
                ) {
                    saveTheme(value);
                }

                return;
            }

            const toggle = event.target.closest("[data-theme-toggle]");

            if (toggle) {
                toggleTheme();
            }
        });
    }

    function watchSystemTheme() {
        const mediaQuery = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

        function handleChange() {
            const preference = getSavedTheme();

            if (preference === "system") {
                applyTheme("system");
            }
        }

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handleChange);
        } else {
            mediaQuery.addListener(handleChange);
        }
    }

    function initialize() {
        const theme = getSavedTheme();

        applyTheme(theme);
        setupThemeControls();
        watchSystemTheme();
    }

    /*
     * Apply the theme as early as possible.
     * This reduces the light/dark flash during page loading.
     */
    const initialTheme = getSavedTheme();

    root.setAttribute(
        "data-theme",
        getEffectiveTheme(initialTheme)
    );

    root.setAttribute(
        "data-theme-preference",
        initialTheme
    );

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }

})();
