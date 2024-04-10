const contenedor_pdf = document.getElementById("lista-pdfs");
let resultadoDocumentos = "";
let datosIniciales = []; // Variable para almacenar los datos iniciales

function cargaDocumentos(datos) {
  const contenedorPdf = document.getElementById("lista-pdfs");

  // Limpiar el contenido anterior del contenedor
  contenedorPdf.innerHTML = "";

  // Iterar sobre los datos y construir el HTML
  datos.forEach(dato => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <a href="../${dato.ruta_pdf}">
        <div class="imagen-portada">
          <img src="logopdf.jpg" alt="Imagen de portada del PDF 1">
        </div>
        <div class="informacion">
          <h3 class="titulo">${dato.titulo}</h3>
          <p class="carrera">${dato.carrera}</p>
          <p class="autor">${dato.autor}</p>
          <p class="año">${dato.año}</p>
        </div>
      </a>
    `;
    contenedorPdf.appendChild(listItem);
  });
}

function enviarParametro(parametro) {
  // Obtener el valor seleccionado del selector actual
  const parametroSeleccionado = document.getElementById(`parametro${parametro.charAt(0).toUpperCase() + parametro.slice(1)}`).value;

  // Obtener todos los selectores
  const selectores = document.querySelectorAll('select');

  // Iterar sobre todos los selectores
  selectores.forEach(selector => {
    // Restablecer el valor del selector
    if (selector.id !== `parametro${parametro.charAt(0).toUpperCase() + parametro.slice(1)}`) {
      selector.selectedIndex = 0; // Establecer el índice seleccionado como el primero
    }
  });

  const url = `http://localhost:5000/documentos/${parametro}/${parametroSeleccionado}`; // URL del backend

  // Realizar la petición GET al backend con Fetch
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud.');
      }
      return response.json();
    })
    .then(data => {
      // Limpiar el contenedor de documentos antes de cargar los nuevos
      document.getElementById("lista-pdfs").innerHTML = "";

      // Cargar los nuevos documentos
      cargaDocumentos(data);
    })
    .catch(error => {
      // Manejar el error si ocurre
      console.error('Error:', error);
    });
}


// Este fetch inicial es necesario para cargar los datos iniciales
fetch("http://localhost:5000/documentos")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Hay un error en la carga de datos");
    }
    return response.json();
  })
  .then((dato) => {
    // Almacena los datos iniciales en la variable global
    datosIniciales = dato;
    cargaDocumentos(dato);
  })
  .catch(error => {
    console.error("Error:", error);
  });
