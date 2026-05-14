import { t } from "../../services/i18n.js";

export async function renderConsejos(app) {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    let registros = [];

    try {

        const res = await fetch(
            `https://moodlens-oj88.onrender.com/api/emociones/${user.id_usuario || user.id}`
        );

        registros = await res.json();

    } catch (error) {

        console.log(error);
    }

    const emocionPrincipal =
        obtenerEmocionPrincipal(registros);

    const consejoPrincipal =
        generarConsejoPrincipal(
            emocionPrincipal.nombre
        );

    const insights =
        generarInsights(registros);

    app.innerHTML = `

<link rel="stylesheet" href="components/dashboard/consejos.css">

<div class="consejos-page">

    <section class="hero-consejos">

        <div class="hero-content">

            <span class="hero-badge">

                ✨ MoodLens Insights

            </span>

            <h1>

                ${t("tipsForYou")} 🌸

            </h1>

            <p>

                ${t("tipsSubtitle")}

            </p>

        </div>

    </section>

    <section class="consejo-destacado">

        <div class="destacado-glow"></div>

        <div class="destacado-icono">

            ${consejoPrincipal.icono}

        </div>

        <div class="destacado-info">

            <span class="tag">

                ${t("personalizedTip")}

            </span>

            <h2>

                ${consejoPrincipal.titulo}

            </h2>

            <p>

                ${consejoPrincipal.descripcion}

            </p>

            <div class="emotion-pill">

                ${emocionPrincipal.icono}
                ${capitalizar(
        traducirEmocion(
            emocionPrincipal.nombre
        )
    )}

            </div>

        </div>

    </section>

    <section class="insights-section">

        <div class="section-title">

            <h2>
                📈 ${t("analysis")}
            </h2>

            <p>
                ${t("emotionalPatternsDesc")}
            </p>

        </div>

        <div class="insights-grid">

            ${insights.map(item => `

                <div class="insight-card">

                    <div class="insight-top">

                        <div class="insight-icono">

                            ${item.icono}

                        </div>

                    </div>

                    <h3>

                        ${item.titulo}

                    </h3>

                    <p>

                        ${item.texto}

                    </p>

                </div>

            `).join("")}

        </div>

    </section>

    <section class="tips-section">

        <div class="section-title">

            <h2>
                🌿 ${t("wellnessTips")}
            </h2>

            <p>
                ${t("personalizedWellness")}
            </p>

        </div>

        <div class="tips-grid">

            ${crearTips(
        emocionPrincipal.nombre
    )}

        </div>

    </section>

</div>
`;
}

function obtenerEmocionPrincipal(registros) {

    if (!registros.length) {

        return {
            nombre: "neutral",
            icono: "🌸"
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
        nombre: top.toLowerCase(),
        icono: encontrado?.icono || "🌸"
    };
}

function generarConsejoPrincipal(emocion) {

    const consejos = {

        ansioso: {

            icono: "🌿",

            titulo:
                t("anxiousTitle"),

            descripcion:
                t("anxiousDesc")
        },

        triste: {

            icono: "☀️",

            titulo:
                t("sadTitle"),

            descripcion:
                t("sadDesc")
        },

        feliz: {

            icono: "✨",

            titulo:
                t("happyTitle"),

            descripcion:
                t("happyDesc")
        },

        tranquilo: {

            icono: "🧘",

            titulo:
                t("calmTitle"),

            descripcion:
                t("calmDesc")
        },

        neutral: {

            icono: "🌸",

            titulo:
                t("neutralTitle"),

            descripcion:
                t("neutralDesc")
        }
    };

    return consejos[emocion]
        || consejos.neutral;
}

function generarInsights(registros) {

    const total = registros.length;

    const promedio =
        calcularPromedio(registros);

    return [

        {
            icono: "📝",

            titulo: t("emotionalActivity"),

            texto:
                `${t("youRegistered")} ${total} ${t("emotionsInMoodlens")}`
        },

        {
            icono: "📈",

            titulo: t("averageIntensity"),

            texto:
                `${t("yourAverageIntensity")} ${promedio}/10.`
        },

        {
            icono: "💖",

            titulo: t("selfCare"),

            texto:
                t("selfCareDesc")
        }
    ];
}

function calcularPromedio(registros) {

    if (!registros.length) return 0;

    const suma =
        registros.reduce(
            (acc, r) =>
                acc + Number(r.intensidad),
            0
        );

    return (
        suma / registros.length
    ).toFixed(1);
}

function crearTips(emocion) {

    const tips = {

        ansioso: [
            {
                icono: "🌬️",
                titulo: t("breathing"),
                texto: t("breathingDesc")
            },

            {
                icono: "📵",
                titulo: t("disconnect"),
                texto: t("disconnectDesc")
            },

            {
                icono: "🌙",
                titulo: t("rest"),
                texto: t("restDesc")
            }
        ],

        triste: [
            {
                icono: "☀️",
                titulo: t("sunlight"),
                texto: t("sunlightDesc")
            },

            {
                icono: "🎵",
                titulo: t("music"),
                texto: t("musicDesc")
            },

            {
                icono: "💌",
                titulo: t("connection"),
                texto: t("connectionDesc")
            }
        ],

        feliz: [
            {
                icono: "✨",
                titulo: t("gratitude"),
                texto: t("gratitudeDesc")
            },

            {
                icono: "📸",
                titulo: t("moments"),
                texto: t("momentsDesc")
            },

            {
                icono: "🌱",
                titulo: t("habits"),
                texto: t("habitsDesc")
            }
        ],

        tranquilo: [
            {
                icono: "🧘",
                titulo: t("meditation"),
                texto: t("meditationDesc")
            },

            {
                icono: "📚",
                titulo: t("slowTime"),
                texto: t("slowTimeDesc")
            },

            {
                icono: "🍵",
                titulo: t("breaks"),
                texto: t("breaksDesc")
            }
        ],

        neutral: [
            {
                icono: "🌸",
                titulo: t("listenToYourself"),
                texto: t("listenToYourselfDesc")
            },

            {
                icono: "📝",
                titulo: t("reflection"),
                texto: t("reflectionDesc")
            },

            {
                icono: "💧",
                titulo: t("wellbeing"),
                texto: t("wellbeingDesc")
            }
        ]
    };

    return (
        tips[emocion] || tips.neutral
    ).map(item => `

<div class="tip-card">

    <div class="tip-icono">

        ${item.icono}

    </div>

    <h3>

        ${item.titulo}

    </h3>

    <p>

        ${item.texto}

    </p>

</div>

`).join("");
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

function capitalizar(texto) {

    return texto.charAt(0)
            .toUpperCase() +
        texto.slice(1);
}