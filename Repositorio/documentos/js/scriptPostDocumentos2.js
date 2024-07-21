document.addEventListener("DOMContentLoaded", () => {
    // Función para obtener los Tipos de Titulación
    function obtenerTiposDeTitulacion() {
        fetch('http://localhost:5000/tipos', {
            method: 'GET',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener Tipos de Titulación');
            }
            return response.json();
        })
        .then(datos => {
            const selectTipo = document.getElementById('id_tipo_fk');
            selectTipo.innerHTML = '<option value="">Seleccionar Tipo</option>';
            datos.forEach(tipo => {
                selectTipo.innerHTML += `<option value="${tipo.id_tipo}">${tipo.nombre}</option>`;
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Función para obtener las Facultades
    function obtenerFacultad() {
        fetch('http://localhost:5000/facultades', {
            method: 'GET',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener Facultades');
            }
            return response.json();
        })
        .then(datos => {
            const selectFacultad = document.getElementById('id_facultad_fk');
            selectFacultad.innerHTML = '<option value="">Seleccionar Facultad</option>';
            datos.forEach(facultad => {
                selectFacultad.innerHTML += `<option value="${facultad.id_facultad}">${facultad.nombre}</option>`;
            });

            // Llamar a la función para cargar carreras cuando se seleccione una facultad
            selectFacultad.addEventListener('change', function() {
                const idFacultad = this.value;
                if (idFacultad) {
                    obtenerCarrerasPorFacultad(idFacultad);
                } else {
                    // Limpiar el select de carreras si no se selecciona una facultad
                    const selectCarrera = document.getElementById('id_carrera_fk');
                    selectCarrera.innerHTML = '<option value="">Seleccionar Carrera</option>';
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Función para obtener las Carreras por Facultad
    function obtenerCarrerasPorFacultad(idFacultad) {
        fetch(`http://localhost:5000/carreras/cpf/${idFacultad}`, {
            method: 'GET',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener Carreras');
            }
            return response.json();
        })
        .then(datos => {
            const selectCarrera = document.getElementById('id_carrera_fk');
            selectCarrera.innerHTML = '<option value="">Seleccionar Carrera</option>';
            datos.forEach(carrera => {
                selectCarrera.innerHTML += `<option value="${carrera.id_carrera}">${carrera.nombreCarrera}</option>`;
            });            
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Función para obtener los datos y cargar en lista-pdfs
    function obtenerDatosPdfs() {
        fetch('http://localhost:5000/documentos/vista', {
            method: 'GET',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener datos de PDFs');
            }
            return response.json();
        })
        .then(datos => {
            generarTabla(datos);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Función para generar la tabla en lista-pdfs
    function generarTabla(datos) {
        const tabla = document.getElementById("lista-pdfs");
        tabla.innerHTML = ''; // Limpiar tabla antes de agregar filas

        datos.forEach(function (documento) {
            const fila = tabla.insertRow();

            // Insertar celdas según la estructura de la tabla
            const celdaModalidad = fila.insertCell();
            celdaModalidad.textContent = documento.tipo_titulacion;

            const celdaFacultad = fila.insertCell();
            celdaFacultad.textContent = documento.facultad;

            const celdaCarrera = fila.insertCell();
            celdaCarrera.textContent = documento.carrera;

            const celdaTitulo = fila.insertCell();
            const maxCaracteres = 40;
            const titulo = documento.titulo || "Sin título";

            if (titulo.length > maxCaracteres) {
                celdaTitulo.textContent = titulo.substring(0, maxCaracteres) + "...";
                celdaTitulo.title = titulo;
            } else {
                celdaTitulo.textContent = titulo;
            }

            const celdaAutor = fila.insertCell();
            celdaAutor.textContent = documento.autor || "No especificado";

            const celdaSede = fila.insertCell();
            celdaSede.textContent = documento.sede || "No especificado";

            const celdaAño = fila.insertCell();
            celdaAño.textContent = documento.anho || "No especificado";

            const celdaAcciones = fila.insertCell();
            celdaAcciones.appendChild(
                crearBoton("Modificar", function () {
                    abrirVentanaEditar(documento);
                })
            );
            celdaAcciones.appendChild(
                crearBoton("Eliminar", function () {
                    if (confirm("¿Estás seguro de eliminar este documento?")) {
                        eliminarDocumento(documento.id_documento);
                    }
                })
            );
            celdaAcciones.appendChild(
                crearBoton("Abrir", function () {
                    window.open(documento.ruta_pdf);
                })
            );
        });
    }

    // Función para crear un botón
    function crearBoton(texto, accion) {
        const boton = document.createElement('button');
        boton.textContent = texto;
        boton.addEventListener('click', accion);
        return boton;
    }

    // Función para abrir ventana de edición
    function abrirVentanaEditar(documento) {
        // Implementa la lógica para abrir la ventana de edición
        console.log('Abrir ventana de edición para:', documento);
    }

    // Función para eliminar documento
    function eliminarDocumento(idDocumento) {
        fetch(`http://localhost:5000/documentos/${idDocumento}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar documento');
            }
            alert('Documento eliminado correctamente');
            obtenerDatosPdfs(); // Refrescar la tabla después de eliminar
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Función para enviar el formulario
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
        .catch(error => {
            console.error('Error:', error);
            alert('Error al guardar el documento');
        });
    }

    // Asignar la función al evento submit del formulario
    const formulario = document.getElementById('postDocumentos');
    formulario.addEventListener('submit', enviarFormulario);

    // Llamar a las funciones para cargar los datos al cargar la página
    obtenerTiposDeTitulacion();
    obtenerFacultad();
    obtenerDatosPdfs();
});
