import { getUser } from "../../services/user.service.js";

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

    const totalRegistros = registros.length;

    const emocionFrecuente =
        obtenerEmocionFrecuente(registros);

    const streak =
        calcularStreak(registros);

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
                        Hola, ${user?.nombre || "Usuario"} ✨
                    </h1>

                    <p>
                        Sigue cuidando de tu bienestar emocional 🌸
                    </p>

                    <span>
                        Miembro desde
                        ${formatearFecha(fechaRegistro)}
                    </span>

                </div>

            </div>

            <button class="logout-btn" id="logoutBtn">
                Cerrar sesión
            </button>

        </div>

        <div class="stats-grid">

            <div class="stat-card">
                <h2>${totalRegistros}</h2>
                <p>Registros emocionales</p>
            </div>

            <div class="stat-card">
                <h2>${streak}</h2>
                <p>Días activos</p>
            </div>

            <div class="stat-card">
                <h2>${emocionFrecuente.icono}</h2>
                <p>${emocionFrecuente.nombre}</p>
            </div>

        </div>

        <div class="perfil-grid">

            <div class="perfil-card">

                <h2>👤 Información Personal</h2>

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
                        value="${user?.email || ""}"
                        disabled
                    >

                </div>

                <button
                    class="btn-guardar"
                    id="guardarPerfilBtn"
                >
                    Guardar cambios
                </button>

            </div>

            <div class="perfil-card">

                <h2>🎨 Apariencia</h2>

                <div class="ajuste-item">

                    <div>
                        <h3>🌙 Modo Oscuro</h3>
                        <p>Cambiar apariencia visual</p>
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

            <div class="perfil-card">

                <h2>📈 Actividad emocional</h2>

                <div class="actividad-box">

                    ${crearActividad(registros)}

                </div>

            </div>

        </div>

    </div>
    `;

    initDarkMode();
    initPerfil(user);
}

function initPerfil(user) {

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

                mostrarToast(
                    "Perfil actualizado ✨"
                );

                renderPerfil(
                    document.getElementById("app")
                );

            } catch (error) {

                console.log(error);

                mostrarToast(
                    "Error al guardar"
                );
            }
        });

    document
        .getElementById("logoutBtn")
        .addEventListener("click", () => {

            localStorage.removeItem("user");

            navigate("login");
        });
}

function initDarkMode() {

    const darkToggle =
        document.getElementById("darkMode");

    if (
        localStorage.getItem("darkMode")
        === "true"
    ) {

        document.body.classList.add(
            "dark-mode"
        );

        darkToggle.checked = true;
    }

    darkToggle.addEventListener("change", () => {

        if (darkToggle.checked) {

            document.body.classList.add(
                "dark-mode"
            );

            localStorage.setItem(
                "darkMode",
                "true"
            );

        } else {

            document.body.classList.remove(
                "dark-mode"
            );

            localStorage.setItem(
                "darkMode",
                "false"
            );
        }
    });
}

function calcularStreak(registros) {

    const dias = [
        ...new Set(
            registros.map(r =>
                new Date(r.fecha).toDateString()
            )
        )
    ];

    return dias.length;
}

function obtenerEmocionFrecuente(registros) {

    if (!registros.length) {
        return {
            nombre: "Sin registros",
            icono: "🫶"
        };
    }

    const contador = {};

    registros.forEach(r => {

        contador[r.nombre_emocion] =
            (contador[r.nombre_emocion] || 0) + 1;
    });

    const top =
        Object.keys(contador)
            .reduce((a, b) =>
                contador[a] > contador[b]
                    ? a
                    : b
            );

    const encontrado =
        registros.find(r =>
            r.nombre_emocion === top
        );

    return {
        nombre: top,
        icono: encontrado?.icono || "✨"
    };
}

function crearActividad(registros) {

    if (!registros.length) {
        return `
            <p class="actividad-vacia">
                Todavía no hay actividad emocional 🌱
            </p>
        `;
    }

    return registros
        .slice(0, 6)
        .map(r => `
            <div class="actividad-item">

                <span class="actividad-icono">
                    ${r.icono}
                </span>

                <div>
                    <h4>${r.nombre_emocion}</h4>

                    <p>
                        Intensidad:
                        ${r.intensidad}/10
                    </p>
                </div>

            </div>
        `)
        .join("");
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
            "es-ES",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
}