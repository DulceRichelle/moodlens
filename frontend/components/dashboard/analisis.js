export function renderAnalisis(app) {
    app.innerHTML = `
    <link rel="stylesheet" href="components/dashboard/registro.css">

    <div class="registro-page">

        <div class="header">
            <h1>📊 Análisis y Estadísticas</h1>
            <p>Visualiza tendencias y patrones de tus emociones</p>
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
        
        

    </div>
    `;

    cargarAnalisis();
}

let moodChart;

async function cargarAnalisis() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id || user.id_usuario;

    try {
        const res = await fetch(`https://moodlens-oj88.onrender.com/api/emociones/${userId}`);
        const data = await res.json();

        if (!data.length) return;

        calcularEstadisticas(data);
        pintarGrafico(data);

    } catch (error) {
        console.error(error);
    }
}

function calcularEstadisticas(data) {
    const total = data.length;

    const suma = data.reduce((acc, item) => acc + Number(item.intensidad), 0);
    const promedio = total ? (suma / total).toFixed(1) : 0;
    const contador = {};

    data.forEach(item => {
        const emocion = item.nombre_emocion;
        contador[emocion] = (contador[emocion] || 0) + 1;
    });

    let frecuente = "N/A";
    let max = 0;

    for (let emocion in contador) {
        if (contador[emocion] > max) {
            max = contador[emocion];
            frecuente = emocion;
        }
    }

    const hoy = new Date();

    const semana = data.filter(item => {
        const fecha = new Date(item.fecha);
        const diff = (hoy - fecha) / (1000 * 60 * 60 * 24);
        return diff <= 7;
    }).length;

    document.getElementById("total").textContent = total;
    document.getElementById("promedio").textContent = `${promedio}/10`;
    document.getElementById("frecuente").textContent = capitalizar(frecuente);
    document.getElementById("semana").textContent = semana;
}

function pintarGrafico(data) {

    const labels = data.map(item => {
        const fecha = new Date(item.fecha);
        return fecha.toLocaleDateString();
    });

    const valores = data.map(item => Number(item.intensidad));

    const coloresEmocion = {
        feliz: '#FFD35A',
        tranquilo: '#45D5F2',
        neutral: '#A0A0A0',
        triste: '#FFA142',
        ansioso: '#8E7CF3'
    };

    const colores = data.map(item => {
        const emocion = item.nombre_emocion?.toLowerCase();
        return coloresEmocion[emocion] || '#4bcffa';
    });

    document.querySelector('.grafico').classList.remove('hidden');

    const ctx = document.getElementById("chart");

    if (moodChart) {
        moodChart.destroy();
    }

    moodChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Estado emocional",
                data: valores,
                tension: 0.4,
                fill: true,
                borderColor: '#4bcffa',
                backgroundColor: 'rgba(75, 207, 250, 0.2)',
                pointBackgroundColor: colores,
                pointBorderColor: colores,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const emocion = data[context.dataIndex].nombre_emocion;
                            return `${emocion} (${context.raw}/10)`;
                        }
                    }
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
    if (!texto || texto === "N/A") return texto;
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}