export function renderHome(app) {
    app.innerHTML = `
    <link rel="stylesheet" href="components/home/home.css">

    <section class="hero">

        <img src="assets/logo.png" class="logo"/>

        <h1>Bienvenido a MoodLens</h1>

        <p class="subtitle">
            Tu compañero personal de bienestar emocional. Registra, analiza y mejora
            tu salud mental día a día.
        </p>

        <div class="buttons">
            <button class="btn-primary" onclick="navigate('register')">
                Comenzar ahora →
            </button>

            <button class="btn-secondary" onclick="navigate('login')">
                Iniciar sesión
            </button>
        </div>

    </section>

    <section class="features">

        <div class="card">
            <div class="icon orange">❤</div>
            <h3>Registro Diario</h3>
            <p>Registra tu estado de ánimo con facilidad</p>
        </div>

        <div class="card">
            <div class="icon blue">📈</div>
            <h3>Análisis Profundo</h3>
            <p>Visualiza tendencias y patrones emocionales</p>
        </div>

        <div class="card">
            <div class="icon yellow">📖</div>
            <h3>Historial Completo</h3>
            <p>Accede a todo tu historial emocional</p>
        </div>

        <div class="card">
            <div class="icon purple">✨</div>
            <h3>Consejos Personalizados</h3>
            <p>Recibe tips de bienestar adaptados</p>
        </div>

    </section>
    `;
}