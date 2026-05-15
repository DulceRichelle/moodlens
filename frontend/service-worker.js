const CACHE_NAME = "moodlens-v1";

const ARCHIVOS_CACHE = [
    "/",
    "/index.html",
    "/styles/global.css",
    "/styles/theme.css",
    "/assets/logo.png",
    "/router/router.js",
    "/components/home/home.css",
    "/components/login/login.css",
    "/components/register/register.css",
    "/components/dashboard/dashboard.css",
    "/components/dashboard/registro.css",
    "/components/dashboard/historial.css",
    "/components/dashboard/perfil.css",
    "/components/dashboard/consejos.css",
    "/components/dashboard/analisis.css",
    "https://cdn.jsdelivr.net/npm/chart.js"
];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ARCHIVOS_CACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys =>

            Promise.all(

                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )

        ).then(() => clients.claim())
    );
});

self.addEventListener("fetch", event => {

    // Las llamadas a la API siempre van a la red
    if (event.request.url.includes("moodlens-oj88.onrender.com")) {

        event.respondWith(

            fetch(event.request)
                .catch(() => new Response(
                    JSON.stringify({ error: "Sin conexión" }),
                    { headers: { "Content-Type": "application/json" } }
                ))
        );

        return;
    }

    event.respondWith(

        caches.match(event.request)
            .then(cached => {

                if (cached) return cached;

                return fetch(event.request)
                    .then(response => {

                        // Cachea dinámicamente archivos nuevos
                        if (
                            response.ok &&
                            event.request.method === "GET"
                        ) {

                            const copia = response.clone();

                            caches.open(CACHE_NAME)
                                .then(cache =>
                                    cache.put(event.request, copia)
                                );
                        }

                        return response;
                    })
                    .catch(() => {

                        if (event.request.mode === "navigate") {

                            return caches.match("/index.html");
                        }
                    });
            })
    );
});
