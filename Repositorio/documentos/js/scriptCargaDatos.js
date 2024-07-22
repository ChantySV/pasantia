function obtenerTiposDeTitulacion() {
    fetch('http://localhost:5000/tipos', {
        method: 'GET',
    })
    .then(response => validarRespuesta(response, 'Tipos de Titulación'))
    .then(datos => llenarSelect('id_tipo_fk', 'Seleccionar Tipo', datos, 'id_tipo', 'nombre'))
    .catch(error => manejarError(error, 'obtener Tipos de Titulación'));
}

function obtenerFacultad() {
    fetch('http://localhost:5000/facultades', {
        method: 'GET',
    })
    .then(response => validarRespuesta(response, 'Facultades'))
    .then(datos => {
        llenarSelect('id_facultad_fk', 'Seleccionar Facultad', datos, 'id_facultad', 'nombre');
        agregarEventoCambioFacultad();
    })
    .catch(error => manejarError(error, 'obtener Facultades'));
}

function obtenerCarrerasPorFacultad(idFacultad, idSelectCarrera) {
    fetch(`http://localhost:5000/carreras/cpf/${idFacultad}`, {
        method: 'GET',
    })
    .then(response => validarRespuesta(response, 'Carreras'))
    .then(datos => llenarSelect(idSelectCarrera, 'Seleccionar Carrera', datos, 'id_carrera', 'nombreCarrera'))
    .catch(error => manejarError(error, 'obtener Carreras'));
}

function obtenerDatosPdfs() {
    fetch('http://localhost:5000/documentos/vista', {
        method: 'GET',
    })
    .then(response => validarRespuesta(response, 'datos de PDFs'))
    .then(datos => generarTabla(datos))
    .catch(error => manejarError(error, 'obtener datos de PDFs'));
}

function cargarDatosIniciales() {
    obtenerTiposDeTitulacion();
    obtenerFacultad();
    obtenerDatosPdfs();
}