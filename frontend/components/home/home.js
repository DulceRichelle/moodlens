import { t, setLanguage, getLanguage } from "../../services/i18n.js";

export function renderHome(app) {

    app.innerHTML = `
    <link rel="stylesheet" href="components/home/home.css">

    <div class="language-selector">

        <div class="custom-select" id="customSelect">

            <div class="select-selected">

                <span id="selectedLanguage">
                    🇪🇸 Español
                </span>

                <span class="arrow">
                    ⌄
                </span>

            </div>

            <div class="select-options hidden">

                <div class="option" data-lang="es">
                    🇪🇸 Español
                </div>

                <div class="option" data-lang="en">
                    🇬🇧 English
                </div>

                <div class="option" data-lang="fr">
                    🇫🇷 Français
                </div>

                <div class="option" data-lang="de">
                    🇩🇪 Deutsch
                </div>

            </div>

        </div>

    </div>

    <section class="hero">

        <img src="assets/logo.png" class="logo"/>

        <h1>${t("homeTitle")}</h1>

        <p class="subtitle">
            ${t("homeSubtitle")}
        </p>

        <div class="buttons">

            <button
                class="btn-primary"
                onclick="navigate('register')"
            >
                ${t("startNow")} →
            </button>

            <button
                class="btn-secondary"
                onclick="navigate('login')"
            >
                ${t("loginButton")}
            </button>

        </div>

    </section>

    <section class="features">

        <div class="card">

            <div class="icon orange">❤</div>

            <h3>${t("dailyTracking")}</h3>

            <p>
                ${t("dailyTrackingText")}
            </p>

        </div>

        <div class="card">

            <div class="icon blue">📈</div>

            <h3>${t("deepAnalysis")}</h3>

            <p>
                ${t("deepAnalysisText")}
            </p>

        </div>

        <div class="card">

            <div class="icon yellow">📖</div>

            <h3>${t("fullHistory")}</h3>

            <p>
                ${t("fullHistoryText")}
            </p>

        </div>

        <div class="card">

            <div class="icon purple">✨</div>

            <h3>${t("personalizedTips")}</h3>

            <p>
                ${t("personalizedTipsText")}
            </p>

        </div>

    </section>
    `;

    initLanguageSelector(app);
}

function initLanguageSelector(app) {

    const customSelect =
        document.getElementById("customSelect");

    const selectedLanguage =
        document.getElementById("selectedLanguage");

    const options =
        document.querySelectorAll(".option");

    const optionsContainer =
        document.querySelector(".select-options");

    const idiomas = {
        es: "🇪🇸 Español",
        en: "🇬🇧 English",
        fr: "🇫🇷 Français",
        de: "🇩🇪 Deutsch"
    };

    selectedLanguage.textContent =
        idiomas[getLanguage()];

    customSelect
        .querySelector(".select-selected")
        .addEventListener("click", () => {

            optionsContainer
                .classList.toggle("hidden");
        });

    options.forEach(option => {

        option.addEventListener("click", () => {

            const lang =
                option.dataset.lang;

            selectedLanguage.textContent =
                idiomas[lang];

            setLanguage(lang);

            renderHome(app);

            optionsContainer
                .classList.add("hidden");
        });
    });

    document.addEventListener("click", (e) => {

        if (!customSelect.contains(e.target)) {

            optionsContainer
                .classList.add("hidden");
        }
    });
}