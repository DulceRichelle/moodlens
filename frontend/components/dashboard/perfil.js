import { getUser } from "../../services/user.service.js";

import {
    t,
    setLanguage,
    getLanguage
} from "../../services/i18n.js";

export async function renderPerfil(app) {

    const user = getUser();

    let registros = [];

    try {

        const res = await fetch(
            `https://moodlens-oj88.onrender.com/api/emociones/${user.id_usuario || user.id}`
        );

        registros = await res.json();

    } catch (error) {

        console.log(error);
    }

    const diasActivos =
        calcularDiasActivos(registros);

    const fechaRegistro =
        user.fecha_registro ||
        user.created_at ||
        new Date();

    app.innerHTML = `

    <link rel="stylesheet" href="components/dashboard/perfil.css">

    <div class="perfil-page">

        <div class="perfil-hero">

            <div class="hero-left">

                <div class="avatar-grande">

                    ${user?.nombre?.charAt(0).toUpperCase() || "U"}

                </div>

                <div class="hero-info">

                    <h1>

                        ${t("hello")},
                        ${user?.nombre || "Usuario"} ✨

                    </h1>

                    <p>

                        ${t("perfilSubtitle")}

                    </p>

                    <span>

                        ${t("memberSince")}
                        ${formatearFecha(fechaRegistro)}

                    </span>

                </div>

            </div>

        </div>

        <div class="stats-grid">

            <div class="stat-card">

                <div class="stat-icon">
                    🔥
                </div>

                <h2>
                    ${diasActivos}
                </h2>

                <p>
                    ${t("activeDays")}
                </p>

            </div>

        </div>

        <div class="perfil-grid">

            <div class="perfil-card">

                <h2>
                    👤 ${t("account")}
                </h2>

                <div class="form-group">

                    <label>
                        ${t("name")}
                    </label>

                    <input
                        type="text"
                        id="nombrePerfil"
                        value="${user?.nombre || ""}"
                    >

                </div>

                <div class="form-group">

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        value="${user?.email || ""}"
                        disabled
                    >

                </div>

                <button
                    class="btn-guardar"
                    id="guardarPerfilBtn"
                >

                    ${t("saveChanges")}

                </button>

            </div>

            <div class="perfil-card">

                <h2>
                    ⚙ ${t("preferences")}
                </h2>

                <div class="setting-language">

                    <label>

                        🌍 ${t("language")}

                    </label>

                    <div class="custom-select" id="customSelect">

                        <div class="select-selected">

                            <span id="selectedLanguage">

                                <span class="flag">🇪🇸</span>
                                Español

                            </span>

                            <span class="arrow">
                                ⌄
                            </span>

                        </div>

                        <div class="select-options hidden">

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

                <div class="setting-item">

                    <div>

                        <h3>
                            🔔 ${t("notifications")}
                        </h3>

                        <p>

                            ${t("emotionalReminders")}

                        </p>

                    </div>

                    <span class="setting-badge">

                        ${t("comingSoon")}

                    </span>

                </div>

                <div class="setting-item">

                    <div>

                        <h3>
                            📥 ${t("exportData")}
                        </h3>

                        <p>

                            ${t("downloadHistory")}

                        </p>

                    </div>

                    <span class="setting-badge">

                        Beta

                    </span>

                </div>

                <div class="setting-item">

                    <div>

                        <h3>
                            🔒 ${t("privacy")}
                        </h3>

                        <p>

                            ${t("privateEmotions")}

                        </p>

                    </div>

                    <span class="setting-badge active">

                        ${t("active")}

                    </span>

                </div>

            </div>

            <div class="perfil-card">

                <h2>
                    💌 ${t("support")}
                </h2>

                <div class="support-box">

                    <p>

                        ${t("supportText")}

                    </p>

                    <button
                        class="btn-secondary"
                        id="supportBtn"
                    >

                        ${t("contactSupport")}

                    </button>

                </div>

            </div>

            <div class="perfil-card logout-card">

                <h2>
                    🚪 ${t("session")}
                </h2>

                <p>

                    ${t("logoutText")}

                </p>

                <button
                    class="logout-btn"
                    id="logoutBtn"
                >

                    ${t("logout")}

                </button>

            </div>

        </div>

    </div>
    `;

    initPerfil(user, app);
}

function initPerfil(user, app) {

    const guardarBtn =
        document.getElementById(
            "guardarPerfilBtn"
        );

    if (guardarBtn) {

        guardarBtn.addEventListener(
            "click",
            async () => {

                const nuevoNombre =
                    document
                        .getElementById(
                            "nombrePerfil"
                        )
                        .value
                        .trim();

                if (!nuevoNombre) {

                    mostrarToast(
                        t("emptyName")
                    );

                    return;
                }

                try {

                    await fetch(
                        `https://moodlens-oj88.onrender.com/api/usuarios/${user.id_usuario || user.id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                nombre: nuevoNombre
                            })
                        }
                    );

                    user.nombre =
                        nuevoNombre;

                    localStorage.setItem(
                        "user",
                        JSON.stringify(user)
                    );

                    mostrarToast(
                        t("profileUpdated")
                    );

                    navigate("perfil");

                } catch (error) {

                    console.log(error);

                    mostrarToast(
                        t("saveError")
                    );
                }
            }
        );
    }

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "user"
                );

                navigate("login");
            }
        );
    }

    const supportBtn =
        document.getElementById("supportBtn");

    if (supportBtn) {

        supportBtn.addEventListener(
            "click",
            () => {

                mostrarToast(
                    t("supportSoon")
                );
            }
        );
    }

    const customSelect =
        document.getElementById("customSelect");

    const selectedLanguage =
        document.getElementById("selectedLanguage");

    const options =
        document.querySelectorAll(".option");

    const optionsContainer =
        document.querySelector(".select-options");

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

            selectedLanguage.innerHTML =
                idiomas[lang];

            localStorage.setItem(
                "currentSection",
                "perfil"
            );

            setLanguage(lang);

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

function calcularDiasActivos(registros) {

    const dias = [

        ...new Set(

            registros.map(r =>

                new Date(r.fecha)
                    .toDateString()
            )
        )
    ];

    return dias.length;
}

function mostrarToast(msg) {

    const toast =
        document.createElement("div");

    toast.className = "toast";

    toast.textContent = msg;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);
}

function formatearFecha(fecha) {

    return new Date(fecha)
        .toLocaleDateString(
            getLanguage() === "en"
                ? "en-US"
                : getLanguage() === "fr"
                    ? "fr-FR"
                    : getLanguage() === "de"
                        ? "de-DE"
                        : "es-ES",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
}