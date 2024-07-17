const contenedor_pdf = document.getElementById("lista-pdfs");
let datosIniciales = []; // Variable para almacenar los datos iniciales

function cargaDocumentos(datos) {
  contenedor_pdf.innerHTML = ""; // Limpiar el contenido anterior del contenedor

  datos.forEach((dato) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <a href="../../${dato.ruta_pdf}" target="_blank">
        <div class="imagen-portada">
           <canvas id="pdf-canvas-${dato.id_documento}" class="pdf-canvas"></canvas>
        </div>
        <div class="informacion">
          <h3 class="titulo">${dato.titulo}</h3>
          <p class="carrera">${dato.carrera}</p>
          <p class="autor">${dato.autor}</p>
          <p class="año">${dato.anho}</p>
        </div>
      </a>
    `;
    contenedor_pdf.appendChild(listItem);
    const canvasId = `pdf-canvas-${dato.id_documento}`;
    renderizarPrimeraPagina(`../../${dato.ruta_pdf}`, canvasId);
  });
}
function renderizarPrimeraPagina(url, canvasId) {
  pdfjsLib
    .getDocument(url)
    .promise.then((pdf) => {
      pdf.getPage(1).then((page) => {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext("2d");
        const viewport = page.getViewport({ scale: 1.0 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        page.render(renderContext);
      });
    })
    .catch((error) => {
      console.error("Error al renderizar el PDF: ", error);
    });
}

function enviarParametro(parametro) {
  // Obtener el valor seleccionado del selector actual
  const parametroSeleccionado = document.getElementById(
    `parametro${parametro.charAt(0).toUpperCase() + parametro.slice(1)}`
  ).value;

  // Obtener todos los selectores
  const selectores = document.querySelectorAll("select");

  // Iterar sobre todos los selectores
  selectores.forEach((selector) => {
    // Restablecer el valor del selector
    if (
      selector.id !==
      `parametro${parametro.charAt(0).toUpperCase() + parametro.slice(1)}`
    ) {
      selector.selectedIndex = 0; // Establecer el índice seleccionado como el primero
    }
  });
  if (parametroSeleccionado === "") {
    // Cargar los datos iniciales
    cargaDocumentos(datosIniciales);
    return;
  }
  const url = `http://localhost:5000/documentos/${parametro}/${parametroSeleccionado}`; // URL del backend

  // Realizar la petición GET al backend con Fetch
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud.");
      }
      return response.json();
    })
    .then((data) => {
      // Limpiar el contenedor de documentos antes de cargar los nuevos
      document.getElementById("lista-pdfs").innerHTML = "";

      // Cargar los nuevos documentos
      cargaDocumentos(data);
    })
    .catch((error) => {
      // Manejar el error si ocurre
      console.error("Error:", error);
    });
}

function buscarDocumentos(termino) {
  if (termino.trim() === "") {
    // Cargar los datos iniciales
    cargaDocumentos(datosIniciales);
    return;
  }
  const url = `http://localhost:5000/documentos/busqueda/${termino}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud.");
      }
      return response.json();
    })
    .then((data) => {
      cargaDocumentos(data); // Mostrar los documentos encontrados en el mismo contenedor
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Ocurrió un error al realizar la búsqueda.");
    });
}

// Event listener para el formulario de búsqueda
document
  .getElementById("form-busqueda")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que se recargue la página

    const inputBusqueda = document.getElementById("input-busqueda");
    const terminoBusqueda = inputBusqueda.value.trim();

    buscarDocumentos(terminoBusqueda);
  });

// Fetch inicial para cargar todos los documentos al inicio
fetch("http://localhost:5000/documentos")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error al cargar los documentos.");
    }
    return response.json();
  })
  .then((data) => {
    datosIniciales = data;
    cargaDocumentos(data); // Mostrar los documentos al inicio
  })
  .catch((error) => {
    console.error("Error:", error);
    alert("Ocurrió un error al cargar los documentos.");
  });
