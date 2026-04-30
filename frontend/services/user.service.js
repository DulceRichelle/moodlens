const API = 'http://192.168.1.128:3000/api';

export async function login(email, password) {
    const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
}

export async function register(nombre, email, password) {
    const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
    });

    return res.json();
}

export function logout() {
    localStorage.removeItem('user');
}

export function getUser() {
    return JSON.parse(localStorage.getItem('user'));
}

export function isLogged() {
    return !!localStorage.getItem('user');
}