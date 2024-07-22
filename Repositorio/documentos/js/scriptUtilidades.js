function llenarSelect(idSelect, placeholder, datos, valorKey, textoKey) {
    const select = document.getElementById(idSelect);
    select.innerHTML = `<option value="">${placeholder}</option>`;
    datos.forEach(dato => {
        select.innerHTML += `<option value="${dato[valorKey]}">${dato[textoKey]}</option>`;
    });
}

function generarTabla(datos) {
    const tabla = document.getElementById("lista-pdfs");
    tabla.innerHTML = ''; // Limpiar tabla antes de agregar filas

    datos.forEach(function (documento) {
        const fila = tabla.insertRow();
        agregarCelda(fila, documento.tipo_titulacion);
        agregarCelda(fila, documento.facultad);
        agregarCelda(fila, documento.carrera);
        agregarCeldaConTitulo(fila, documento.titulo || "Sin título", 40);
        agregarCelda(fila, documento.autor || "No especificado");
        agregarCelda(fila, documento.sede || "No especificado");
        agregarCelda(fila, documento.anho || "No especificado");

        const celdaAcciones = fila.insertCell();
        celdaAcciones.appendChild(crearBoton("Modificar", () => abrirVentanaEditar(documento)));
        celdaAcciones.appendChild(crearBoton("Eliminar", () => confirmarEliminacion(documento.id_documento)));
        celdaAcciones.appendChild(crearBoton("Abrir", () => window.open(`${documento.ruta_pdf}`)));
    });
}

function agregarCelda(fila, contenido) {
    const celda = fila.insertCell();
    celda.textContent = contenido;
}

function agregarCeldaConTitulo(fila, contenido, maxCaracteres) {
    const celda = fila.insertCell();
    if (contenido.length > maxCaracteres) {
        celda.textContent = contenido.substring(0, maxCaracteres) + "...";
        celda.title = contenido;
    } else {
        celda.textContent = contenido;
    }
}

function crearBoton(texto, accion) {
    const boton = document.createElement('button');
    boton.textContent = texto;
    boton.addEventListener('click', accion);
    return boton;
}

function abrirVentanaEditar(documento) {
    cargarSelectsEditar(); // Cargar selects antes de llenar el formulario

    // Llenar el formulario con los datos del documento
    document.getElementById('edit-id_documento').value = documento.id_documento;
    document.getElementById('edit-tipo').value = documento.id_tipo_fk;
    document.getElementById('edit-facultad').value = documento.id_facultad_fk;
    
    // Obtener y llenar las carreras según la facultad seleccionada
    fetch(`http://localhost:5000/carreras/cpf/${documento.id_facultad_fk}`, {
        method: 'GET',
    })
    .then(response => validarRespuesta(response, 'Carreras'))
    .then(datos => llenarSelect('edit-carrera', 'Seleccionar Carrera', datos, 'id_carrera', 'nombreCarrera'))
    .catch(error => manejarError(error, 'obtener Carreras'));

    document.getElementById('edit-carrera').value = documento.id_carrera_fk;
    document.getElementById('edit-titulo').value = documento.titulo;
    document.getElementById('edit-autor').value = documento.autor;
    document.getElementById('edit-anho').value = documento.anho;
    document.getElementById('edit-sede').value = documento.sede;

    // Mostrar la ventana emergente
    document.getElementById('edit-ventanaEmergente').style.display = 'block';
}

function confirmarEliminacion(idDocumento) {
    if (confirm("¿Estás seguro de eliminar este documento?")) {
        eliminarDocumento(idDocumento);
    }
}

function eliminarDocumento(idDocumento) {
    fetch(`http://localhost:5000/documentos/${idDocumento}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar documento');
        }
        alert('Documento eliminado correctamente');
        obtenerDatosPdfs(); // Refrescar la tabla después de eliminar
    })
    .catch(error => manejarError(error, 'eliminar documento'));
}

function validarRespuesta(response, contexto) {
    if (!response.ok) {
        throw new Error(`Error al obtener ${contexto}`);
    }
    return response.json();
}

function manejarError(error, contexto) {
    console.error(`Error al ${contexto}:`, error);
}

function cargarSelectsEditar() {
    // Obtener los datos de tipos, facultades y carreras
    fetch('http://localhost:5000/tipos', {
        method: 'GET',
    })
    .then(response => validarRespuesta(response, 'Tipos de Titulación'))
    .then(datos => llenarSelect('edit-tipo', 'Seleccionar Tipo', datos, 'id_tipo', 'nombre'))
    .catch(error => manejarError(error, 'obtener Tipos de Titulación'));

    fetch('http://localhost:5000/facultades', {
        method: 'GET',
    })
    .then(response => validarRespuesta(response, 'Facultades'))
    .then(datos => llenarSelect('edit-facultad', 'Seleccionar Facultad', datos, 'id_facultad', 'nombre'))
    .catch(error => manejarError(error, 'obtener Facultades'));

    // Nota: Se obtendrán las carreras después de seleccionar la facultad
}
