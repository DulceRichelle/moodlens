import { getUser } from "../../services/user.service.js";

export async function renderPerfil(app) {
    
const user = getUser();

let stats = {
    total: 0,
    constancia: 0
};

try {

    const res = await fetch(
        `https://moodlens-oj88.onrender.com/api/emociones/${user.id_usuario || user.id}`
        );

    const registros = await res.json();

    stats.total = registros.length;

    const fechasUnicas = [
        ...new Set(
            registros.map(r =>
                new Date(r.fecha).toDateString()
            )
        )
    ];

    stats.constancia = fechasUnicas.length;

} catch (error) {
    console.log(error);
}

const fechaRegistro =
    user.fecha_registro || user.created_at || new Date();

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

                <h3 id="nombreVisual">
                    ${user?.nombre || "Usuario"}
                </h3>

                <p>
                    ${user?.email || "correo@email.com"}
                </p>

                <span>
                    Miembro desde
                    ${formatearFecha(fechaRegistro)}
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
                disabled
            >

        </div>

        <button
            class="btn-guardar"
            id="guardarPerfilBtn"
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
                <h3>${stats.total}</h3>
                <p>Registros emocionales</p>
            </div>

            <div class="progreso-box">
                <h3>${stats.constancia}</h3>
                <p>Días con actividad</p>
            </div>

        </div>

    </div>

</div>
`;

initDarkMode();
initPerfilEvents(user);

}

function initPerfilEvents(user) {

document
    .getElementById("guardarPerfilBtn")
    .addEventListener("click", async () => {

        const nuevoNombre =
            document.getElementById("nombrePerfil")
                .value
                .trim();

        if (!nuevoNombre) return;

        try {

            await fetch(
                `https://moodlens-oj88.onrender.com/api/usuarios/${user.id_usuario || user.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nombre: nuevoNombre
                    })
                }
            );

            user.nombre = nuevoNombre;

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            document.getElementById(
                "nombreVisual"
            ).textContent = nuevoNombre;

            mostrarToast(
                "Perfil actualizado ✨"
            );

        } catch (error) {

            console.log(error);

            mostrarToast(
                "Error al guardar cambios :("
            );
        }
    });

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


return new Date(fecha).toLocaleDateString(
    "es-ES",
    {
        day: "numeric",
        month: "long",
        year: "numeric"
    }
);

}
