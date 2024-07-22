document.addEventListener('DOMContentLoaded', () => {
    const formularioAgregar = document.getElementById('postCarreras');
    const tablaCarreras = document.getElementById('tablaCarreras');
    const ventanaEmergente = document.getElementById('edit-ventanaEmergente');
    const formularioEditar = document.getElementById('edit-formularioEditarCarrera');
    const cerrarVentana = document.getElementById('edit-cerrarVentana');
    let idCarreraEdicion = null;

    // Función para mostrar un mensaje de éxito o error usando alert
    const mostrarMensaje = (mensaje, tipo = 'success') => {
        alert(mensaje);
    };

    // Función para cargar las facultades en los selects
    const cargarFacultades = async () => {
        try {
            const response = await fetch('http://localhost:5000/facultades/');
            if (!response.ok) throw new Error('Error al obtener las facultades');
            const facultades = await response.json();

            const selectFacultadAgregar = document.getElementById('id_facultad_fk');
            const selectFacultadEditar = document.getElementById('edit-id_facultad_fk');

            // Limpiar los selects antes de llenarlos
            selectFacultadAgregar.innerHTML = '';
            selectFacultadEditar.innerHTML = '';

            // Llenar los selects con las facultades
            facultades.forEach(facultad => {
                const option = document.createElement('option');
                option.value = facultad.id_facultad;
                option.textContent = facultad.nombre;
                selectFacultadAgregar.appendChild(option);
                selectFacultadEditar.appendChild(option.cloneNode(true));
            });
        } catch (error) {
            mostrarMensaje(`Error: ${error.message}`, 'error');
        }
    };

    // Función para cargar las carreras
    const cargarCarreras = async () => {
        try {
            const response = await fetch('http://localhost:5000/carreras/vista');
            if (!response.ok) throw new Error('Error al obtener las carreras');
            const carreras = await response.json();

            // Limpiar la tabla antes de llenarla
            tablaCarreras.querySelector('tbody').innerHTML = '';

            carreras.forEach(carrera => {
                const row = document.createElement('tr');
                row.innerHTML = `                    
                    <td>${carrera.nombreCarrera}</td>
                    <td>${carrera.nombreFacultad}</td>
                    <td>
                        <button class="editar" data-id="${carrera.id_carrera}">Editar</button>
                        <button class="eliminar" data-id="${carrera.id_carrera}">Eliminar</button>
                    </td>
                `;
                tablaCarreras.querySelector('tbody').appendChild(row);
            });

            // Añadir eventos a los botones de editar y eliminar
            document.querySelectorAll('.editar').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    const response = await fetch(`http://localhost:5000/carreras/${id}`);
                    const carrera = await response.json();
                    
                    // Rellenar el formulario de edición
                    document.getElementById('edit-nombre').value = carrera.nombre;
                    document.getElementById('edit-id_facultad_fk').value = carrera.id_facultad_fk;
                    idCarreraEdicion = id;
                    
                    // Mostrar la ventana emergente
                    ventanaEmergente.style.display = 'block';
                });
            });

            document.querySelectorAll('.eliminar').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    try {
                        const response = await fetch(`http://localhost:5000/carreras/eliminar/${id}`, { method: 'DELETE' });
                        if (!response.ok) {
                            const error = await response.json();
                            mostrarMensaje(error.error, 'error');
                        } else {
                            mostrarMensaje('Carrera eliminada exitosamente');
                            cargarCarreras(); // Recargar las carreras
                        }
                    } catch (error) {
                        mostrarMensaje(`Error: ${error.message}`, 'error');
                    }
                });
            });

        } catch (error) {
            mostrarMensaje(`Error: ${error.message}`, 'error');
        }
    };

    // Función para agregar una nueva carrera
    const agregarCarrera = async (event) => {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const id_facultad_fk = document.getElementById('id_facultad_fk').value;

        try {
            const response = await fetch('http://localhost:5000/carreras/agregar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, id_facultad_fk })
            });
            if (!response.ok) throw new Error('Error al agregar la carrera');
            mostrarMensaje('Carrera agregada exitosamente');
            formularioAgregar.reset();
            cargarCarreras(); // Recargar las carreras
        } catch (error) {
            mostrarMensaje(`Error: ${error.message}`, 'error');
        }
    };

    // Función para actualizar una carrera
    const actualizarCarrera = async (event) => {
        event.preventDefault();
        const nombre = document.getElementById('edit-nombre').value;
        const id_facultad_fk = document.getElementById('edit-id_facultad_fk').value;

        if (idCarreraEdicion === null) {
            mostrarMensaje('ID de carrera no especificado', 'error');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/carreras/modificar/${idCarreraEdicion}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, id_facultad_fk })
            });
            if (!response.ok) throw new Error('Error al actualizar la carrera');
            mostrarMensaje('Carrera actualizada exitosamente');
            formularioEditar.reset();
            ventanaEmergente.style.display = 'none';
            cargarCarreras(); // Recargar las carreras
        } catch (error) {
            mostrarMensaje(`Error: ${error.message}`, 'error');
        }
    };

    // Cargar las facultades y las carreras al iniciar
    cargarFacultades();
    cargarCarreras();

    // Eventos
    formularioAgregar.addEventListener('submit', agregarCarrera);
    formularioEditar.addEventListener('submit', actualizarCarrera);
    cerrarVentana.addEventListener('click', () => {
        ventanaEmergente.style.display = 'none';
    });
});
