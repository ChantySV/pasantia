function asignarEventosFormulario() {
    const formulario = document.getElementById('postDocumentos');
    formulario.addEventListener('submit', enviarFormulario);
}

function enviarFormulario(event) {
    event.preventDefault(); 

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
        formulario.reset(); 
        obtenerDatosPdfs(); 
    })
    .catch(error => manejarError(error, 'guardar el documento'));
}


document.getElementById('edit-formularioEditarDocumento').addEventListener('submit', (event) => {
    event.preventDefault(); 

    const formData = new FormData(event.target);
    const idDocumento = formData.get('id_documento');
    
    fetch(`http://localhost:5000/documentos/${idDocumento}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el documento');
        }
        alert('Documento actualizado correctamente');
        document.getElementById('edit-ventanaEmergente').style.display = 'none';
        obtenerDatosPdfs(); 
    })
    .catch(error => manejarError(error, 'actualizar documento'));
});
function buscarDocumentos() {
    const input = document.getElementById("busqueda");
    const filtro = input.value.toUpperCase();
    const tabla = document.getElementById("tablaDatos");
    const filas = tabla.getElementsByTagName("tr");
  
    for (let i = 0; i < filas.length; i++) {
      const celdaTitulo = filas[i].getElementsByTagName("td")[3];
  
      if (celdaTitulo) {
        const textoTitulo = celdaTitulo.textContent || celdaTitulo.innerText;
        if (textoTitulo.toUpperCase().indexOf(filtro) > -1) {
          filas[i].style.display = "";
        } else {
          filas[i].style.display = "none";
        }
      }
    }
  }
  