//Control de año

const añoActual = new Date().getFullYear();
const campoAño = document.getElementById("anho");
campoAño.max = añoActual;

//GET MODALIDADES
const contenedor_pdf = document.getElementById("lista-pdfs");
let resultadoDocumentos = "";

const cargaDocumentos = (datos) => {
  datos.forEach((dato) => {
    console.log(dato);
    resultadoDocumentos += `
    <tr>
    <td>${dato.tipo}</td>
    <td>${dato.carrera}</td>
    <td>${dato.titulo}</td>
    <td>${dato.autor}</td>
    <td>${dato.año}</td>
    <td><a href="../${dato.ruta_pdf}">Abrir</td>    
  </tr>
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

//POST MODALIDADES
document.getElementById('postDocumentos').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    
    // Obtener los datos del formulario
    const formData = new FormData(this);
  
    // Hacer la solicitud Fetch
    fetch('http://localhost:5000/documentos', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al realizar la solicitud');
      }
      return response.json();
    })
    .then(data => {
      console.log('Respuesta del servidor:', data);
      // Hacer algo con la respuesta del servidor, si es necesario
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
  