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

        <div class="hero-consejos">

            <div>

                <h1>
                    Consejos para ti 🌸
                </h1>

                <p>
                    Basados en tu actividad emocional reciente
                </p>

            </div>

        </div>

        <div class="consejo-destacado">

            <div class="destacado-icono">
                ${consejoPrincipal.icono}
            </div>

            <div>

                <span class="tag">
                    Consejo personalizado
                </span>

                <h2>
                    ${consejoPrincipal.titulo}
                </h2>

                <p>
                    ${consejoPrincipal.descripcion}
                </p>

            </div>

        </div>

        <div class="insights-grid">

            ${insights.map(item => `
                <div class="insight-card">

                    <div class="insight-icono">
                        ${item.icono}
                    </div>

                    <h3>${item.titulo}</h3>

                    <p>${item.texto}</p>

                </div>
            `).join("")}

        </div>

        <div class="tips-section">

            <h2>
                🌿 Recomendaciones de bienestar
            </h2>

            <div class="tips-grid">

                ${crearTips(
        emocionPrincipal.nombre
    )}

            </div>

        </div>

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
                "Reduce la sobreestimulación",

            descripcion:
                "Tu actividad reciente muestra bastante ansiedad. Intenta reducir estímulos, respirar profundamente y darte pausas reales durante el día."
        },

        triste: {

            icono: "☀️",

            titulo:
                "Reconecta contigo poco a poco",

            descripcion:
                "Has tenido emociones más pesadas últimamente. Intenta salir al exterior, escuchar música tranquila y hablar con alguien cercano."
        },

        feliz: {

            icono: "✨",

            titulo:
                "Mantén esa energía positiva",

            descripcion:
                "Tu estado emocional parece bastante positivo. Aprovecha esta energía para fortalecer hábitos saludables y disfrutar pequeños momentos."
        },

        tranquilo: {

            icono: "🧘",

            titulo:
                "Protege tu calma",

            descripcion:
                "Tu estabilidad emocional es valiosa. Mantén espacios tranquilos, descanso adecuado y tiempo para ti."
        },

        neutral: {

            icono: "🌸",

            titulo:
                "Escucha cómo te sientes",

            descripcion:
                "Aunque no haya emociones intensas, sigue conectando contigo y prestando atención a tu bienestar emocional."
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

            titulo: "Actividad emocional",

            texto:
                `Has registrado ${total} emociones en MoodLens.`
        },

        {
            icono: "📈",

            titulo: "Intensidad promedio",

            texto:
                `Tu intensidad emocional promedio es ${promedio}/10.`
        },

        {
            icono: "💖",

            titulo: "Autocuidado",

            texto:
                "Registrar tus emociones regularmente ayuda a conocerte mejor."
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
                titulo: "Respiración",
                texto:
                    "Inhala lentamente durante 4 segundos y exhala durante 6."
            },

            {
                icono: "📵",
                titulo: "Desconexión",
                texto:
                    "Reduce redes sociales durante momentos de ansiedad."
            },

            {
                icono: "🌙",
                titulo: "Descanso",
                texto:
                    "Dormir mejor puede ayudarte a regular emociones intensas."
            }
        ],

        triste: [
            {
                icono: "☀️",
                titulo: "Luz solar",
                texto:
                    "Salir al exterior puede mejorar tu estado de ánimo."
            },

            {
                icono: "🎵",
                titulo: "Música",
                texto:
                    "Escucha canciones que te transmitan calma."
            },

            {
                icono: "💌",
                titulo: "Conexión",
                texto:
                    "Hablar con alguien cercano puede ayudarte mucho."
            }
        ],

        feliz: [
            {
                icono: "✨",
                titulo: "Gratitud",
                texto:
                    "Escribe cosas positivas que quieras recordar."
            },

            {
                icono: "📸",
                titulo: "Momentos",
                texto:
                    "Guarda recuerdos de los momentos felices."
            },

            {
                icono: "🌱",
                titulo: "Hábitos",
                texto:
                    "Mantén las rutinas que te hacen sentir bien."
            }
        ],

        tranquilo: [
            {
                icono: "🧘",
                titulo: "Meditación",
                texto:
                    "Dedica unos minutos al silencio y la calma."
            },

            {
                icono: "📚",
                titulo: "Tiempo lento",
                texto:
                    "Leer o caminar puede ayudarte a mantener estabilidad."
            },

            {
                icono: "🍵",
                titulo: "Pausas",
                texto:
                    "No olvides descansar incluso en días tranquilos."
            }
        ],

        neutral: [
            {
                icono: "🌸",
                titulo: "Escúchate",
                texto:
                    "Pregúntate cómo te sientes realmente."
            },

            {
                icono: "📝",
                titulo: "Reflexión",
                texto:
                    "Escribir pensamientos ayuda a conectar contigo."
            },

            {
                icono: "💧",
                titulo: "Bienestar",
                texto:
                    "Dormir y cuidarte también impacta tus emociones."
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

            <h3>${item.titulo}</h3>

            <p>${item.texto}</p>

        </div>

    `).join("");
}