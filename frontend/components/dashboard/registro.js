export function renderRegistro(app) {

    app.innerHTML = `
<link rel="stylesheet" href="components/dashboard/registro.css">

<div class="registro-page">

    <div class="header">
        <h1>📝 Registrar Estado de Ánimo</h1>
        <p>¿Cómo te sientes hoy? Registra tu estado emocional</p>
    </div>

    <div class="stats">

        <div class="stat">
            <p>Registros totales</p>
            <h2 id="total">0</h2>
        </div>

        <div class="stat">
            <p>Intensidad promedio</p>
            <h2 id="promedio">0/10</h2>
        </div>

        <div class="stat">
            <p>Estado más común</p>
            <h2 id="frecuente">N/A</h2>
        </div>

        <div class="stat">
            <p>Últimos 7 días</p>
            <h2 id="semana">0</h2>
        </div>

    </div>

    <div class="card">

        <h3>¿Cómo te sientes hoy?</h3>

        <div class="emociones">

            <div class="emocion feliz" data-value="feliz">
                😊
                <span>Feliz</span>
            </div>

            <div class="emocion tranquilo" data-value="tranquilo">
                💙
                <span>Tranquilo</span>
            </div>

            <div class="emocion neutral" data-value="neutral">
                😐
                <span>Neutral</span>
            </div>

            <div class="emocion triste" data-value="triste">
                😢
                <span>Triste</span>
            </div>

            <div class="emocion ansioso" data-value="ansioso">
                😖
                <span>Ansioso</span>
            </div>

        </div>

        <div class="intensidad hidden">

            <p>
                Intensidad:
                <span id="valor">5</span>/10
            </p>

            <input
                type="range"
                min="1"
                max="10"
                value="5"
                id="range"
            >

        </div>

        <div class="notas hidden">

            <p>Notas (opcional)</p>

            <textarea
                id="nota"
                placeholder="¿Qué está pasando en tu vida?"
            ></textarea>

        </div>

        <button class="btn hidden" id="guardar">
            Registrar estado de ánimo
        </button>

    </div>

    <div class="grafico hidden">

        <h3>Tendencia de tu estado de ánimo</h3>

        <canvas id="chart"></canvas>

    </div>

</div>
`;

    initRegistro();
    cargarEstadisticas();
    mostrarGrafico();
}

function initRegistro() {

    const emociones =
        document.querySelectorAll(".emocion");

    const intensidad =
        document.querySelector(".intensidad");

    const notas =
        document.querySelector(".notas");

    const boton =
        document.getElementById("guardar");

    emociones.forEach(emocion => {

        emocion.addEventListener("click", () => {

            emociones.forEach(el =>
                el.classList.remove("active")
            );

            emocion.classList.add("active");

            intensidad.classList.remove("hidden");
            notas.classList.remove("hidden");
            boton.classList.remove("hidden");
        });
    });

    const range =
        document.getElementById("range");

    const valor =
        document.getElementById("valor");

    range.addEventListener("input", () => {

        valor.textContent = range.value;
    });

    boton.addEventListener(
        "click",
        guardarRegistro
    );
}

async function guardarRegistro() {

    const emocion =
        document.querySelector(".emocion.active")
            ?.dataset.value;

    const intensidad =
        document.getElementById("range").value;

    const nota =
        document.getElementById("nota")
            .value
            .trim();

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (!emocion) {

        mostrarToast(
            "⚠️ Selecciona una emoción"
        );

        return;
    }

    if (!user) {

        mostrarToast(
            "⚠️ Debes iniciar sesión"
        );

        return;
    }

    const emocionesMap = {
        feliz: 1,
        tranquilo: 2,
        neutral: 3,
        triste: 4,
        ansioso: 5
    };

    const mensajes = {
        feliz:
            "✨ Qué bonito verte feliz",
        tranquilo:
            "🌸 Sigue cuidando tu paz",
        neutral:
            "💫 Gracias por compartir cómo te sientes",
        triste:
            "🫶 Está bien tener días difíciles",
        ansioso:
            "🌿 Respira, poco a poco"
    };

    const id_emocion =
        emocionesMap[emocion];

    try {

        const res = await fetch(
            "https://moodlens-oj88.onrender.com/api/emociones",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    id_usuario:
                        user.id_usuario || user.id,

                    id_emocion,

                    intensidad,

                    nota
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {

            mostrarToast(
                data.message || "Error al guardar"
            );

            return;
        }

        mostrarToast(
            mensajes[emocion]
        );

        document.getElementById("nota").value = "";

        document.getElementById("range").value = 5;

        document.getElementById("valor").textContent = 5;

        document
            .querySelectorAll(".emocion")
            .forEach(el =>
                el.classList.remove("active")
            );

        document
            .querySelector(".intensidad")
            .classList.add("hidden");

        document
            .querySelector(".notas")
            .classList.add("hidden");

        document
            .getElementById("guardar")
            .classList.add("hidden");

        await cargarEstadisticas();
        await mostrarGrafico();

    } catch (error) {

        console.error(error);

        mostrarToast(
            "❌ Error de conexión"
        );
    }
}

async function cargarEstadisticas() {

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    const userId =
        user.id_usuario || user.id;

    try {

        const res = await fetch(
            `https://moodlens-oj88.onrender.com/api/stats/${userId}`
        );

        const data = await res.json();

        document.getElementById("total")
            .textContent =
            data.total_registros || 0;

        document.getElementById("promedio")
            .textContent =
            `${data.promedio_intensidad || 0}/10`;

        document.getElementById("frecuente")
            .textContent =
            capitalizar(
                data.emocion_frecuente || "N/A"
            );

        document.getElementById("semana")
            .textContent =
            data.ultimos_7_dias || 0;

    } catch (error) {

        console.error(error);
    }
}

async function mostrarGrafico() {

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    const userId =
        user.id_usuario || user.id;

    try {

        const res = await fetch(
            `https://moodlens-oj88.onrender.com/api/emociones/${userId}`
        );

        const data = await res.json();

        if (!data || data.length === 0) {
            return;
        }

        pintarGrafico(data);

    } catch (error) {

        console.error(error);
    }
}

let moodChart;

function pintarGrafico(data) {

    const labels =
        data.map(item =>
            new Date(item.fecha)
                .toLocaleDateString("es-ES")
        );

    const valores =
        data.map(item => item.intensidad);

    document
        .querySelector(".grafico")
        .classList.remove("hidden");

    const ctx =
        document.getElementById("chart");

    if (moodChart) {

        moodChart.destroy();
    }

    moodChart = new Chart(ctx, {

        type: "line",

        data: {

            labels,

            datasets: [
                {
                    label:
                        "Estado emocional",

                    data: valores,

                    tension: 0.4,

                    fill: true
                }
            ]
        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    display: false
                }
            },

            scales: {

                y: {
                    min: 0,
                    max: 10
                }
            }
        }
    });
}

function capitalizar(texto) {

    if (!texto || texto === "N/A")
        return texto;

    return texto.charAt(0)
            .toUpperCase() +
        texto.slice(1);
}

function mostrarToast(mensaje) {

    const toast =
        document.createElement("div");

    toast.className = "toast-mood";

    toast.textContent = mensaje;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 400);

    }, 2600);
}