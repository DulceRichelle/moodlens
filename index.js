require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');
const bcrypt = require('bcrypt');
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('MoodLens API funcionando');
});

app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});

app.post('/api/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, hashedPassword],
            (err, result) => {

                if (err) {

                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({
                            message: 'Este correo ya está registrado'
                        });
                    }

                    console.log(err);
                    return res.status(500).send(err);
                }

                res.json({
                    message: 'Usuario creado correctamente'
                });
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email],
        async (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: 'Usuario no encontrado'
                });
            }

            const user = result[0];

            const match = await bcrypt.compare(password, user.password);

            if (match) {
                const { password, ...userSinPassword } = user;

                res.json({
                    message: 'Login correcto',
                    user: userSinPassword
                });

            } else {
                res.status(401).json({
                    message: 'Contraseña incorrecta'
                });
            }
        }
    );
});

app.post('/api/emociones', (req, res) => {
    const {
        id_usuario,
        id_emocion,
        intensidad,
        nota
    } = req.body;

    const fecha = new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

    db.query(
        `INSERT INTO registros_emocionales
             (fecha, intensidad, nota, id_usuario, id_emocion)
         VALUES (?, ?, ?, ?, ?)`,
        [fecha, intensidad, nota, id_usuario, id_emocion],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }

            res.json({
                message: 'Estado emocional guardado correctamente'
            });
        }
    );
});

app.get('/api/emociones/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    db.query(
        `SELECT
             r.*,
             e.nombre_emocion,
             e.icono
         FROM registros_emocionales r
                  JOIN emociones e
                       ON r.id_emocion = e.id_emocion
         WHERE r.id_usuario = ?
         ORDER BY r.fecha ASC`,
        [id_usuario],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }

            res.json(result);
        }
    );
});

app.post('/api/registros', (req, res) => {
    const {
        fecha,
        intensidad,
        nota,
        id_usuario,
        id_emocion
    } = req.body;

    db.query(
        `INSERT INTO registros_emocionales 
        (fecha, intensidad, nota, id_usuario, id_emocion) 
        VALUES (?, ?, ?, ?, ?)`,
        [fecha, intensidad, nota, id_usuario, id_emocion],
        (err, result) => {

            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.json({
                    message: 'Registro emocional guardado'
                });
            }
        }
    );
});

app.get('/api/registros/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    db.query(
        `SELECT r.*, e.nombre_emocion, e.icono
         FROM registros_emocionales r
         JOIN emociones e 
         ON r.id_emocion = e.id_emocion
         WHERE r.id_usuario = ?`,
        [id_usuario],
        (err, result) => {

            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.json(result);
            }
        }
    );
});

app.get('/api/stats/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    const query = `
        SELECT 
            COUNT(*) AS total_registros,

            ROUND(AVG(intensidad), 1) AS promedio_intensidad,

            (
                SELECT e.nombre_emocion
                FROM registros_emocionales r2
                JOIN emociones e 
                    ON r2.id_emocion = e.id_emocion
                WHERE r2.id_usuario = ?
                GROUP BY r2.id_emocion
                ORDER BY COUNT(*) DESC
                LIMIT 1
            ) AS emocion_frecuente,

            (
                SELECT COUNT(*)
                FROM registros_emocionales
                WHERE id_usuario = ?
                AND fecha >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            ) AS ultimos_7_dias

        FROM registros_emocionales
        WHERE id_usuario = ?
    `;

    db.query(
        query,
        [id_usuario, id_usuario, id_usuario],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }

            res.json(result[0]);
        }
    );
});

app.delete('/api/emociones/:id', (req, res) => {
    const { id } = req.params;

    db.query(
        'DELETE FROM registros_emocionales WHERE id_registro = ?',
        [id],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }

            res.json({ message: 'Registro eliminado' });
        }
    );
});

app.put('/api/emociones/:id', (req, res) => {

    const { id } = req.params;
    const { intensidad, nota } = req.body;

    db.query(
        `UPDATE registros_emocionales
         SET intensidad = ?, nota = ?
         WHERE id_registro = ?`,
        [intensidad, nota, id],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }

            res.json({ message: 'Registro actualizado' });
        }
    );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});