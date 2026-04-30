import { renderDashboard } from "../components/dashboard/dashboard.js";
import { renderRegister } from "../components/register/register.js";
import { renderLogin } from "../components/login/login.js";
import { renderHome } from "../components/home/home.js";

import { renderRegistro } from "../components/dashboard/registro.js";
import { renderAnalisis } from "../components/dashboard/analisis.js";
import { renderHistorial } from "../components/dashboard/historial.js";
import { renderConsejos } from "../components/dashboard/consejos.js";
import { renderPerfil } from "../components/dashboard/perfil.js";

export function navigate(route) {
    const app = document.getElementById('app');

    app.classList.remove('page-enter', 'page-enter-active');
    app.classList.add('page-exit-active');

    setTimeout(() => {

        app.classList.remove('page-exit-active');

        switch(route) {

            case 'home':
                renderHome(app);
                break;

            case 'login':
                renderLogin(app);
                break;

            case 'register':
                renderRegister(app);
                break;

            case 'dashboard':
                renderDashboard(app);
                break;

            case 'registro':
                renderRegistro(app);
                break;

            case 'analisis':
                renderAnalisis(app);
                break;

            case 'historial':
                renderHistorial(app);
                break;

            case 'consejos':
                renderConsejos(app);
                break;

            case 'perfil':
                renderPerfil(app);
                break;

        }

        app.classList.add('page-enter');

        setTimeout(() => {
            app.classList.add('page-enter-active');
        }, 10);

        setTimeout(() => {
            app.classList.remove('page-enter', 'page-enter-active');
        }, 400);

    }, 300);
}

window.navigate = navigate;
navigate('home');