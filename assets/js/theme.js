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

        if (saved === "light" || saved === "dark" || saved === "system") return saved;
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
            button.setAttribute("aria-pressed", value === theme ? "true" : "false");
        });

        const toggle = document.querySelector("[data-theme-toggle]");

        if (toggle) {
            const effectiveTheme = getEffectiveTheme(theme);
            toggle.setAttribute(
                "aria-label",
                effectiveTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"
            );
            toggle.setAttribute(
                "title",
                effectiveTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"
            );
        }
    }

    function toggleTheme() {
        const current = root.getAttribute("data-theme") || "light";
        saveTheme(current === "dark" ? "light" : "dark");
    }

    function setupThemeControls() {
        document.addEventListener("click", function (event) {
            const valueButton = event.target.closest("[data-theme-value]");

            if (valueButton) {
                const value = valueButton.getAttribute("data-theme-value");
                if (value === "light" || value === "dark" || value === "system") saveTheme(value);
                return;
            }

            const toggle = event.target.closest("[data-theme-toggle]");
            if (toggle) toggleTheme();
        });
    }

    function watchSystemTheme() {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        function handleChange() {
            if (getSavedTheme() === "system") applyTheme("system");
        }

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handleChange);
        } else {
            mediaQuery.addListener(handleChange);
        }
    }

    function setupCardArrows() {
        const style = document.createElement("style");
        style.textContent = `
            .card-arrow {
                bottom: 18px !important;
                padding: 0 !important;
                display: grid !important;
                place-items: center !important;
                position: absolute !important;
                line-height: 0 !important;
                font-size: 0 !important;
                text-indent: -9999px !important;
                overflow: hidden !important;
            }
            .card-arrow::before {
                content: "";
                position: absolute;
                left: 50%;
                top: 50%;
                width: 15px;
                height: 2px;
                background: currentColor;
                border-radius: 2px;
                transform: translate(-50%, -50%);
            }
            .card-arrow::after {
                content: "";
                position: absolute;
                left: calc(50% + 4px);
                top: 50%;
                width: 7px;
                height: 7px;
                border-top: 2px solid currentColor;
                border-right: 2px solid currentColor;
                border-radius: 1px;
                transform: translate(-50%, -50%) rotate(45deg);
                box-sizing: border-box;
            }
            @media (max-width: 600px) {
                .card-arrow { bottom: 14px !important; }
            }
        `;
        document.head.appendChild(style);
    }

    function setupHowToResponsive() {
        const style = document.createElement("style");
        style.textContent = `
            /* Mobile How To: use the same wide theme container, keep all steps
               together, then place the large checklist illustration underneath. */
            @media (max-width: 900px) {
                .dozni-howto-section {
                    position: relative !important;
                    display: block !important;
                    width: min(calc(100% - 40px), var(--container-width)) !important;
                }

                .dozni-howto-header {
                    padding-right: 0 !important;
                    margin-bottom: 32px !important;
                }

                .dozni-howto-copy {
                    width: 100% !important;
                }

                .dozni-howto-art {
                    position: static !important;
                    width: 190px !important;
                    height: 190px !important;
                    margin: 38px auto 0 !important;
                    display: grid !important;
                    place-items: center !important;
                }

                .dozni-howto-icon {
                    width: 190px !important;
                    height: 190px !important;
                }
            }

            @media (max-width: 700px) {
                .dozni-howto-section {
                    width: min(calc(100% - 40px), var(--container-width)) !important;
                    padding: 62px 0 70px !important;
                }

                .dozni-howto-header {
                    margin-bottom: 30px !important;
                    padding-right: 0 !important;
                }

                .dozni-section-title {
                    font-size: clamp(2rem, 8.5vw, 2.7rem) !important;
                    line-height: 1.08 !important;
                }

                .dozni-section-text {
                    font-size: 1rem !important;
                    line-height: 1.7 !important;
                    max-width: 100% !important;
                }

                .dozni-howto-steps {
                    width: 100% !important;
                    gap: 16px !important;
                }

                .dozni-howto-step {
                    grid-template-columns: 36px minmax(0, 1fr) !important;
                    gap: 14px !important;
                    align-items: center !important;
                }

                .dozni-howto-number {
                    width: 36px !important;
                    height: 36px !important;
                    font-size: .94rem !important;
                }

                .dozni-howto-step p {
                    padding-top: 0 !important;
                    font-size: 1rem !important;
                    line-height: 1.6 !important;
                }

                .dozni-howto-art {
                    width: 190px !important;
                    height: 190px !important;
                    margin: 42px auto 0 !important;
                }

                .dozni-howto-icon {
                    width: 190px !important;
                    height: 190px !important;
                }
            }

            @media (max-width: 380px) {
                .dozni-howto-section {
                    width: calc(100% - 40px) !important;
                }

                .dozni-howto-art {
                    width: 170px !important;
                    height: 170px !important;
                    margin-top: 38px !important;
                }

                .dozni-howto-icon {
                    width: 170px !important;
                    height: 170px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function initialize() {
        const theme = getSavedTheme();
        applyTheme(theme);
        setupThemeControls();
        watchSystemTheme();
        setupCardArrows();
        setupHowToResponsive();
    }

    const initialTheme = getSavedTheme();
    root.setAttribute("data-theme", getEffectiveTheme(initialTheme));
    root.setAttribute("data-theme-preference", initialTheme);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
})();
