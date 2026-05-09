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

    const diasActivos =
        calcularDiasActivos(registros);

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
                        Tu espacio personal en MoodLens 🌸
                    </p>

                    <span>
                        Miembro desde
                        ${formatearFecha(fechaRegistro)}
                    </span>

                </div>

            </div>

        </div>

        <div class="stats-grid">

            <div class="stat-card">

                <div class="stat-icon">
                    📝
                </div>

                <h2>${totalRegistros}</h2>

                <p>Registros emocionales</p>

            </div>

            <div class="stat-card">

                <div class="stat-icon">
                    🔥
                </div>

                <h2>${diasActivos}</h2>

                <p>Días activos</p>

            </div>

            <div class="stat-card">

                <div class="stat-icon">
                    ${emocionFrecuente.icono}
                </div>

                <h2>
                    ${emocionFrecuente.nombre}
                </h2>

                <p>Emoción más frecuente</p>

            </div>

        </div>

        <div class="perfil-grid">

            <div class="perfil-card">

                <h2>👤 Cuenta</h2>

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

                <h2>⚙ Preferencias</h2>

                <div class="setting-item">

                    <div>
                        <h3>🔔 Notificaciones</h3>
                        <p>
                            Recordatorios emocionales
                        </p>
                    </div>

                    <span class="setting-badge">
                        Próximamente
                    </span>

                </div>

                <div class="setting-item">

                    <div>
                        <h3>📥 Exportar datos</h3>
                        <p>
                            Descarga tu historial
                        </p>
                    </div>

                    <span class="setting-badge">
                        Beta
                    </span>

                </div>

                <div class="setting-item">

                    <div>
                        <h3>🔒 Privacidad</h3>
                        <p>
                            Tus emociones son privadas
                        </p>
                    </div>

                    <span class="setting-badge active">
                        Activo
                    </span>

                </div>

            </div>

            <div class="perfil-card">

                <h2>💌 Soporte</h2>

                <div class="support-box">

                    <p>
                        ¿Necesitas ayuda o quieres
                        compartir ideas para MoodLens?
                    </p>

                    <button
                        class="btn-secondary"
                        id="supportBtn"
                    >
                        Contactar soporte
                    </button>

                </div>

            </div>

            <div class="perfil-card logout-card">

                <h2>🚪 Sesión</h2>

                <p>
                    Cierra sesión en tu cuenta
                    de MoodLens.
                </p>

                <button
                    class="logout-btn"
                    id="logoutBtn"
                >
                    Cerrar sesión
                </button>

            </div>

        </div>

    </div>
    `;

    initPerfil(user);
}

function initPerfil(user) {

    const guardarBtn =
        document.getElementById(
            "guardarPerfilBtn"
        );

    if (guardarBtn) {

        guardarBtn.addEventListener(
            "click",
            async () => {

                const nuevoNombre =
                    document
                        .getElementById(
                            "nombrePerfil"
                        )
                        .value
                        .trim();

                if (!nuevoNombre) {
                    mostrarToast(
                        "El nombre no puede estar vacío"
                    );
                    return;
                }

                try {

                    await fetch(
                        `https://moodlens-oj88.onrender.com/api/usuarios/${user.id_usuario || user.id}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body: JSON.stringify({
                                nombre: nuevoNombre
                            })
                        }
                    );

                    user.nombre =
                        nuevoNombre;

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
            }
        );
    }

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "user"
                );

                navigate("login");
            }
        );
    }

    const supportBtn =
        document.getElementById("supportBtn");

    if (supportBtn) {

        supportBtn.addEventListener(
            "click",
            () => {

                mostrarToast(
                    "Soporte disponible próximamente 💌"
                );
            }
        );
    }
}

function calcularDiasActivos(registros) {

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

function obtenerEmocionFrecuente(registros) {

    if (!registros.length) {

        return {
            nombre: "Sin datos",
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