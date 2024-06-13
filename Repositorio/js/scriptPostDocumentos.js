document.addEventListener("DOMContentLoaded", function () {
  const añoActual = new Date().getFullYear();
  const campoAño = document.getElementById("anho");
  campoAño.max = añoActual;

  const camposMostrados = [
    "tipo",
    "facultad",
    "carrera",
    "titulo",
    "autor",
    "sede",
    "anho",
  ];

  // Función para generar la tabla de documentos
  function generarTabla(datos) {
    const tabla = document.getElementById("lista-pdfs");

    datos.forEach(function (documento) {
      const fila = tabla.insertRow();

      camposMostrados.forEach(function (campo) {
        const celda = fila.insertCell();

        if (campo === "titulo") {
          const titulo = documento[campo];
          const maxCaracteres = 40;

          if (titulo.length > maxCaracteres) {
            celda.textContent = titulo.substring(0, maxCaracteres) + "...";
            celda.title = titulo;
          } else {
            celda.textContent = titulo;
          }
        } else {
          celda.textContent = documento[campo];
        }
      });

      const accionesCell = fila.insertCell();
      accionesCell.appendChild(
        crearBoton("Modificar", function () {
          abrirVentanaEditar(documento);
        })
      );
      accionesCell.appendChild(
        crearBoton("Eliminar", function () {
          if (confirm("¿Estás seguro de eliminar este documento?")) {
            eliminarDocumento(documento.id_documento);
          }
        })
      );
      accionesCell.appendChild(
        crearBoton("Abrir", function () {
          window.open(documento.ruta_pdf);
        })
      );
    });
  }

  // Función para abrir la ventana emergente de edición
  function abrirVentanaEditar(documento) {
    const camposEditar = [
      "tipo",
      "facultad",
      "carrera",
      "titulo",
      "autor",
      "anho",
      "sede",
      "id_documento",
    ];

    camposEditar.forEach(function (campo) {
      document.getElementById(`edit-${campo}`).value = documento[campo];
    });

    document.getElementById("edit-ventanaEmergente").style.display = "block";
  }

  // Función para eliminar un documento
  function eliminarDocumento(id_documento) {
    fetch(`http://localhost:5000/documentos/delete/${id_documento}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al eliminar el documento");
        }
        document.getElementById(`fila-${id_documento}`).remove();
        console.log("Documento eliminado correctamente");
      })
      .catch((error) => {
        console.error("Error al eliminar el documento:", error);
        mostrarMensaje("Error al eliminar el documento", true);
      });
  }

  // Función para crear un botón con texto y función de callback
  function crearBoton(texto, callback) {
    const boton = document.createElement("button");
    boton.textContent = texto;
    boton.addEventListener("click", callback);
    return boton;
  }

  // Evento para cerrar la ventana emergente de edición
  document
    .getElementById("edit-cerrarVentana")
    .addEventListener("click", function () {
      document.getElementById("edit-ventanaEmergente").style.display = "none";
    });

  // Evento submit para el formulario de edición
  document
    .getElementById("edit-formularioEditarDocumento")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      const id_documento = formData.get("id_documento");

      fetch(`http://localhost:5000/documentos/put/${id_documento}`, {
        method: "PUT",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar el documento");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Documento actualizado correctamente:", data);
          mostrarMensaje("Documento actualizado correctamente");
          document.getElementById("edit-ventanaEmergente").style.display =
            "none";
        })
        .catch((error) => {
          console.error("Error al actualizar el documento:", error);
          mostrarMensaje("Error al actualizar el documento", true);
        });
    });

  // Función para mostrar mensajes de éxito o error
  function mostrarMensaje(mensaje, esError = false) {
    const mensajeElement = document.getElementById("mensaje");
    mensajeElement.textContent = mensaje;
    mensajeElement.style.display = "block";
    mensajeElement.style.color = esError ? "red" : "green";

    setTimeout(() => {
      mensajeElement.style.display = "none";
    }, 3000);
  }

  // Obtener los datos del servidor y generar la tabla
  fetch("http://localhost:5000/documentos")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los datos del servidor");
      }
      return response.json();
    })
    .then((datos) => {
      generarTabla(datos);
    })
    .catch((error) => {
      console.error("Error al obtener los datos del servidor:", error);
      mostrarMensaje("Error al obtener los datos del servidor", true);
    });

  // Evento submit para el formulario de creación de documentos
  document
    .getElementById("postDocumentos")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(this);

      fetch("http://localhost:5000/documentos", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al crear el documento");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Documento creado correctamente:", data);
          // Aquí podrías realizar alguna acción adicional si es necesario
        })
        .catch((error) => {
          console.error("Error al crear el documento:", error);
          mostrarMensaje("Error al crear el documento", true);
        });
    });

// Función para actualizar opciones de carrera basado en la facultad seleccionada
function actualizarOpcionesCarrera(facultadSelect, carreraSelect) {
  const opcionesCarrera = {
    "Ciencias Jurídicas": ["Derecho"],
    "Ciencias Empresariales": [
      "Administración de Empresas",
      "Contaduría Publica",
      "Ingeniería Comercial",
      "Marketing y Publicidad",
    ],
    "Ciencias Sociales": [
      "Ciencias de la Comunicación Social",
      "Psicología",
      "Psicopedagogía",
      "Relaciones Internacionales",
      "Gestión del Turismo",
    ],
    Ingeniería: [
      "Ingeniería de Sistemas",
      "Ingeniería Industrial",
      "Ingeniería en Gestíon Petrolera",
      "Ingeniería en Redes y Telecomunicaciones",
      "Ingeniería Civil",
      "Ingeniería en Gestíon Ambiental",
    ],
    "Ciencias de la Salud": ["Medicina", "Fisioterapia y Kinesiologia"],
  };

  const selectedFacultad = facultadSelect.value;
  const carreras = opcionesCarrera[selectedFacultad] || [];

  // Limpiar y actualizar las opciones de carrera
  carreraSelect.innerHTML = '<option value="">Seleccionar Carrera</option>';
  carreras.forEach(function (carrera) {
    const option = document.createElement("option");
    option.value = carrera;
    option.textContent = carrera;
    carreraSelect.appendChild(option);
  });
}

// Obtener los elementos select de facultad y carrera en ambos formularios
const postFacultadSelect = document.getElementById("facultad");
const postCarreraSelect = document.getElementById("carrera");

const editFacultadSelect = document.getElementById("edit-facultad");
const editCarreraSelect = document.getElementById("edit-carrera");

// Evento change para actualizar las opciones de carrera en el formulario de creación
postFacultadSelect.addEventListener("change", function () {
  actualizarOpcionesCarrera(postFacultadSelect, postCarreraSelect);
});

// Evento change para actualizar las opciones de carrera en el formulario de edición
editFacultadSelect.addEventListener("change", function () {
  actualizarOpcionesCarrera(editFacultadSelect, editCarreraSelect);
});

// Función inicial para establecer las opciones de carrera en ambos formularios
actualizarOpcionesCarrera(postFacultadSelect, postCarreraSelect);
actualizarOpcionesCarrera(editFacultadSelect, editCarreraSelect);
});
// Función para filtrar la tabla por título
function filtrarTabla() {
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
