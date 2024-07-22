document.addEventListener('DOMContentLoaded', () => {
    const formularioAgregar = document.getElementById('postFacultades');
    const tablaFacultades = document.getElementById('tablaFacultades');
    const ventanaEmergente = document.getElementById('edit-ventanaEmergente');
    const formularioEditar = document.getElementById('edit-formularioEditarFacultad');
    const cerrarVentana = document.getElementById('edit-cerrarVentana');
    let idFacultadEdicion = null;

    // Función para mostrar un mensaje de éxito o error
    const mostrarMensaje = (mensaje, tipo = 'success') => {
        const mensajeDiv = document.getElementById('mensaje');
        if (tipo === 'error') {
            // Usar alert para errores
            alert(mensaje);
        } else {
            // Mostrar el mensaje en una div para éxito
            mensajeDiv.textContent = mensaje;
            mensajeDiv.className = tipo;
        }
    };

    // Función para cargar las facultades
    const cargarFacultades = async () => {
        try {
            const response = await fetch('http://localhost:5000/facultades/');
            if (!response.ok) throw new Error('Error al obtener las facultades');
            const facultades = await response.json();

            // Limpiar la tabla antes de llenarla
            tablaFacultades.querySelector('tbody').innerHTML = '';

            facultades.forEach(facultad => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${facultad.nombre}</td>
                    <td>
                        <button class="editar" data-id="${facultad.id_facultad}">Editar</button>
                        <button class="eliminar" data-id="${facultad.id_facultad}">Eliminar</button>
                    </td>
                `;
                tablaFacultades.querySelector('tbody').appendChild(row);
            });

            // Añadir eventos a los botones de editar y eliminar
            document.querySelectorAll('.editar').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    const response = await fetch(`http://localhost:5000/facultades/${id}`);
                    const facultad = await response.json();
                    
                    // Rellenar el formulario de edición
                    document.getElementById('edit-nombre').value = facultad.nombre;
                    idFacultadEdicion = id;
                    
                    // Mostrar la ventana emergente
                    ventanaEmergente.style.display = 'block';
                });
            });

            document.querySelectorAll('.eliminar').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('¿Estás seguro de que quieres eliminar esta facultad?')) {
                        try {
                            const response = await fetch(`http://localhost:5000/facultades/eliminar/${id}`, { method: 'DELETE' });
                            if (!response.ok) {
                                const error = await response.json();
                                throw new Error(error.error || 'Error al eliminar la facultad');
                            }
                            mostrarMensaje('Facultad eliminada exitosamente');
                            cargarFacultades(); // Recargar las facultades
                        } catch (error) {
                            mostrarMensaje(`Error: ${error.message}`, 'error');
                        }
                    }
                });
            });

        } catch (error) {
            mostrarMensaje(`Error: ${error.message}`, 'error');
        }
    };

    // Función para agregar una nueva facultad
    const agregarFacultad = async (event) => {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value;

        try {
            const response = await fetch('http://localhost:5000/facultades/agregar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre })
            });
            if (!response.ok) throw new Error('Error al agregar la facultad');
            mostrarMensaje('Facultad agregada exitosamente');
            formularioAgregar.reset();
            cargarFacultades(); // Recargar las facultades
        } catch (error) {
            mostrarMensaje(`Error: ${error.message}`, 'error');
        }
    };

    // Función para actualizar una facultad
    const actualizarFacultad = async (event) => {
        event.preventDefault();
        const nombre = document.getElementById('edit-nombre').value;

        if (idFacultadEdicion === null) {
            mostrarMensaje('ID de facultad no especificado', 'error');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/facultades/modificar/${idFacultadEdicion}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre })
            });
            if (!response.ok) throw new Error('Error al actualizar la facultad');
            mostrarMensaje('Facultad actualizada exitosamente');
            ventanaEmergente.style.display = 'none';
            cargarFacultades(); // Recargar las facultades
        } catch (error) {
            mostrarMensaje(`Error: ${error.message}`, 'error');
        }
    };

    // Evento para el formulario de agregar
    formularioAgregar.addEventListener('submit', agregarFacultad);

    // Evento para el formulario de edición
    formularioEditar.addEventListener('submit', actualizarFacultad);

    // Evento para cerrar la ventana emergente
    cerrarVentana.addEventListener('click', () => {
        ventanaEmergente.style.display = 'none';
    });

    // Cargar las facultades al cargar la página
    cargarFacultades();
});