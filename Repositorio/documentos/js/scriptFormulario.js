function asignarEventosFormulario() {
    const formulario = document.getElementById('postDocumentos');
    formulario.addEventListener('submit', enviarFormulario);
}

function enviarFormulario(event) {
    event.preventDefault(); // Evitar el envío por defecto del formulario

    const formulario = document.getElementById('postDocumentos');
    const formData = new FormData(formulario);

    fetch('http://localhost:5000/documentos', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar los datos');
        }
        return response.json();
    })
    .then(result => {
        alert('Documento guardado exitosamente');
        formulario.reset(); // Limpiar el formulario
        obtenerDatosPdfs(); // Refrescar la tabla de documentos
    })
    .catch(error => manejarError(error, 'guardar el documento'));
}