import { renderDashboard } from "../components/dashboard/dashboard.js";
import { renderRegister } from "../components/register/register.js";
import { renderLogin } from "../components/login/login.js";
import { renderHome } from "../components/home/home.js";

const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

let isNavigating = false;

export function navigate(route) {


    if (isNavigating) return;
    isNavigating = true;

    localStorage.setItem("currentRoute", route);

    const app = document.getElementById('app');

    app.classList.remove('page-enter', 'page-enter-active');
    app.classList.add('page-exit-active');

    setTimeout(() => {

        app.classList.remove('page-exit-active');

        switch (route) {

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

            default:
                renderHome(app);
                break;
        }

        app.classList.add('page-enter');

        setTimeout(() => {
            app.classList.add('page-enter-active');
        }, 10);

        setTimeout(() => {
            app.classList.remove('page-enter', 'page-enter-active');
            isNavigating = false; // Libera el guard al terminar la animación
        }, 400);

    }, 300);
}

window.navigate = navigate;

const savedRoute = localStorage.getItem("currentRoute") || "home";
navigate(savedRoute);