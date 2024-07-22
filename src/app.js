const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());

// Servir archivos estáticos para cada sección
//RUTA INICIO
app.use('/inicio/css', express.static(path.join(__dirname, '../Repositorio/inicio/css')));
app.use('/inicio/js', express.static(path.join(__dirname, '../Repositorio/inicio/js')));
app.use('/inicio/html', express.static(path.join(__dirname, '../Repositorio/inicio/html')));

//RUTA LOGIN
app.use('/login/css', express.static(path.join(__dirname, '../Repositorio/login/css')));
app.use('/login/js', express.static(path.join(__dirname, '../Repositorio/login/js')));
app.use('/login/html', express.static(path.join(__dirname, '../Repositorio/login/html')));

//RUTA DOCUMENTOS
app.use('/documentos/css', express.static(path.join(__dirname, '../Repositorio/documentos/css')));
app.use('/documentos/js', express.static(path.join(__dirname, '../Repositorio/documentos/js')));
app.use('/documentos/html', express.static(path.join(__dirname, '../Repositorio/documentos/html')));

//RUTA FACULTADES
app.use('/facultades/css', express.static(path.join(__dirname, '../Repositorio/facultades/css')));
app.use('/facultades/js', express.static(path.join(__dirname, '../Repositorio/facultades/js')));
app.use('/facultades/html', express.static(path.join(__dirname, '../Repositorio/facultades/html')));

//RUTA CARRERAS
app.use('/carreras/css', express.static(path.join(__dirname, '../Repositorio/carreras/css')));
app.use('/carreras/js', express.static(path.join(__dirname, '../Repositorio/carreras/js')));
app.use('/carreras/html', express.static(path.join(__dirname, '../Repositorio/carreras/html')));

//RUTA USUARIOS
app.use('/usuarios/css', express.static(path.join(__dirname, '../Repositorio/usuarios/css')));
app.use('/usuarios/js', express.static(path.join(__dirname, '../Repositorio/usuarios/js')));
app.use('/usuarios/html', express.static(path.join(__dirname, '../Repositorio/usuarios/html')));

// RUTA TIPO
app.use('/tipos/css', express.static(path.join(__dirname, '../Repositorio/tipos/css')));
app.use('/tipos/js', express.static(path.join(__dirname, '../Repositorio/tipos/js')));
app.use('/tipos/html', express.static(path.join(__dirname, '../Repositorio/tipos/html')));

//RUTA IMG
app.use('/public/img', express.static(path.join(__dirname, '../Repositorio/public/img')));

// RUTA PDFS
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));



// Rutas para servir los archivos HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Repositorio/inicio/html/repositorio.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../Repositorio/login/html/login.html'));
});

app.get('/documento', (req, res) => {
  res.sendFile(path.join(__dirname, '../Repositorio/documentos/html/postDocumentos.html'));
});

app.get('/facultad', (req, res) => {
  res.sendFile(path.join(__dirname, '../Repositorio/facultades/html/facultades.html'));
});

app.get('/carrera', (req, res) => {
  res.sendFile(path.join(__dirname, '../Repositorio/carreras/html/carreras.html'));
});

app.get('/usuario', (req, res) => {
  res.sendFile(path.join(__dirname, '../Repositorio/usuarios/html/usuarios.html'));
});

app.get('/tipo', (req, res) => {
  res.sendFile(path.join(__dirname, '../Repositorio/tipos/html/tipos.html'));
});

// Configura rutas adicionales para la API si es necesario
app.use(require("./routes/usuarios.routes"));
app.use(require("./routes/login.routes"));
app.use(require("./routes/facultades.routes"));
app.use(require("./routes/carreras.routes"));
app.use(require("./routes/tipos.routes"));
app.use(require("./routes/documentos.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor levantado en el puerto ${PORT}`);
});
