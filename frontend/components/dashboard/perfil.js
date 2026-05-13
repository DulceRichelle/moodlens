import { getUser } from "../../services/user.service.js";

import {
    t,
    setLanguage,
    getLanguage
} from "../../services/i18n.js";

export async function renderPerfil(app) {

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

                        <div class="online-indicator"></div>

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

                ✨ Premium Mind Tracker

            </div>

        </div>

        <div class="hero-stats">

            <div class="hero-stat">

                <h3 id="heroEntries">
                    0
                </h3>

                <p>
                    ${t("totalEntries")}
                </p>

            </div>

            <div class="hero-stat">

                <h3 id="heroDays">
                    0
                </h3>

                <p>
                    ${t("activeDays")}
                </p>

            </div>

            <div class="hero-stat">

                <h3 id="heroMood">
                    😊
                </h3>

                <p>
                    ${t("mainMood")}
                </p>

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
                        Streak
                    </p>

                </div>

                <div class="mini-progress">

                    <h3 id="nivel">
                        Lv.1
                    </h3>

                    <p>
                        Emotional Explorer
                    </p>

                </div>

            </div>

        </div>

    </section>

    <div class="insights-grid">

        <div class="insight-card">

            <div class="insight-icon">
                🌙
            </div>

            <h3>
                Emotional Insight
            </h3>

            <p>
                You are becoming more consistent with your emotional tracking journey.
            </p>

        </div>

        <div class="insight-card">

            <div class="insight-icon">
                💙
            </div>

            <h3>
                Calm Moments
            </h3>

            <p>
                Tracking your calm days helps identify healthier routines and habits.
            </p>

        </div>

        <div class="insight-card">

            <div class="insight-icon">
                ✨
            </div>

            <h3>
                Personal Growth
            </h3>

            <p>
                Small emotional reflections create powerful long-term self awareness.
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
                    Soon
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
                🏆 Achievements
            </h2>

            <div class="setting-item">

                <div>

                    <h3>
                        🔥 First Streak
                    </h3>

                    <p>
                        Logged emotions for consecutive days.
                    </p>

                </div>

                <span class="setting-badge active">
                    Unlocked
                </span>

            </div>

            <div class="setting-item">

                <div>

                    <h3>
                        ✨ Self Awareness
                    </h3>

                    <p>
                        Reached multiple emotional entries.
                    </p>

                </div>

                <span class="setting-badge">
                    Progress
                </span>

            </div>

        </div>

        <div class="perfil-card">

            <h2>
                🚪 ${t("session")}
            </h2>

            <p style="color:#6F6A97;line-height:1.7;">

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

    avatar.innerHTML = `
        ${user.nombre?.charAt(0).toUpperCase() || "U"}
        <div class="online-indicator"></div>
    `;

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

    const emocionTop =
        obtenerEmocionTop(registros);

    document.getElementById("heroEntries")
        .textContent = registros.length;

    document.getElementById("heroDays")
        .textContent = diasActivos;

    document.getElementById("heroMood")
        .textContent = emocionTop;

    document.getElementById("diasActivos")
        .textContent = diasActivos;

    document.getElementById("consistencia")
        .textContent = `
            ${calcularConstancia(diasActivos)}%
        `;

    document.getElementById("racha")
        .textContent = `🔥 ${diasActivos}`;

    document.getElementById("nivel")
        .textContent = `
            Lv.${Math.max(
        1,
        Math.floor(registros.length / 5)
    )}
        `;

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

function obtenerEmocionTop(registros){

    if(!registros.length){

        return "🌸";
    }

    const contador = {};

    registros.forEach(r => {

        contador[r.nombre_emocion] =
            (contador[r.nombre_emocion] || 0) + 1;
    });

    let top = null;

    let max = 0;

    for(const emocion in contador){

        if(contador[emocion] > max){

            max = contador[emocion];

            top = emocion;
        }
    }

    const emojis = {

        feliz:"😊",
        tranquilo:"💙",
        neutral:"😐",
        triste:"😢",
        ansioso:"😖"
    };

    return emojis[top?.toLowerCase()] || "🌸";
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