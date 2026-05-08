import { getUser } from "../../services/user.service.js";

export function renderPerfil(app) {

const user = getUser();

const fechaRegistro =
    formatearFechaRegistro(user?.fecha_creacion);

app.innerHTML = `
    <link rel="stylesheet" href="components/dashboard/perfil.css">

        <div class="perfil-page">

        <div class="header-perfil">
        <h1>⚙ Ajustes de Perfil</h1>
    <p>Gestiona tu cuenta y preferencias</p>
</div>

    <div class="perfil-card">

        <h2>👤 Información Personal</h2>

        <div class="perfil-top">

            <div class="avatar-grande">
                ${user?.nombre?.charAt(0).toUpperCase() || "U"}
            </div>

            <div class="perfil-datos">

                <h3>
                    ${user?.nombre || "Usuario"}
                </h3>

                <p>
                    ${user?.email || "correo@email.com"}
                </p>

                <span>
                    Miembro desde ${fechaRegistro}
                </span>

            </div>

        </div>

        <div class="form-group">

            <label>Nombre</label>

            <input
                type="text"
                id="nombrePerfil"
                value="${user?.nombre || ""}"
            >

        </div>

        <div class="form-group">

            <label>Email</label>

            <input
                type="email"
                id="emailPerfil"
                value="${user?.email || ""}"
            >

        </div>

        <button
            class="btn-guardar"
            onclick="guardarPerfil()"
        >
            💾 Guardar Cambios
        </button>

    </div>

    <div class="perfil-card">

        <h2>🛡 Ajustes</h2>

        <div class="ajuste-item">

            <div>
                <h3>🔔 Notificaciones</h3>
                <p>Recordatorios diarios</p>
            </div>

            <label class="switch">

                <input
                    type="checkbox"
                    id="notificaciones"
                    checked
                >

                    <span class="slider"></span>

            </label>

        </div>

        <div class="ajuste-item">

            <div>
                <h3>🌙 Modo Oscuro</h3>
                <p>Tema visual</p>
            </div>

            <label class="switch">

                <input
                    type="checkbox"
                    id="darkMode"
                >

                    <span class="slider"></span>

            </label>

        </div>

    </div>

    <div class="progreso-card">

        <h2>Tu Progreso</h2>

        <div class="progreso-grid">

            <div class="progreso-box">
                <h3>23</h3>
                <p>Días activo</p>
            </div>

            <div class="progreso-box">
                <h3>85%</h3>
                <p>Constancia</p>
            </div>

        </div>

    </div>

</div>
`;

initDarkMode();

window.guardarPerfil = guardarPerfil;

}

function initDarkMode() {

const darkToggle =
    document.getElementById("darkMode");

const darkSaved =
    localStorage.getItem("darkMode");

if (darkSaved === "true") {

    document.body.classList.add("dark-mode");

    darkToggle.checked = true;
}

darkToggle.addEventListener("change", () => {

    if (darkToggle.checked) {

        document.body.classList.add("dark-mode");

        localStorage.setItem(
            "darkMode",
            "true"
        );

    } else {

        document.body.classList.remove("dark-mode");

        localStorage.setItem(
            "darkMode",
            "false"
        );
    }
});


}

function guardarPerfil() {

const nombre =
    document.getElementById("nombrePerfil").value;

const email =
    document.getElementById("emailPerfil").value;

const user = getUser();

const actualizado = {
    ...user,
    nombre,
    email
};

localStorage.setItem(
    "user",
    JSON.stringify(actualizado)
);

alert("¡Cambios guardados correctamente! ✨");

}

function formatearFechaRegistro(fecha) {


if (!fecha) {
    return "hace poco";
}

const f = new Date(fecha);

return f.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
});

}