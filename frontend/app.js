async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch('http://192.168.1.128:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.user) {
        localStorage.setItem('userId', data.user.id_usuario);
        alert('Login correcto');
    } else {
        alert('Error en login');
    }
}

async function cargarRegistros() {
    const userId = localStorage.getItem('userId');

    const res = await fetch(`http://192.168.1.128:3000/api/registros/${userId}`);
    const data = await res.json();

    const lista = document.getElementById('lista');
    lista.innerHTML = '';

    data.forEach(reg => {
        const li = document.createElement('li');
        li.textContent = `${reg.fecha} - ${reg.nombre_emocion} ${reg.icono}`;
        lista.appendChild(li);
    });
}
async function cargarGrafico() {
    const userId = localStorage.getItem('userId');

    const res = await fetch(`http://192.168.1.128:3000/api/registros/${userId}`);
    const data = await res.json();

    const emociones = {};

    data.forEach(r => {
        emociones[r.nombre_emocion] = (emociones[r.nombre_emocion] || 0) + 1;
    });

    const ctx = document.getElementById('grafico');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(emociones),
            datasets: [{
                data: Object.values(emociones),
            }]
        },
        options: {
            animation: {
                duration: 1500
            }
        }
    });
}

cargarGrafico();
async function guardarRegistro() {
    const userId = localStorage.getItem('userId');

    const fecha = document.getElementById('fecha').value;
    const intensidad = document.getElementById('intensidad').value;
    const nota = document.getElementById('nota').value;
    const emocion = document.getElementById('emocion').value;

    const res = await fetch('http://192.168.1.128:3000/api/registros', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fecha,
            intensidad,
            nota,
            id_usuario: userId,
            id_emocion: emocion
        })
    });

    const data = await res.json();

    alert(data.message);

    cargarRegistros();
}

function goTo(page) {
    document.body.classList.add('fade-out');

    setTimeout(() => {
        window.location.href = page;
    }, 400);
}

async function register() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;

    if (password !== confirm) {
        alert('Las contraseñas no coinciden');
        return;
    }

    const res = await fetch('http://192.168.1.128:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, password })
    });

    const data = await res.json();

    alert(data.message);

    if (res.ok) {
        goTo('login.html');
    }
}

function initScrollAnimations() {
    const cards = document.querySelectorAll('.card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => observer.observe(card));
}

window.initScrollAnimations = initScrollAnimations;