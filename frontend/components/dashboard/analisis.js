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

            <div class="section-header">

                <div>

                    <h2>
                        ${t("moodTrend")}
                    </h2>

                    <p>
                        ${t("emotionalTimeline")}
                    </p>

                </div>

            </div>

            <div class="chart-wrapper">

                <canvas id="chart"></canvas>

            </div>

        </div>

        <div class="mood-distribution">

            <div class="section-header">

                <div>

                    <h2>
                        ${t("moodDistribution")}
                    </h2>

                    <p>
                        ${t("mostRegisteredMoods")}
                    </p>

                </div>

            </div>

            <div
                class="mood-list"
                id="moodList"
            ></div>

        </div>

    </section>

    <section class="insight-section">

        <div class="real-insight-card">

            <div class="real-insight-icon">
                ✨
            </div>

            <div>

                <h3>
                    ${t("emotionalInsight")}
                </h3>

                <p id="realInsightText">
                    ...
                </p>

            </div>

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

        generarInsightReal(data);

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
                        "rgba(73,199,231,.16)",

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
                    },

                    ticks:{
                        color:"#6E6894"
                    }
                },

                y:{

                    min:0,
                    max:10,

                    ticks:{
                        stepSize:2,
                        color:"#6E6894"
                    },

                    grid:{
                        color:"rgba(0,0,0,.06)"
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
                ${contador[emocion]} ${t("entries")}
            </p>

        </div>

    </div>

    <div class="mood-right">

        <strong>
            ${porcentaje}%
        </strong>

        <div class="progress-bar">

            <div
                class="progress-fill ${mood.color}"
                style="width:${porcentaje}%"
            ></div>

        </div>

    </div>

</div>
`;
    });
}

function generarInsightReal(data){

    const promedio =
        data.reduce(
            (acc,item) =>
                acc + Number(item.intensidad),
            0
        ) / data.length;

    let texto = "";

    if(promedio >= 8){

        texto =
            t("highIntensityInsight");

    }else if(promedio >= 5){

        texto =
            t("balancedInsight");

    }else{

        texto =
            t("calmInsight");
    }

    document.getElementById(
        "realInsightText"
    ).textContent = texto;
}

function mostrarEstadoVacio(){

    document.querySelector(
        ".analisis-page"
    ).innerHTML = `

<div class="empty-state">

    <h2>
        📊 ${t("noAnalysisYet")}
    </h2>

    <p>
        ${t("startTrackingToSeeInsights")}
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