import { getUser, logout } from '../../services/user.service.js';

import { t } from '../../services/i18n.js';

import { renderRegistro } from './registro.js';
import { renderAnalisis } from './analisis.js';
import { renderHistorial } from './historial.js';
import { renderConsejos } from './consejos.js';
import { renderPerfil } from './perfil.js';

let vistaActual =
    localStorage.getItem("currentSection")
    || 'registro';

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
                class="logo-dashboard"
                />

                <div>

                    <h3>MoodLens</h3>

                    <span>
                        ${t("dashboard")}
                    </span>

                </div>

            </div>

            <div class="user-box">

                <div class="avatar">

                    ${user.nombre.charAt(0)}

                </div>

                <div>

                    <strong>
                        ${user.nombre}
                    </strong>

                    <p>
                        ${t("premiumUser")}
                    </p>

                </div>

            </div>

            <div class="menu">

                <button
                    class="menu-item ${vistaActual === 'registro' ? 'active' : ''}"
                    onclick="cargarVista('registro', this)"
                >
                    🏠 ${t("registro")}
                </button>

                <button
                    class="menu-item ${vistaActual === 'analisis' ? 'active' : ''}"
                    onclick="cargarVista('analisis', this)"
                >
                    📊 ${t("analysis")}
                </button>

                <button
                    class="menu-item ${vistaActual === 'historial' ? 'active' : ''}"
                    onclick="cargarVista('historial', this)"
                >
                    🕒 ${t("history")}
                </button>

                <button
                    class="menu-item ${vistaActual === 'consejos' ? 'active' : ''}"
                    onclick="cargarVista('consejos', this)"
                >
                    💡 ${t("tips")}
                </button>

                <button
                    class="menu-item ${vistaActual === 'perfil' ? 'active' : ''}"
                    onclick="cargarVista('perfil', this)"
                >
                    ⚙️ ${t("profile")}
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

    window.cargarVista = cargarVista;

    window.toggleSidebar = toggleSidebar;

    window.handleLogout = handleLogout;

    window.refreshApp = () => {

        renderDashboard(app);
    };

    cargarVista(vistaActual);
}

function cargarVista(vista) {

    vistaActual = vista;

    localStorage.setItem(
        "currentSection",
        vista
    );

    const contenedor =
        document.getElementById(
            'contenidoDashboard'
        );

    if (!contenedor) return;

    contenedor.classList.add("changing");

    setTimeout(() => {

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

        actualizarMenuActivo(vista);

        contenedor.classList.remove("changing");

    }, 180);

    if (window.innerWidth <= 768) {

        document
            .getElementById('sidebar')
            ?.classList.remove('open');
    }
}

function actualizarMenuActivo(vista) {

    const items =
        document.querySelectorAll('.menu-item');

    items.forEach(item => {

        item.classList.remove('active');

        const texto =
            item.getAttribute("onclick");

        if (texto?.includes(vista)) {

            item.classList.add('active');
        }
    });
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

    localStorage.removeItem(
        "currentSection"
    );

    navigate('home');
}