import { t } from "../../services/i18n.js";

export function renderRegister(app) {

    app.innerHTML = `
<link rel="stylesheet" href="components/register/register.css">

<div class="auth-container">

    <button class="back" onclick="navigate('home')">
        ← ${t("back")}
    </button>

    <div class="auth-card">

        <img src="assets/logo.png" class="logo"/>

        <h2>${t("registerTitle")}</h2>

        <p class="subtitle">
            ${t("registerSubtitle")}
        </p>

        <div class="input-group">

            <label>
                ${t("fullName")}
            </label>

            <div class="input-box">

                <span class="icon">👤</span>

                <input
                    type="text"
                    placeholder="${t("yourName")}"
                    id="nombre"
                >

            </div>

        </div>

        <div class="input-group">

            <label>
                ${t("email")}
            </label>

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

            <label>
                ${t("password")}
            </label>

            <div class="input-box password-box">

                <span class="icon">🔒</span>

                <input
                    type="password"
                    placeholder="********"
                    id="password"
                >

                <span
                    class="toggle-password"
                    id="togglePassword"
                >
                    👁️
                </span>

            </div>

        </div>

        <div class="input-group">

            <label>
                ${t("confirmPassword")}
            </label>

            <div class="input-box password-box">

                <span class="icon">🔒</span>

                <input
                    type="password"
                    placeholder="********"
                    id="confirmPassword"
                >

                <span
                    class="toggle-password"
                    id="toggleConfirmPassword"
                >
                    👁️
                </span>

            </div>

        </div>

        <div class="error"></div>
        <div class="success"></div>

        <button class="btn-main" id="registerBtn">
            ${t("createAccount")}
        </button>

        <p class="switch">

            ${t("alreadyAccount")}

            <span onclick="navigate('login')">
                ${t("loginHere")}
            </span>

        </p>

    </div>

</div>
`;

    document
        .getElementById('registerBtn')
        .addEventListener('click', handleRegister);

    initPasswordToggles();
}

function initPasswordToggles() {

    const passwordInput =
        document.getElementById("password");

    const togglePassword =
        document.getElementById("togglePassword");

    const confirmInput =
        document.getElementById("confirmPassword");

    const toggleConfirm =
        document.getElementById("toggleConfirmPassword");

    togglePassword.addEventListener("click", () => {

        const isPassword =
            passwordInput.type === "password";

        passwordInput.type =
            isPassword ? "text" : "password";

        togglePassword.textContent =
            isPassword ? "🙈" : "👁️";
    });

    toggleConfirm.addEventListener("click", () => {

        const isPassword =
            confirmInput.type === "password";

        confirmInput.type =
            isPassword ? "text" : "password";

        toggleConfirm.textContent =
            isPassword ? "🙈" : "👁️";
    });
}

async function handleRegister() {

    const nombre =
        document.getElementById('nombre').value.trim();

    const email =
        document.getElementById('email').value.trim();

    const password =
        document.getElementById('password').value;

    const confirmPassword =
        document.getElementById('confirmPassword').value;

    const registerBtn =
        document.getElementById('registerBtn');

    const errorBox =
        document.querySelector('.error');

    const successBox =
        document.querySelector('.success');

    errorBox.textContent = '';
    successBox.textContent = '';

    if (
        !nombre ||
        !email ||
        !password ||
        !confirmPassword
    ) {

        return showError(
            t("fillAllFields")
        );
    }

    if (!validateEmail(email)) {

        return showError(
            t("invalidEmail")
        );
    }

    if (password.length < 4) {

        return showError(
            t("passwordMin")
        );
    }

    if (password !== confirmPassword) {

        return showError(
            t("passwordMismatch")
        );
    }

    try {

        registerBtn.disabled = true;

        registerBtn.textContent =
            t("creatingAccount");

        const res = await fetch(
            'https://moodlens-oj88.onrender.com/api/register',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    nombre,
                    email,
                    password
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {

            registerBtn.disabled = false;

            registerBtn.textContent =
                t("createAccount");

            return showError(
                data.message || t("registerError")
            );
        }

        const usuarioGuardado = data.user;

        localStorage.setItem(
            'user',
            JSON.stringify(usuarioGuardado)
        );

        showSuccess(
            t("registerSuccess")
        );

        setTimeout(() => {

            navigate('dashboard');

        }, 1200);

    } catch (error) {

        registerBtn.disabled = false;

        registerBtn.textContent =
            t("createAccount");

        showError(
            t("serverConnectionError")
        );
    }
}

function validateEmail(email) {

    return /\S+@\S+\.\S+/.test(email);
}

function showError(msg) {

    document.querySelector('.error').textContent = msg;
}

function showSuccess(msg) {

    document.querySelector('.success').textContent = msg;
}