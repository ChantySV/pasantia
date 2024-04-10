document.addEventListener("DOMContentLoaded", function () {
  //Control de año
  const añoActual = new Date().getFullYear();
  const campoAño = document.getElementById("anho");
  campoAño.max = añoActual;

  // Función para generar la tabla con los datos recibidos del servidor
  var camposMostrados = [
    "tipo",
    "facultad",
    "carrera",
    "titulo",
    "autor",
    "sede",
    "año",
  ];

  function generarTabla(datos) {
    var tabla = document.getElementById("lista-pdfs");

    datos.forEach(function (documento) {
      var fila = tabla.insertRow();

      // Insertar las celdas con los datos de los campos seleccionados
      camposMostrados.forEach(function (campo) {
        var celda = fila.insertCell();
        celda.textContent = documento[campo];
      });

      // Agregar botones "Modificar", "Eliminar" y "Abrir"
      var accionesCell = fila.insertCell();

      var botonModificar = document.createElement("button");
      botonModificar.textContent = "Modificar";
      botonModificar.addEventListener("click", function () {
        abrirVentanaEditar(documento); // Pasar el id_documento al abrir la ventana de edición
      });
      accionesCell.appendChild(botonModificar);

      var botonEliminar = document.createElement("button");
      botonEliminar.textContent = "Eliminar";
      botonEliminar.addEventListener("click", function () {
        eliminarDocumento(documento.id_documento); // Llamar a la función eliminarDocumento con el id del documento
      });
      accionesCell.appendChild(botonEliminar);

      var botonAbrir = document.createElement("a");
      botonAbrir.textContent = "Abrir";
      botonAbrir.href = documento.ruta_pdf; // Establecer el atributo href con la ruta del PDF
      accionesCell.appendChild(botonAbrir);
    });
  }

  function abrirVentanaEditar(documento) {
    document.getElementById('edit-tipo').value = documento.tipo;
    document.getElementById('edit-facultad').value = documento.facultad;
    document.getElementById('edit-carrera').value = documento.carrera;
    document.getElementById('edit-titulo').value = documento.titulo;
    document.getElementById('edit-autor').value = documento.autor;
    document.getElementById('edit-año').value = documento.año;
    document.getElementById('edit-sede').value = documento.sede;

    // Aquí puedes asignar el id_documento al campo oculto en el formulario de edición
    document.getElementById('edit-id_documento').value = documento.id_documento;

    document.getElementById('edit-ventanaEmergente').style.display = 'block';
}

document.getElementById('edit-formularioEditarDocumento').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    // Obtener el ID del documento a editar del campo oculto en el formulario
    const id_documento = document.getElementById('edit-id_documento').value;

    // Realizar la solicitud Fetch para enviar los datos actualizados al servidor
    fetch(`http://localhost:5000/documentos/put/${id_documento}`, {
        method: 'PUT', // Utiliza el método PUT para actualizar los datos en el servidor
        body: formData        
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al realizar la solicitud');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos actualizados correctamente:', data);
        document.getElementById('edit-ventanaEmergente').style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('edit-ventanaEmergente').style.display = 'none';
});

// Función para eliminar un documento
function eliminarDocumento(id_documento) {
    fetch(`http://localhost:5000/documentos/delete/${id_documento}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el documento');
        }
        // Eliminar la fila de la tabla
        document.getElementById('fila-' + id_documento).remove();
        console.log('Documento eliminado correctamente');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

  // Obtener los datos del servidor y generar la tabla al cargar la página
  fetch("http://localhost:5000/documentos")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Hay un error en la carga de datos");
      }
      return response.json();
    })
    .then((datos) => {
      generarTabla(datos);
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });

  // Cerrar la ventana emergente al hacer clic en el botón de cerrar
  document
    .getElementById("edit-cerrarVentana")
    .addEventListener("click", function () {
      document.getElementById("edit-ventanaEmergente").style.display = "none";
    });

  // Agregar un evento submit al formulario de edición de documento
  document
    .getElementById("edit-formularioEditarDocumento")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      // Aquí puedes obtener los datos del formulario de edición y enviarlos al servidor para modificar el documento
      // Después de modificar el documento, cierra la ventana emergente
      document.getElementById("edit-ventanaEmergente").style.display = "none";
    });
});

//POST MODALIDADES
document.getElementById("postDocumentos").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    // Obtener los datos del formulario
    const formData = new FormData(this);

    // Hacer la solicitud Fetch
    fetch("http://localhost:5000/documentos", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al realizar la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        // Hacer algo con la respuesta del servidor, si es necesario
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
