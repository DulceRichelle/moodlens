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

                    <h3 id="nivel">
                        Lv.1
                    </h3>

                    <p>
                        ${t("level")}
                    </p>

                </div>

            </div>

        </div>

    </section>

    <div class="insights-grid">

        <div class="insight-card">

            <div class="insight-icon">
                📈
            </div>

            <h3>
                ${t("totalRecords")}
            </h3>

            <p id="totalRegistros">
                0 registros emocionales guardados.
            </p>

        </div>

        <div class="insight-card">

            <div class="insight-icon">
                🧠
            </div>

            <h3>
                ${t("mostUsedEmotion")}
            </h3>

            <p id="emocionFrecuente">
                Sin datos suficientes todavía.
            </p>

        </div>

        <div class="insight-card">

            <div class="insight-icon">
                📅
            </div>

            <h3>
                ${t("lastRecord")}
            </h3>

            <p id="ultimoRegistro">
                No hay registros recientes.
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
                        🌙 Dark mode
                    </h3>

                    <p>
                        Automático según tu dispositivo
                    </p>

                </div>

                <span class="setting-badge active">
                    Auto
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

    document.getElementById("diasActivos")
        .textContent = diasActivos;

    document.getElementById("consistencia")
        .textContent = `
            ${calcularConstancia(diasActivos)}%
        `;

    document.getElementById("nivel")
        .textContent = `
            Lv.${Math.max(
        1,
        Math.floor(registros.length / 5)
    )}
        `;

    document.getElementById("totalRegistros")
        .textContent = `
            ${registros.length} registros emocionales guardados.
        `;

    const emocionMasUsada =
        obtenerEmocionFrecuente(registros);

    document.getElementById("emocionFrecuente")
        .textContent =
        emocionMasUsada;

    const ultimo =
        obtenerUltimoRegistro(registros);

    document.getElementById("ultimoRegistro")
        .textContent = ultimo;

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

function obtenerEmocionFrecuente(registros){

    if(!registros.length){

        return "Sin datos suficientes todavía.";
    }

    const contador = {};

    registros.forEach(r => {

        const emocion =
            r.emocion || "Emoción";

        contador[emocion] =
            (contador[emocion] || 0) + 1;
    });

    const favorita =
        Object.entries(contador)
            .sort((a,b) => b[1] - a[1])[0][0];

    return `La emoción más registrada es "${favorita}".`;
}

function obtenerUltimoRegistro(registros){

    if(!registros.length){

        return "No hay registros recientes.";
    }

    const ordenados =
        [...registros].sort(
            (a,b) =>
                new Date(b.fecha) -
                new Date(a.fecha)
        );

    const ultimo =
        new Date(ordenados[0].fecha);

    return `
        Último registro:
        ${ultimo.toLocaleDateString()}
    `;
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