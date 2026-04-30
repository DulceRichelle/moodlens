export function renderConsejos(app) {
    app.innerHTML = `
    <link rel="stylesheet" href="components/dashboard/consejos.css">

    <div class="consejos-page">

        <div class="header-consejos">
            <h1>💡 Consejos de Bienestar</h1>
            <p>Descubre consejos para mejorar tu bienestar</p>
        </div>

        <div class="consejos-container">

            <h2>Consejos de bienestar</h2>

            <div class="consejos-grid">

                <div class="consejo-card">
                    <div class="icon amarillo">☀️</div>
                    <h3>Luz solar</h3>
                    <p>
                        Exponte al sol durante 15-30 minutos diarios
                        para mejorar tu ánimo.
                    </p>
                </div>

                <div class="consejo-card">
                    <div class="icon azul">🌬️</div>
                    <h3>Respiración profunda</h3>
                    <p>
                        Practica ejercicios de respiración para reducir
                        el estrés y la ansiedad.
                    </p>
                </div>

                <div class="consejo-card">
                    <div class="icon naranja">🧡</div>
                    <h3>Ejercicio regular</h3>
                    <p>
                        El movimiento físico libera endorfinas que
                        mejoran tu estado de ánimo.
                    </p>
                </div>

                <div class="consejo-card">
                    <div class="icon morado">🧠</div>
                    <h3>Meditación</h3>
                    <p>
                        Dedica 10 minutos al día a la meditación
                        para calmar tu mente.
                    </p>
                </div>

                <div class="consejo-card">
                    <div class="icon celeste">💧</div>
                    <h3>Hidratación</h3>
                    <p>
                        Beber suficiente agua también ayuda
                        a regular tus emociones.
                    </p>
                </div>

                <div class="consejo-card">
                    <div class="icon rosa">✨</div>
                    <h3>Gratitud</h3>
                    <p>
                        Escribe 3 cosas positivas cada día
                        para entrenar tu mente.
                    </p>
                </div>

            </div>

        </div>

    </div>
    `;
}