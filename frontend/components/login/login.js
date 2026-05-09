export function renderLogin(app) {

app.innerHTML = `
    <link rel="stylesheet" href="components/login/login.css">

        <div class="auth-container">

        <button class="back" onclick="navigate('home')">
        ← Volver
    </button>

    <div class="auth-card">

        <img src="assets/logo.png" class="logo"/>

        <h2>Iniciar Sesión</h2>
        <p class="subtitle">Bienvenido de nuevo a MoodLens</p>

        <div class="input-group">
            <label>Correo electrónico</label>

            <div class="input-box">
                <span class="icon">✉️</span>

                <input
                    type="email"
                    placeholder="tu@email.com"
                    id="email"
                >
            </div>
        </div>

        <div class="input-group">
            <label>Contraseña</label>

            <div class="input-box password-box">

                <span class="icon">🔒</span>

                <input
                    type="password"
                    placeholder="Contraseña"
                    id="password"
                >

                <span class="toggle-password" id="togglePassword">
                    👁️
                </span>

            </div>
        </div>

        <div class="error"></div>
        <div class="success"></div>

        <button class="btn-main" id="loginBtn">
            Iniciar Sesión
        </button>

        <p class="switch">
            ¿No tienes cuenta?
            <span onclick="navigate('register')">
                Regístrate aquí
            </span>
        </p>

    </div>

</div>
`;

document
.getElementById('loginBtn')
.addEventListener('click', login);

const togglePassword =
document.getElementById("togglePassword");

const passwordInput =
document.getElementById("password");

togglePassword.addEventListener("click", () => {

    const isPassword =
        passwordInput.type === "password";

    passwordInput.type =
        isPassword ? "text" : "password";

    togglePassword.textContent =
        isPassword ? "🙈" : "👁️";
});

}

async function login() {


const email =
    document.getElementById('email').value.trim();

const password =
    document.getElementById('password').value;

const errorBox =
    document.querySelector('.error');

const successBox =
    document.querySelector('.success');

errorBox.textContent = '';
successBox.textContent = '';

if (!email || !password) {
    return showError('Completa todos los campos');
}

if (!validateEmail(email)) {
    return showError('Correo electrónico no válido :(');
}

try {

    const res = await fetch(
        'https://moodlens-oj88.onrender.com/api/login',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        }
    );

    const data = await res.json();

    if (!res.ok) {
        return showError(
            data.message || 'Error al iniciar sesión :('
        );
    }

    localStorage.setItem(
        'user',
        JSON.stringify(data.user)
    );

    showSuccess('¡Login correcto! :D🎉');

    setTimeout(() => {
        navigate('dashboard');
    }, 1000);

} catch (error) {
    showError('Error de conexión con el servidor :(');
}


}

function validateEmail(email) {
    return /\S+@\S+.\S+/.test(email);
}

function showError(msg) {
    document.querySelector('.error').textContent = msg;
}

function showSuccess(msg) {
    document.querySelector('.success').textContent = msg;
}
