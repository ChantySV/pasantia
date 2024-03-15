const contenedor_pdf = document.getElementById("lista-pdfs");
let resultadoDocumentos = "";

const cargaDocumentos = (datos) => {
  datos.forEach((dato) => {
    console.log(dato);
    resultadoDocumentos += `
    <a href="../${dato.ruta_pdf}">
    <li>
      <div class="imagen-portada">
        <img src="logopdf.jpg" alt="Imagen de portada del PDF 1">
      </div>
      <div class="informacion">
          <h3 class="titulo">${dato.titulo}</h3>
          <p class="carrera">${dato.carrera}</p>
          <p class="autor">${dato.autor}</p>
          <p class="año">${dato.año}</p>
      </div>
    </li> 
  </a>
  `;
  });
  contenedor_pdf.innerHTML = resultadoDocumentos;
};

fetch("http://localhost:5000/documentos")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Hay un error en la carga de datos");
    }
    return response.json();
  })
  .then((dato) => cargaDocumentos(dato));