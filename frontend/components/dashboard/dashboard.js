import { getUser, logout } from '../../services/user.service.js';

import {
    t,
    setLanguage,
    getLanguage
} from '../../services/i18n.js';

import { renderRegistro } from './registro.js';
import { renderAnalisis } from './analisis.js';
import { renderHistorial } from './historial.js';
import { renderConsejos } from './consejos.js';
import { renderPerfil } from './perfil.js';

export function renderDashboard(app) {

    const user = getUser();

    if (!user) {

        navigate('login');
        return;
    }

    app.innerHTML = `

    <link rel="stylesheet" href="components/dashboard/dashboard.css">

    <div class="dashboard-layout">

        <aside class="sidebar" id="sidebar">

            <div class="logo-section">

                <img
                    src="assets/logo.png"
                    class="logo"
                />

                <div>

                    <h3>MoodLens</h3>

                    <span>${t("dashboard")}</span>

                </div>

            </div>

            <div class="user-box">

                <div class="avatar">
                    ${user.nombre.charAt(0)}
                </div>

                <div>

                    <strong>${user.nombre}</strong>

                    <p>${t("premiumUser")}</p>

                </div>

            </div>

            <div class="language-box">

                <select id="languageSelect">

                    <option value="es">🇪🇸 ES</option>

                    <option value="en">🇬🇧 EN</option>

                    <option value="fr">🇫🇷 FR</option>

                    <option value="de">🇩🇪 DE</option>

                </select>

            </div>

            <div class="menu">

                <button
                    class="menu-item active"
                    onclick="cargarVista('registro', this)"
                >
                    🏠 ${t("registro")}
                </button>

                <button
                    class="menu-item"
                    onclick="cargarVista('analisis', this)"
                >
                    📊 ${t("analisis")}
                </button>

                <button
                    class="menu-item"
                    onclick="cargarVista('historial', this)"
                >
                    🕒 ${t("historial")}
                </button>

                <button
                    class="menu-item"
                    onclick="cargarVista('consejos', this)"
                >
                    💡 ${t("consejos")}
                </button>

                <button
                    class="menu-item"
                    onclick="cargarVista('perfil', this)"
                >
                    ⚙️ ${t("perfil")}
                </button>

            </div>

            <button
                class="logout"
                onclick="handleLogout()"
            >
                ${t("logout")}
            </button>

        </aside>

        <main class="main-content">

            <button
                class="menu-toggle"
                onclick="toggleSidebar()"
            >
                ☰
            </button>

            <div id="contenidoDashboard"></div>

        </main>

    </div>
    `;

    initLanguageSelector();

    window.cargarVista = cargarVista;
    window.toggleSidebar = toggleSidebar;
    window.handleLogout = handleLogout;

    cargarVista('registro');
}

function initLanguageSelector() {

    const select =
        document.getElementById("languageSelect");

    if (!select) return;

    select.value = getLanguage();

    select.addEventListener("change", (e) => {

        setLanguage(e.target.value);

    });
}

function cargarVista(vista, element = null) {

    const contenedor =
        document.getElementById('contenidoDashboard');

    if (!contenedor) return;

    switch (vista) {

        case 'registro':
            renderRegistro(contenedor);
            break;

        case 'analisis':
            renderAnalisis(contenedor);
            break;

        case 'historial':
            renderHistorial(contenedor);
            break;

        case 'consejos':
            renderConsejos(contenedor);
            break;

        case 'perfil':
            renderPerfil(contenedor);
            break;
    }

    actualizarMenuActivo(element);

    if (window.innerWidth <= 768) {

        document
            .getElementById('sidebar')
            .classList.remove('open');
    }
}

function actualizarMenuActivo(element) {

    const items =
        document.querySelectorAll('.menu-item');

    items.forEach(item => {

        item.classList.remove('active');

    });

    if (element) {

        element.classList.add('active');

    } else {

        items[0]?.classList.add('active');
    }
}

function toggleSidebar() {

    const sidebar =
        document.getElementById('sidebar');

    if (sidebar) {

        sidebar.classList.toggle('open');
    }
}

function handleLogout() {

    logout();

    navigate('home');
}