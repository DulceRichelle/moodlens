import {
    t,
    setLanguage,
    getLanguage
} from "../../services/i18n.js";

export function renderHome(app) {

    app.innerHTML = `
    <link rel="stylesheet" href="components/home/home.css">

    <div class="language-selector">

        <div class="custom-select" id="customSelect">

            <div class="select-selected" id="selectSelected">

                <span id="selectedLanguage">
                    <span class="flag">🇪🇸</span>
                    Español
                </span>

                <span class="arrow" id="selectArrow">
                    ⌄
                </span>

            </div>

            <div class="select-options hidden" id="optionsContainer">

                <div class="option" data-lang="es">

                    <span class="flag">🇪🇸</span>
                    Español

                </div>

                <div class="option" data-lang="en">

                    <span class="flag">🇬🇧</span>
                    English

                </div>

                <div class="option" data-lang="fr">

                    <span class="flag">🇫🇷</span>
                    Français

                </div>

                <div class="option" data-lang="de">

                    <span class="flag">🇩🇪</span>
                    Deutsch

                </div>

            </div>

        </div>

    </div>

    <section class="hero">

        <img
            src="assets/logo.png"
            class="logo"
        />

        <h1>
            ${t("homeTitle")}
        </h1>

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

            <div class="icon orange">
                ❤
            </div>

            <h3>
                ${t("dailyTracking")}
            </h3>

            <p>
                ${t("dailyTrackingText")}
            </p>

        </div>

        <div class="card">

            <div class="icon blue">
                📈
            </div>

            <h3>
                ${t("deepAnalysis")}
            </h3>

            <p>
                ${t("deepAnalysisText")}
            </p>

        </div>

        <div class="card">

            <div class="icon yellow">
                📖
            </div>

            <h3>
                ${t("fullHistory")}
            </h3>

            <p>
                ${t("fullHistoryText")}
            </p>

        </div>

        <div class="card">

            <div class="icon purple">
                ✨
            </div>

            <h3>
                ${t("personalizedTips")}
            </h3>

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

    const selectSelected =
        document.getElementById("selectSelected");

    const selectArrow =
        document.getElementById("selectArrow");

    const options =
        document.querySelectorAll(".option");

    const optionsContainer =
        document.getElementById("optionsContainer");

    const idiomas = {

        es: `
            <span class="flag">🇪🇸</span>
            Español
        `,

        en: `
            <span class="flag">🇬🇧</span>
            English
        `,

        fr: `
            <span class="flag">🇫🇷</span>
            Français
        `,

        de: `
            <span class="flag">🇩🇪</span>
            Deutsch
        `
    };

    selectedLanguage.innerHTML =
        idiomas[getLanguage()];

    selectSelected.addEventListener(
        "click",
        () => {

            optionsContainer
                .classList.toggle("hidden");

            selectArrow
                .classList.toggle("rotate");
        }
    );

    options.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                const lang =
                    option.dataset.lang;

                selectedLanguage.innerHTML =
                    idiomas[lang];

                optionsContainer
                    .classList.add("hidden");

                selectArrow
                    .classList.remove("rotate");

                document.body.classList.add(
                    "page-transition"
                );

                setTimeout(() => {

                    setLanguage(lang);

                    renderHome(app);

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }, 180);
            }
        );
    });

    document.addEventListener(
        "click",
        (e) => {

            if (
                !customSelect.contains(e.target)
            ) {

                optionsContainer
                    .classList.add("hidden");

                selectArrow
                    .classList.remove("rotate");
            }
        }
    );
}