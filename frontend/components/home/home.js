import { t, setLanguage, getLanguage } from "../../services/i18n.js";

export function renderHome(app) {

    app.innerHTML = `
    <link rel="stylesheet" href="components/home/home.css">

    <div class="language-selector">

        <select id="languageSelect">

            <option value="es">🇪🇸 Español</option>

            <option value="en">🇬🇧 English</option>

            <option value="fr">🇫🇷 Français</option>

            <option value="de">🇩🇪 Deutsch</option>

        </select>

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

    const languageSelect =
        document.getElementById("languageSelect");

    languageSelect.value =
        getLanguage();

    languageSelect.addEventListener(
        "change",
        (e) => {

            setLanguage(e.target.value);

            renderHome(app);
        }
    );
}