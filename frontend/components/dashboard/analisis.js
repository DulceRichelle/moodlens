import {
    t,
    getLanguage
} from "../../services/i18n.js";

let moodChart;

export function renderAnalisis(app){

    app.innerHTML = `

<link rel="stylesheet" href="components/dashboard/analisis.css">

<div class="analisis-page">

    <section class="analisis-hero">

        <div class="hero-content">

            <h1>
                📊 ${t("analysisStats")}
            </h1>

            <p>
                ${t("analysisSubtitle")}
            </p>

            <div class="quick-insights">

                <div class="insight">

                    <span>
                        ✨
                    </span>

                    <h3>
                        Emotional Awareness
                    </h3>

                    <p>
                        Your emotional patterns become clearer with every new entry.
                    </p>

                </div>

                <div class="insight">

                    <span>
                        🧠
                    </span>

                    <h3>
                        Personal Insights
                    </h3>

                    <p>
                        Detect mood tendencies and emotional intensity over time.
                    </p>

                </div>

                <div class="insight">

                    <span>
                        🌙
                    </span>

                    <h3>
                        Wellness Journey
                    </h3>

                    <p>
                        Emotional tracking helps improve self awareness and routines.
                    </p>

                </div>

            </div>

        </div>

    </section>

    <section class="stats-grid">

        <div class="stat-card">

            <div class="stat-icon blue">
                📘
            </div>

            <p>
                ${t("totalRecords")}
            </p>

            <h2 id="total">
                0
            </h2>

        </div>

        <div class="stat-card">

            <div class="stat-icon purple">
                📈
            </div>

            <p>
                ${t("averageIntensity")}
            </p>

            <h2 id="promedio">
                0/10
            </h2>

        </div>

        <div class="stat-card">

            <div class="stat-icon orange">
                😊
            </div>

            <p>
                ${t("mostCommonMood")}
            </p>

            <h2 id="frecuente">
                N/A
            </h2>

        </div>

        <div class="stat-card">

            <div class="stat-icon yellow">
                🔥
            </div>

            <p>
                ${t("last7Days")}
            </p>

            <h2 id="semana">
                0
            </h2>

        </div>

    </section>

    <section class="chart-section">

        <div class="chart-card">

            <h2>
                ${t("moodTrend")}
            </h2>

            <div class="chart-wrapper">

                <canvas id="chart"></canvas>

            </div>

        </div>

        <div class="mood-distribution">

            <h2>
                Mood Distribution
            </h2>

            <div
                class="mood-list"
                id="moodList"
            ></div>

        </div>

    </section>

    <section class="analysis-grid">

        <div class="analysis-card">

            <span>
                💙
            </span>

            <h3>
                Emotional Balance
            </h3>

            <p id="balanceText">
                Your emotional balance insights will appear here.
            </p>

        </div>

        <div class="analysis-card">

            <span>
                📅
            </span>

            <h3>
                Activity Pattern
            </h3>

            <p id="activityText">
                Your emotional activity patterns will appear here.
            </p>

        </div>

        <div class="analysis-card">

            <span>
                🌱
            </span>

            <h3>
                Growth Reflection
            </h3>

            <p id="growthText">
                Personalized emotional reflections will appear here.
            </p>

        </div>

    </section>

</div>
`;

    cargarAnalisis();
}

async function cargarAnalisis(){

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    if(!user) return;

    const userId =
        user.id || user.id_usuario;

    try{

        const res = await fetch(
            `https://moodlens-oj88.onrender.com/api/emociones/${userId}`
        );

        const data = await res.json();

        if(!data.length){

            mostrarEstadoVacio();

            return;
        }

        calcularEstadisticas(data);

        pintarGrafico(data);

        pintarDistribucion(data);

        generarInsights(data);

    }catch(error){

        console.error(error);
    }
}

function calcularEstadisticas(data){

    const total = data.length;

    const suma = data.reduce(
        (acc,item) =>
            acc + Number(item.intensidad),
        0
    );

    const promedio =
        total
            ? (suma / total).toFixed(1)
            : 0;

    const contador = {};

    data.forEach(item => {

        const emocion =
            item.nombre_emocion;

        contador[emocion] =
            (contador[emocion] || 0) + 1;
    });

    let frecuente = "N/A";

    let max = 0;

    for(const emocion in contador){

        if(contador[emocion] > max){

            max = contador[emocion];

            frecuente = emocion;
        }
    }

    const hoy = new Date();

    const semana = data.filter(item => {

        const fecha =
            new Date(item.fecha);

        const diff =
            (hoy - fecha) /
            (1000 * 60 * 60 * 24);

        return diff <= 7;

    }).length;

    document.getElementById("total")
        .textContent = total;

    document.getElementById("promedio")
        .textContent = `${promedio}/10`;

    document.getElementById("frecuente")
        .textContent =
        traducirEmocion(frecuente);

    document.getElementById("semana")
        .textContent = semana;
}

function pintarGrafico(data){

    const labels = data.map(item => {

        return new Date(item.fecha)
            .toLocaleDateString(
                getLanguage()
            );
    });

    const valores = data.map(
        item => Number(item.intensidad)
    );

    const ctx =
        document.getElementById("chart");

    if(moodChart){

        moodChart.destroy();
    }

    moodChart = new Chart(ctx,{

        type:"line",

        data:{

            labels,

            datasets:[
                {
                    label:
                        t("emotionalState"),

                    data:valores,

                    tension:.45,

                    fill:true,

                    borderWidth:4,

                    borderColor:"#49C7E7",

                    backgroundColor:
                        "rgba(73,199,231,.18)",

                    pointRadius:6,

                    pointHoverRadius:8,

                    pointBackgroundColor:"#5D7BEE",

                    pointBorderWidth:3,

                    pointBorderColor:"#fff"
                }
            ]
        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{
                    display:false
                }
            },

            scales:{

                x:{

                    grid:{
                        display:false
                    }
                },

                y:{

                    min:0,
                    max:10,

                    ticks:{
                        stepSize:2
                    }
                }
            }
        }
    });
}

function pintarDistribucion(data){

    const moodList =
        document.getElementById("moodList");

    const emociones = {

        feliz:{
            emoji:"😊",
            color:"yellow"
        },

        tranquilo:{
            emoji:"💙",
            color:"blue"
        },

        neutral:{
            emoji:"😐",
            color:"purple"
        },

        triste:{
            emoji:"😢",
            color:"orange"
        },

        ansioso:{
            emoji:"😖",
            color:"purple"
        }
    };

    const contador = {};

    data.forEach(item => {

        const emocion =
            item.nombre_emocion
                .toLowerCase();

        contador[emocion] =
            (contador[emocion] || 0) + 1;
    });

    moodList.innerHTML = "";

    Object.keys(contador).forEach(emocion => {

        const porcentaje =
            Math.round(
                (contador[emocion] / data.length) * 100
            );

        const mood =
            emociones[emocion];

        moodList.innerHTML += `

<div class="mood-item">

    <div class="mood-left">

        <div class="mood-emoji ${mood.color}">

            ${mood.emoji}

        </div>

        <div class="mood-info">

            <h3>
                ${traducirEmocion(emocion)}
            </h3>

            <p>
                ${contador[emocion]} entries
            </p>

        </div>

    </div>

    <div class="mood-percent">

        ${porcentaje}%

    </div>

</div>
`;
    });
}

function generarInsights(data){

    const promedio =
        data.reduce(
            (acc,item) =>
                acc + Number(item.intensidad),
            0
        ) / data.length;

    document.getElementById("balanceText")
        .textContent =
        promedio >= 7
            ? "Your recent emotional intensity has been quite high. Taking breaks and reflecting may help balance your energy."
            : "Your emotional intensity appears relatively balanced and stable recently.";

    document.getElementById("activityText")
        .textContent =
        `You have logged ${data.length} emotional entries so far, helping build a clearer emotional timeline.`;

    document.getElementById("growthText")
        .textContent =
        "Consistent emotional tracking improves self awareness and helps recognize emotional patterns over time.";
}

function mostrarEstadoVacio(){

    document.querySelector(
        ".analisis-page"
    ).innerHTML = `

<div class="empty-state">

    <h2>
        📊 No analysis available yet
    </h2>

    <p>
        Start tracking your emotions to unlock emotional insights, mood analytics and personalized reflections.
    </p>

</div>
`;
}

function traducirEmocion(emocion){

    const emociones = {

        feliz:t("happy"),
        tranquilo:t("calm"),
        neutral:t("neutral"),
        triste:t("sad"),
        ansioso:t("anxious")
    };

    return emociones[
        emocion?.toLowerCase()
        ] || emocion;
}