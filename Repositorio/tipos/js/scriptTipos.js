// scriptTipos.js

document.addEventListener('DOMContentLoaded', () => {
    const formularioAgregar = document.getElementById('postTipos');
    const tablaTipos = document.getElementById('tablaTipos');
    const ventanaEmergente = document.getElementById('edit-ventanaEmergente');
    const formularioEditar = document.getElementById('edit-formularioEditarTipo');
    const cerrarVentana = document.getElementById('edit-cerrarVentana');
    let idTipoEdicion = null;

    // Función para mostrar un mensaje de éxito o error
    const mostrarMensaje = (mensaje) => {
        alert(mensaje);
    };

    // Función para cargar los tipos
    const cargarTipos = async () => {
        try {
            const response = await fetch('http://localhost:5000/tipos/');
            if (!response.ok) throw new Error('Error al obtener los tipos');
            const tipos = await response.json();

            // Limpiar la tabla antes de llenarla
            tablaTipos.querySelector('tbody').innerHTML = '';

            tipos.forEach(tipo => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${tipo.nombre}</td>
                    <td>
                        <button class="editar" data-id="${tipo.id_tipo}">Editar</button>
                        <button class="eliminar" data-id="${tipo.id_tipo}">Eliminar</button>
                    </td>
                `;
                tablaTipos.querySelector('tbody').appendChild(row);
            });

            // Añadir eventos a los botones de editar y eliminar
            document.querySelectorAll('.editar').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    const response = await fetch(`http://localhost:5000/tipos/${id}`);
                    const tipo = await response.json();
                    
                    // Rellenar el formulario de edición
                    document.getElementById('edit-nombre').value = tipo.nombre;
                    idTipoEdicion = id;
                    
                    // Mostrar la ventana emergente
                    ventanaEmergente.style.display = 'block';
                });
            });

            document.querySelectorAll('.eliminar').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('¿Estás seguro de que quieres eliminar este tipo?')) {
                        try {
                            const response = await fetch(`http://localhost:5000/tipos/eliminar/${id}`, { method: 'DELETE' });
                            if (!response.ok) {
                                const error = await response.json();
                                alert(error.error || 'Error al eliminar el tipo');
                                return;
                            }
                            mostrarMensaje('Tipo eliminado exitosamente');
                            cargarTipos(); // Recargar los tipos
                        } catch (error) {
                            mostrarMensaje(`Error: ${error.message}`);
                        }
                    }
                });
            });

        } catch (error) {
            mostrarMensaje(`Error: ${error.message}`);
        }
    };

    // Cargar tipos al inicio
    cargarTipos();

    // Manejar la creación de tipos
    formularioAgregar.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;

        try {
            const response = await fetch('http://localhost:5000/tipos/agregar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre })
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error.error || 'Error al agregar el tipo');
                return;
            }

            mostrarMensaje('Tipo agregado exitosamente');
            formularioAgregar.reset();
            cargarTipos(); // Recargar los tipos

        } catch (error) {
            mostrarMensaje(`Error: ${error.message}`);
        }
    });

    // Manejar la edición de tipos
    formularioEditar.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('edit-nombre').value;

        try {
            const response = await fetch(`http://localhost:5000/tipos/modificar/${idTipoEdicion}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre })
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error.error || 'Error al actualizar el tipo');
                return;
            }

            mostrarMensaje('Tipo actualizado exitosamente');
            ventanaEmergente.style.display = 'none';
            cargarTipos(); // Recargar los tipos

        } catch (error) {
            mostrarMensaje(`Error: ${error.message}`);
        }
    });

    // Cerrar ventana emergente
    cerrarVentana.addEventListener('click', () => {
        ventanaEmergente.style.display = 'none';
    });
});