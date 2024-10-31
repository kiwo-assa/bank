// server.js

const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname)); // Servir archivos estáticos (index.html, admin.html, etc.)

// Configurar el transporte de correo electrónico
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER, // Tu correo electrónico
        pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación
    }
});

// Variable para almacenar el token temporal
let tempToken = null;
let tokenExpiration = null;

// Almacenar los usuarios en el servidor
let users = [
    {
        username: 'superadmin',
        password: 'SuperPassword123!',
        isAdmin: true,
        email: 'tu_correo@example.com' // Reemplaza con tu correo real
    },
    {
        username: 'usuario1',
        password: 'password1',
        isAdmin: false
    },
    // Puedes agregar más usuarios aquí
];

// Ruta para autenticar al usuario
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true, user });
    } else {
        res.json({ success: false });
    }
});

// Ruta para enviar el token al correo electrónico
app.post('/send-token', (req, res) => {
    const { email } = req.body;

    if (email) {
        // Generar un token de un solo uso
        tempToken = crypto.randomBytes(3).toString('hex'); // Token de 6 dígitos hexadecimales
        tokenExpiration = Date.now() + 10 * 60 * 1000; // Token válido por 10 minutos

        // Configurar el correo electrónico
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Token de Acceso - Autenticación de Dos Factores',
            text: `Tu token de acceso es: ${tempToken}`
        };

        // Enviar el correo electrónico
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error);
                res.json({ success: false });
            } else {
                res.json({ success: true });
            }
        });
    } else {
        res.json({ success: false });
    }
});

// Ruta para verificar el token ingresado
app.post('/verify-token', (req, res) => {
    const { token } = req.body;

    // Verificar si el token es válido y no ha expirado
    if (token === tempToken && Date.now() < tokenExpiration) {
        // Autenticación exitosa
        tempToken = null;
        tokenExpiration = null;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Rutas para administrar usuarios

// Obtener la lista de usuarios
app.get('/users', (req, res) => {
    res.json(users);
});

// Crear un nuevo usuario
app.post('/users', (req, res) => {
    const newUser = req.body;
    // Verificar que el usuario no exista ya
    const existingUser = users.find(u => u.username === newUser.username);
    if (existingUser) {
        res.status(400).json({ message: 'El nombre de usuario ya existe' });
    } else {
        users.push(newUser);
        res.json({ message: 'Usuario creado exitosamente' });
    }
});

// Actualizar un usuario existente
app.put('/users/:username', (req, res) => {
    const username = req.params.username;
    const updatedUser = req.body;
    const index = users.findIndex(u => u.username === username);
    if (index !== -1) {
        users[index] = updatedUser;
        res.json({ message: 'Usuario actualizado exitosamente' });
    } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
});

// Eliminar un usuario
app.delete('/users/:username', (req, res) => {
    const username = req.params.username;
    const index = users.findIndex(u => u.username === username);
    if (index !== -1) {
        users.splice(index, 1);
        res.json({ message: 'Usuario eliminado exitosamente' });
    } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
});

// Ruta para servir admin.html
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
