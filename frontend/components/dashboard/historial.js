import { t, getLanguage } from "../../services/i18n.js";

let historialData = [];
let registroEditando = null;
let ultimoEliminado = null;
let undoTimeout = null;
let registroAEliminar = null;

export async function renderHistorial(app) {

    app.innerHTML = `
<link rel="stylesheet" href="components/dashboard/historial.css">

<div class="historial-page">

    <div class="header-historial">

        <h1>
            🕘 ${t("emotionalHistory")}
        </h1>

        <p>
            ${t("reviewRecords")}
        </p>

    </div>

    <div class="historial-main-container">

        <h2>
            ${t("moodHistory")}
        </h2>

        <div class="filtros">

            <button
                class="filtro active"
                data-filtro="todos"
            >
                ${t("all")}
            </button>

            <button
                class="filtro"
                data-filtro="feliz"
            >
                😊 ${t("happy")}
            </button>

            <button
                class="filtro"
                data-filtro="tranquilo"
            >
                💙 ${t("calm")}
            </button>

            <button
                class="filtro"
                data-filtro="neutral"
            >
                😐 ${t("neutral")}
            </button>

            <button
                class="filtro"
                data-filtro="triste"
            >
                😢 ${t("sad")}
            </button>

            <button
                class="filtro"
                data-filtro="ansioso"
            >
                😖 ${t("anxious")}
            </button>

        </div>

        <div id="historialLista">

            <p>
                ${t("loadingHistory")}
            </p>

        </div>

    </div>

</div>

<div id="modalEditar" class="modal hidden">

    <div class="modal-content">

        <h2>
            ${t("editRecord")}
        </h2>

        <label>
            ${t("intensity")}
        </label>

        <input
            type="range"
            min="1"
            max="10"
            id="editIntensidad"
        >

        <label>
            ${t("note")}
        </label>

        <textarea id="editNota"></textarea>

        <div class="modal-buttons">

            <button id="guardarEdit">
                ${t("save")}
            </button>

            <button id="cancelarEdit">
                ${t("cancel")}
            </button>

        </div>

    </div>

</div>

<div id="modalEliminar" class="modal hidden">

    <div class="modal-content">

        <h3>
            ${t("deleteRecord")}
        </h3>

        <p>
            ${t("deleteWarning")}
        </p>

        <div class="modal-buttons">

            <button id="cancelarEliminar">
                ${t("cancel")}
            </button>

            <button
                id="confirmarEliminar"
                class="danger"
            >
                ${t("delete")}
            </button>

        </div>

    </div>

</div>

<div id="toastUndo" class="toast hidden">

    ${t("recordDeleted")}

    <button id="undoBtn">
        ${t("undo")}
    </button>

</div>
`;

    await cargarHistorial();

    initFiltros();
    initEventosGlobales();
}

async function cargarHistorial() {

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (!user) return mostrarVacio();

    const userId =
        user.id || user.id_usuario;

    try {

        const res = await fetch(
            `https://moodlens-oj88.onrender.com/api/emociones/${userId}`
        );

        const data = await res.json();

        historialData = data || [];

        historialData.length
            ? pintarHistorial(historialData)
            : mostrarVacio();

    } catch {

        mostrarVacio();
    }
}

function initFiltros() {

    document
        .querySelectorAll('.filtro')
        .forEach(btn => {

            btn.addEventListener('click', () => {

                document
                    .querySelectorAll('.filtro')
                    .forEach(b =>
                        b.classList.remove('active')
                    );

                btn.classList.add('active');

                const filtro =
                    btn.dataset.filtro;

                const filtrados =
                    filtro === "todos"
                        ? historialData
                        : historialData.filter(
                            i =>
                                i.nombre_emocion
                                    .toLowerCase() === filtro
                        );

                pintarHistorial(filtrados);
            });
        });
}

function pintarHistorial(data) {

    const lista =
        document.getElementById("historialLista");

    const ordenados = data
        .filter(item => item && item.fecha)
        .sort(
            (a, b) =>
                new Date(b.fecha) -
                new Date(a.fecha)
        );

    const hoy = new Date();

    const grupos = {
        hoy: [],
        ayer: [],
        semana: [],
        anteriores: []
    };

    ordenados.forEach(item => {

        const fecha = new Date(item.fecha);

        if (esMismoDia(fecha, hoy)) {

            grupos.hoy.push(item);

        } else if (esAyer(fecha, hoy)) {

            grupos.ayer.push(item);

        } else {

            const diff =
                (hoy - fecha) / 86400000;

            if (diff <= 7) {

                grupos.semana.push(item);

            } else {

                grupos.anteriores.push(item);
            }
        }
    });

    lista.innerHTML = `
    <div class="historial-lista">

        ${crearGrupo(t("today"), grupos.hoy)}

        ${crearGrupo(t("yesterday"), grupos.ayer)}

        ${crearGrupo(t("thisWeek"), grupos.semana)}

        ${crearGrupo(t("older"), grupos.anteriores)}

    </div>
`;
}

function crearGrupo(titulo, items) {

    if (!items.length) return "";

    return `
<div class="grupo">

    <h2 class="grupo-titulo">
        ${titulo}
    </h2>

    ${items.map(item => `

    <div class="historial-card">

        <div class="card-left">

            <div class="emocion-header">

                <div class="emocion-icono ${item.nombre_emocion.toLowerCase()}">
                    ${item.icono}
                </div>

                <div class="emocion-info">

                    <h3>
                         ${traducirEmocion(item.nombre_emocion)}
                    </h3> 

                    <p>
                        ${t("intensity")}:
                        ${item.intensidad}/10
                    </p>

                    <p>
                        ${item.nota || t("noNote")}
                    </p>

                </div>

            </div>

        </div>

        <div class="card-right">

            <div>
                ${formatearFecha(item.fecha)}
            </div>

            <div class="acciones">

                <button onclick="editarRegistro(${item.id_registro})">
                    ✏️
                </button>

                <button onclick="eliminarRegistro(${item.id_registro})">
                    🗑️
                </button>

            </div>

        </div>

    </div>

    `).join("")}

</div>
`;
}

window.editarRegistro = function(id) {

    const reg =
        historialData.find(
            r => r.id_registro === id
        );

    if (!reg) return;

    registroEditando = reg;

    document
        .getElementById("modalEditar")
        .classList.remove("hidden");

    document
        .getElementById("editIntensidad")
        .value = reg.intensidad;

    document
        .getElementById("editNota")
        .value = reg.nota || "";
};

window.eliminarRegistro = function(id) {

    registroAEliminar = id;

    document
        .getElementById("modalEliminar")
        .classList.remove("hidden");
};

function initEventosGlobales() {

    document.addEventListener(
        "click",
        async (e) => {

            if (e.target.closest("#guardarEdit")) {

                const intensidad =
                    document.getElementById(
                        "editIntensidad"
                    ).value;

                const nota =
                    document.getElementById(
                        "editNota"
                    ).value;

                await fetch(
                    `https://moodlens-oj88.onrender.com/api/emociones/${registroEditando.id_registro}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            intensidad,
                            nota
                        })
                    }
                );

                Object.assign(
                    registroEditando,
                    { intensidad, nota }
                );

                pintarHistorial(historialData);

                cerrarModal();
            }

            if (e.target.closest("#cancelarEdit")) {
                cerrarModal();
            }

            if (e.target.closest("#cancelarEliminar")) {
                cerrarModal();
            }

            if (e.target.closest("#confirmarEliminar")) {

                const idEliminar =
                    registroAEliminar;

                const eliminado =
                    historialData.find(
                        r =>
                            r.id_registro ===
                            idEliminar
                    );

                cerrarModal();

                try {

                    await fetch(
                        `https://moodlens-oj88.onrender.com/api/emociones/${idEliminar}`,
                        {
                            method: "DELETE"
                        }
                    );

                    historialData =
                        historialData.filter(
                            r =>
                                r.id_registro !==
                                idEliminar
                        );

                    pintarHistorial(historialData);

                    mostrarUndo(eliminado);

                } catch (error) {

                    console.log(error);
                }
            }

            if (e.target.closest("#undoBtn")) {

                if (!ultimoEliminado) return;

                clearTimeout(undoTimeout);

                historialData.unshift(
                    ultimoEliminado
                );

                pintarHistorial(historialData);

                ocultarToast();
            }
        }
    );
}

function cerrarModal() {

    document
        .getElementById("modalEditar")
        .classList.add("hidden");

    document
        .getElementById("modalEliminar")
        .classList.add("hidden");

    registroEditando = null;
}

function mostrarUndo(registro) {

    if (!registro) return;

    ultimoEliminado = registro;

    const toast =
        document.getElementById("toastUndo");

    toast.classList.remove("hidden");

    undoTimeout = setTimeout(() => {

        ocultarToast();

    }, 4000);
}

function ocultarToast() {

    document
        .getElementById("toastUndo")
        .classList.add("hidden");

    ultimoEliminado = null;
}

function esMismoDia(a, b) {

    return a.toDateString() === b.toDateString();
}

function esAyer(fecha, hoy) {

    const ayer = new Date(hoy);

    ayer.setDate(hoy.getDate() - 1);

    return esMismoDia(fecha, ayer);
}

function mostrarVacio() {

    document.getElementById(
        "historialLista"
    ).innerHTML = `
    <div class="historial-vacio">

        ${t("noRecordsYet")}

    </div>
`;
}

function formatearFecha(f) {

    const fecha = new Date(f);

    return fecha.toLocaleString(
        getLanguage(),
        {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        }
    );
}

function traducirEmocion(emocion) {

    const emociones = {

        feliz: t("happy"),

        tranquilo: t("calm"),

        neutral: t("neutral"),

        triste: t("sad"),

        ansioso: t("anxious")
    };

    return emociones[
        emocion?.toLowerCase()
        ] || emocion;
}