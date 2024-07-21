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
        celdaAcciones.appendChild(crearBoton("Abrir", () => window.open(documento.ruta_pdf)));
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
    // Implementa la lógica para abrir la ventana de edición
    console.log('Abrir ventana de edición para:', documento);
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