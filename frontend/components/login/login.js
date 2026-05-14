import { t } from "../../services/i18n.js";

export function renderLogin(app) {

    app.innerHTML = `
    <link rel="stylesheet" href="components/login/login.css">

    <div class="auth-container">

        <button class="back" onclick="navigate('home')">
            ← ${t("back")}
        </button>

        <div class="auth-card">

            <img src="assets/logo.png" class="logo"/>

            <h2>${t("loginTitle")}</h2>

            <p class="subtitle">
                ${t("loginSubtitle")}
            </p>

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
                        placeholder="${t("password")}"
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
            <div class="forgot-password">
            <span id="forgotPasswordBtn">
${t("forgotPassword")}
</span>

</div>
            <div class="error"></div>
            <div class="success"></div>

            <button
                class="btn-main"
                id="loginBtn"
            >
                ${t("loginButton")}
            </button>

            <p class="switch">

                ${t("noAccount")}

                <span onclick="navigate('register')">
                    ${t("registerHere")}
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
        document
            .getElementById("forgotPasswordBtn")
            .addEventListener("click", forgotPassword);

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

        return showError(
            t("fillAllFields")
        );
    }

    if (!validateEmail(email)) {

        return showError(
            t("invalidEmail")
        );
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
                data.message || t("loginError")
            );
        }

        localStorage.setItem(
            'user',
            JSON.stringify(data.user)
        );

        showSuccess(
            t("loginSuccess")
        );

        setTimeout(() => {

            navigate('dashboard');

        }, 1000);

    } catch (error) {

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

async function forgotPassword() {

    const email =
        document
            .getElementById("email")
            .value
            .trim();

    const errorBox =
        document.querySelector(".error");

    const successBox =
        document.querySelector(".success");

    errorBox.textContent = "";
    successBox.textContent = "";

    if (!email) {

        return showError(
            t("enterEmailFirst")
        );
    }

    if (!validateEmail(email)) {

        return showError(
            t("invalidEmail")
        );
    }

    try {

        const res = await fetch(
            "https://moodlens-oj88.onrender.com/api/forgot-password",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {

            return showError(
                data.message ||
                t("resetError")
            );
        }

        showSuccess(
            t("resetEmailSent")
        );

    } catch (error) {

        showError(
            t("serverConnectionError")
        );
    }
}