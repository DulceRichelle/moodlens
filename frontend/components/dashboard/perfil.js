import { getUser } from "../../services/user.service.js";

import {
    t,
    setLanguage,
    getLanguage
} from "../../services/i18n.js";

export async function renderPerfil(app) {

    const savedTheme =
        localStorage.getItem("moodlens-theme") || "auto";

    aplicarTema(savedTheme);

    app.innerHTML = `
<link rel="stylesheet" href="components/dashboard/perfil.css">

<div class="perfil-page">

    <div class="perfil-hero">

        <div class="hero-top">

            <div class="hero-left">

                <div class="avatar-wrapper">

                    <div class="avatar-glow"></div>

                    <div class="avatar-grande">
                        U
                    </div>

                </div>

                <div class="hero-info">

                    <h1>
                        MoodLens
                    </h1>

                    <p>
                        ${t("perfilSubtitle")}
                    </p>

                    <span id="memberSince"></span>

                </div>

            </div>

            <div class="hero-badge">
                🌙 Mindful Journey
            </div>

        </div>

    </div>

    <section class="progress-section">

        <div class="progress-card">

            <div class="progress-header">

                <h2>
                    ${t("yourProgress")}
                </h2>

                <p>
                    ${t("reviewRecords")}
                </p>

            </div>

            <div class="progress-grid">

                <div class="mini-progress">

                    <h3 id="diasActivos">
                        0
                    </h3>

                    <p>
                        ${t("activeDays")}
                    </p>

                </div>

                <div class="mini-progress">

                    <h3 id="consistencia">
                        0%
                    </h3>

                    <p>
                        ${t("consistency")}
                    </p>

                </div>

                <div class="mini-progress">

                    <h3 id="racha">
                        🔥 0
                    </h3>

                    <p>
                        ${t("streak")}
                    </p>

                </div>

            </div>

        </div>

    </section>

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
                >

            </div>

            <div class="form-group">

                <label>
                    Email
                </label>

                <input
                    type="email"
                    id="emailPerfil"
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
                🌍 ${t("preferences")}
            </h2>

            <div class="custom-select" id="customSelect">

                <div class="select-selected">

                    <span id="selectedLanguage"></span>

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

            <div class="theme-section">

                <div class="theme-info">

                    <h3>
                        🌗 Tema visual
                    </h3>

                    <p>
                        Cambia automáticamente según tu dispositivo o elige un modo manual.
                    </p>

                </div>

                <div class="theme-switcher">

                    <button class="theme-btn ${savedTheme === "light" ? "active" : ""}" data-theme="light">
                        ☀️
                    </button>

                    <button class="theme-btn ${savedTheme === "dark" ? "active" : ""}" data-theme="dark">
                        🌙
                    </button>

                    <button class="theme-btn ${savedTheme === "auto" ? "active" : ""}" data-theme="auto">
                        Auto
                    </button>

                </div>

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
                🚪 ${t("session")}
            </h2>

            <p class="logout-text">

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

    initPerfil(app);
}

async function initPerfil(app){

    const user = getUser();

    if(!user) return;

    const avatar =
        document.querySelector(".avatar-grande");

    avatar.innerHTML =
        user.nombre?.charAt(0).toUpperCase() || "U";

    document.querySelector(".hero-info h1")
        .innerHTML = `
            ${t("hello")},
            ${user.nombre} ✨
        `;

    document.getElementById("nombrePerfil")
        .value = user.nombre || "";

    document.getElementById("emailPerfil")
        .value = user.email || "";

    document.getElementById("memberSince")
        .textContent = `
            ${t("memberSince")}
            ${formatearFecha(
        user.fecha_registro ||
        user.created_at ||
        new Date()
    )}
        `;

    let registros = [];

    try{

        const res = await fetch(
            `https://moodlens-oj88.onrender.com/api/emociones/${user.id_usuario || user.id}`
        );

        registros = await res.json();

    }catch(error){

        console.log(error);
    }

    const diasActivos =
        calcularDiasActivos(registros);

    const racha =
        calcularRacha(registros);

    document.getElementById("diasActivos")
        .textContent = diasActivos;

    document.getElementById("consistencia")
        .textContent = `
            ${calcularConstancia(diasActivos)}%
        `;

    document.getElementById("racha")
        .textContent = `🔥 ${racha}`;

    initLanguageSelector(app);

    document
        .getElementById("guardarPerfilBtn")
        .addEventListener("click", guardarPerfil);

    document
        .getElementById("logoutBtn")
        .addEventListener("click", () => {

            localStorage.removeItem("user");

            navigate("login");
        });

    document
        .querySelectorAll(".theme-btn")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                const theme =
                    btn.dataset.theme;

                localStorage.setItem(
                    "moodlens-theme",
                    theme
                );

                aplicarTema(theme);

                document
                    .querySelectorAll(".theme-btn")
                    .forEach(b => b.classList.remove("active"));

                btn.classList.add("active");
            });
        });

    async function guardarPerfil(){

        const nuevoNombre =
            document
                .getElementById("nombrePerfil")
                .value
                .trim();

        if(!nuevoNombre){

            mostrarToast(t("emptyName"));

            return;
        }

        try{

            await fetch(
                `https://moodlens-oj88.onrender.com/api/usuarios/${user.id_usuario || user.id}`,
                {
                    method:"PUT",

                    headers:{
                        "Content-Type":
                            "application/json"
                    },

                    body:JSON.stringify({
                        nombre:nuevoNombre
                    })
                }
            );

            user.nombre = nuevoNombre;

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            mostrarToast(
                t("profileUpdated")
            );

            renderPerfil(app);

        }catch(error){

            console.log(error);

            mostrarToast(
                t("saveError")
            );
        }
    }
}

function aplicarTema(theme){

    const root =
        document.documentElement;

    if(theme === "dark"){

        root.classList.add("dark-theme");

    }else if(theme === "light"){

        root.classList.remove("dark-theme");

    }else{

        const systemDark =
            window.matchMedia("(prefers-color-scheme: dark)").matches;

        root.classList.toggle(
            "dark-theme",
            systemDark
        );
    }
}

function initLanguageSelector(app){

    const customSelect =
        document.getElementById("customSelect");

    const selectedLanguage =
        document.getElementById("selectedLanguage");

    const optionsContainer =
        document.querySelector(".select-options");

    const options =
        document.querySelectorAll(".option");

    const idiomas = {

        es:"🇪🇸 Español",
        en:"🇬🇧 English",
        fr:"🇫🇷 Français",
        de:"🇩🇪 Deutsch"
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

            setLanguage(lang);

            localStorage.setItem(
                "currentSection",
                "perfil"
            );

            renderPerfil(app);
        });
    });

    document.addEventListener("click", e => {

        if(!customSelect.contains(e.target)){

            optionsContainer
                .classList.add("hidden");
        }
    });
}

function calcularDiasActivos(registros){

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

function calcularConstancia(dias){

    return Math.min(
        Math.round((dias / 30) * 100),
        100
    );
}

function calcularRacha(registros){

    if(!registros.length) return 0;

    const fechas = registros
        .map(r => new Date(r.fecha))
        .sort((a,b) => b - a);

    let streak = 1;

    for(let i = 0; i < fechas.length - 1; i++){

        const actual =
            new Date(fechas[i]);

        const siguiente =
            new Date(fechas[i + 1]);

        actual.setHours(0,0,0,0);
        siguiente.setHours(0,0,0,0);

        const diferencia =
            (actual - siguiente) /
            (1000 * 60 * 60 * 24);

        if(diferencia === 1){

            streak++;

        }else{

            break;
        }
    }

    return streak;
}

function mostrarToast(msg){

    const toast =
        document.createElement("div");

    toast.className = "toast";

    toast.textContent = msg;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    },100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        },300);

    },2500);
}

function formatearFecha(fecha){

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
                day:"numeric",
                month:"long",
                year:"numeric"
            }
        );
}