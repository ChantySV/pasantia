document.addEventListener("DOMContentLoaded", function () {
  // Llenar selects al cargar la página
  llenarSelectTipos();
  llenarSelectCarreras();

  // Configurar eventos de filtrado
  document.getElementById("parametroCarrera").addEventListener("change", manejarCambioCarrera);
  document.getElementById("parametroTipo").addEventListener("change", manejarCambioTipo);
  document.getElementById("parametroSede").addEventListener("change", manejarCambioSede);
});

const contenedor_pdf = document.getElementById("lista-pdfs");
let datosIniciales = []; // Variable para almacenar los datos iniciales

function cargaDocumentos(datos) {
  contenedor_pdf.innerHTML = ""; // Limpiar el contenido anterior del contenedor

  datos.forEach((dato) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <a href="/${dato.ruta_pdf}" target="_blank">
        <div class="imagen-portada">
           <canvas id="pdf-canvas-${dato.id_documento}" class="pdf-canvas"></canvas>
        </div>
        <div class="informacion">
          <h3 class="titulo">${dato.titulo}</h3>
          <p class="carrera">${dato.carrera}</p>
          <p class="autor">${dato.autor}</p>
          <p class="tipo_titulacion">${dato.tipo_titulacion}</p>
          <p class="año">${dato.anho}</p>
          <p class="sede">${dato.sede}</p>
        </div>
      </a>
    `;
    contenedor_pdf.appendChild(listItem);
    const canvasId = `pdf-canvas-${dato.id_documento}`;
    renderizarPrimeraPagina(`/${dato.ruta_pdf}`, canvasId);
    console.log(dato);
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

// Fetch inicial para cargar todos los documentos al inicio
fetch("http://localhost:5000/documentos/vista")
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

// Función para llenar el select de modalidades
function llenarSelectTipos() {
  fetch("http://localhost:5000/tipos")
    .then((response) => response.json())
    .then((data) => {
      const selectTipo = document.getElementById("parametroTipo");
      selectTipo.innerHTML = '<option value="">Seleccionar Modalidad</option>'; // Opcional: Opción predeterminada
      data.forEach((tipo) => {
        const option = document.createElement("option");
        option.value = tipo.nombre; // Usa el nombre directamente
        option.textContent = tipo.nombre;
        selectTipo.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al cargar tipos:", error));
}

// Función para llenar el select de carreras
function llenarSelectCarreras() {
  fetch("http://localhost:5000/carreras")
    .then((response) => response.json())
    .then((data) => {
      const selectCarrera = document.getElementById("parametroCarrera");
      selectCarrera.innerHTML = '<option value="">Seleccionar Carrera</option>'; // Opcional: Opción predeterminada
      data.forEach((carrera) => {
        const option = document.createElement("option");
        option.value = carrera.nombre; // Usa el nombre directamente
        option.textContent = carrera.nombre;
        selectCarrera.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al cargar carreras:", error));
}

// Función para manejar el cambio en el select de carrera
function manejarCambioCarrera() {
  // Restablecer los otros selects al valor predeterminado
  document.getElementById("parametroTipo").value = "";
  document.getElementById("parametroSede").value = "";
  
  // Filtrar documentos según la carrera seleccionada
  filtrarDocumentos();
}

// Función para manejar el cambio en el select de tipo
function manejarCambioTipo() {
  // Restablecer los otros selects al valor predeterminado
  document.getElementById("parametroCarrera").value = "";
  document.getElementById("parametroSede").value = "";
  
  // Filtrar documentos según el tipo seleccionado
  filtrarDocumentos();
}

// Función para manejar el cambio en el select de sede
function manejarCambioSede() {
  // Restablecer los otros selects al valor predeterminado
  document.getElementById("parametroCarrera").value = "";
  document.getElementById("parametroTipo").value = "";
  
  // Filtrar documentos según la sede seleccionada
  filtrarDocumentos();
}

function filtrarDocumentos() {
  const carrera = document.getElementById("parametroCarrera").value;
  const tipo = document.getElementById("parametroTipo").value;
  const sede = document.getElementById("parametroSede").value;

  // Mostrar todos los documentos si no hay filtros aplicados
  if (!carrera && !tipo && !sede) {
    cargaDocumentos(datosIniciales);
    return;
  }
  
  // Filtrar documentos basados en los parámetros seleccionados
  const datosFiltrados = datosIniciales.filter((dato) => {
    const coincideCarrera = !carrera || dato.carrera === carrera;
    const coincideTipo = !tipo || dato.tipo_titulacion === tipo;
    const coincideSede = !sede || dato.sede === sede;
    return coincideCarrera && coincideTipo && coincideSede;
  });

  cargaDocumentos(datosFiltrados); // Mostrar los documentos filtrados
}

// Función para buscar documentos por título o autor
function buscarDocumentos() {
  const input = document.getElementById("buscarDocumento");
  const filtro = input.value.toUpperCase();
  const contenedorPdf = document.getElementById("lista-pdfs");
  const items = contenedorPdf.getElementsByTagName("li");

  for (let i = 0; i < items.length; i++) {
      const tituloElemento = items[i].getElementsByClassName("titulo")[0];
      const autorElemento = items[i].getElementsByClassName("autor")[0];

      if (tituloElemento && autorElemento) {
          const textoTitulo = tituloElemento.textContent || tituloElemento.innerText;
          const textoAutor = autorElemento.textContent || autorElemento.innerText;

          if (textoTitulo.toUpperCase().indexOf(filtro) > -1 || textoAutor.toUpperCase().indexOf(filtro) > -1) {
              items[i].style.display = "";
          } else {
              items[i].style.display = "none";
          }
      }
  }
}

// Añadir un event listener para buscar instantáneamente
document.getElementById("buscarDocumento").addEventListener("input", buscarDocumentos);
