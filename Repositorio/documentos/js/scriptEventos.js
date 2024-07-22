function agregarEventoCambioFacultad() {
    const selectFacultad = document.getElementById('id_facultad_fk');
    selectFacultad.addEventListener('change', function() {
        const idFacultad = this.value;
        if (idFacultad) {
            obtenerCarrerasPorFacultad(idFacultad, 'id_carrera_fk');
        } else {
            llenarSelect('id_carrera_fk', 'Seleccionar Carrera', [], '', '');
        }
    });
    
    const selectFacultadEditar = document.getElementById('edit-facultad');
    selectFacultadEditar.addEventListener('change', function() {
        const idFacultad = this.value;
        if (idFacultad) {
            obtenerCarrerasPorFacultad(idFacultad, 'edit-carrera');
        } else {
            llenarSelect('edit-carrera', 'Seleccionar Carrera', [], '', '');
        }
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
        celdaAcciones.appendChild(crearBoton("Abrir", () => window.open(`../../../${documento.ruta_pdf}`)));
    });
}
function confirmarEliminacion(idDocumento) {
    if (confirm("¿Estás seguro de eliminar este documento?")) {
        eliminarDocumento(idDocumento);
    }
}
function eliminarDocumento(idDocumento) {
    fetch(`http://localhost:5000/documentos/delete/${idDocumento}`, {
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
document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos iniciales
    cargarDatosIniciales();
    // Asignar la función al evento submit del formulario
    asignarEventosFormulario();

    // Manejo del clic en el botón de cerrar la ventana emergente
    document.getElementById('edit-cerrarVentana').addEventListener('click', () => {
        document.getElementById('edit-ventanaEmergente').style.display = 'none';
    });
});

function asignarEventosFormulario() {
    // Manejo del evento de cambio en el select de facultades en la ventana de edición
    document.getElementById('edit-facultad').addEventListener('change', function() {
        const idFacultad = this.value;
        if (idFacultad) {
            actualizarCarrerasPorFacultad(idFacultad);
        } else {
            llenarSelect('edit-carrera', 'Seleccionar Carrera', [], '', '');
        }
    });
}