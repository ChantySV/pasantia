    document.addEventListener('DOMContentLoaded', function() {
    const postUsuariosForm = document.getElementById('postUsuarios');
    const editFormulario = document.getElementById('edit-formularioEditarUsuario');
    const tablaUsuarios = document.getElementById('tablaUsuarios').querySelector('tbody');
    const mensaje = document.getElementById('mensaje');
    const editVentanaEmergente = document.getElementById('edit-ventanaEmergente');
    const editCerrarVentana = document.getElementById('edit-cerrarVentana');

    obtenerUsuarios();

    postUsuariosForm.addEventListener('submit', enviarFormularioAgregar);
    editFormulario.addEventListener('submit', enviarFormularioEditar);
    editCerrarVentana.addEventListener('click', function() {
        editVentanaEmergente.style.display = 'none';
    });

    function manejarError(error, accion) {
        console.error(`Error al ${accion}: `, error);
        mensaje.textContent = `Error al ${accion}`;
        mensaje.classList.remove('success');
        mensaje.classList.add('error');
        setTimeout(() => {
            mensaje.textContent = '';
            mensaje.classList.remove('error');
        }, 3000);
    }

    function obtenerUsuarios() {
        fetch('http://localhost:5000/usuarios')
            .then(response => response.json())
            .then(data => {
                tablaUsuarios.innerHTML = '';
                data.forEach((usuario, index) => {
                    const fila = document.createElement('tr');
                    let eliminarBoton = ''; // Variable para el botón de eliminación
    
                    if (index !== 0) {
                        eliminarBoton = `<button class="eliminar" data-id="${usuario.id_usuario}">Eliminar</button>`;
                    }
    
                    fila.innerHTML = `
                        <td>${usuario.nombre}</td>
                        <td>
                            <button class="editar" data-id="${usuario.id_usuario}">Editar</button>
                            ${eliminarBoton}
                        </td>
                    `;
                    tablaUsuarios.appendChild(fila);
                });
    
                document.querySelectorAll('.editar').forEach(boton => {
                    boton.addEventListener('click', mostrarVentanaEdicion);
                });
                document.querySelectorAll('.eliminar').forEach(boton => {
                    boton.addEventListener('click', eliminarUsuario);
                });
            })
            .catch(error => manejarError(error, 'obtener los usuarios'));
    }

    function enviarFormularioAgregar(event) {
        event.preventDefault();

        const formData = {
            nombre: postUsuariosForm.nombre.value,
            contrasenha: postUsuariosForm.contrasenha.value
        };

        fetch('http://localhost:5000/usuarios/agregar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al agregar el usuario');
            }
            return response.json();
        })
        .then(result => {
            mensaje.textContent = 'Usuario agregado exitosamente';
            mensaje.classList.remove('error');
            mensaje.classList.add('success');
            postUsuariosForm.reset();
            obtenerUsuarios();
        })
        .catch(error => manejarError(error, 'agregar el usuario'));
    }

    function mostrarVentanaEdicion(event) {
        const userId = event.target.getAttribute('data-id');

        fetch(`http://localhost:5000/usuarios/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del usuario');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('edit-id_usuario').value = data.id_usuario;
                document.getElementById('edit-nombre').value = data.nombre;
                document.getElementById('edit-contrasenha').value;
                editVentanaEmergente.style.display = 'block';
            })
            .catch(error => manejarError(error, 'obtener los datos del usuario'));
    }

    function enviarFormularioEditar(event) {
        event.preventDefault();

        const formData = {
            nombre: editFormulario['edit-nombre'].value,
            contrasenha: editFormulario['edit-contrasenha'].value
        };
        const userId = document.getElementById('edit-id_usuario').value;

        fetch(`http://localhost:5000/usuarios/modificar/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el usuario');
            }
            return response.json();
        })
        .then(result => {
            mensaje.textContent = 'Usuario actualizado exitosamente';
            mensaje.classList.remove('error');
            mensaje.classList.add('success');
            editVentanaEmergente.style.display = 'none';
            obtenerUsuarios();
        })
        .catch(error => manejarError(error, 'actualizar el usuario'));
    }

    function eliminarUsuario(event) {
        const userId = event.target.getAttribute('data-id');

        fetch(`http://localhost:5000/usuarios/eliminar/${userId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }
            return response.json();
        })
        .then(result => {
            mensaje.textContent = 'Usuario eliminado exitosamente';
            mensaje.classList.remove('error');
            mensaje.classList.add('success');
            obtenerUsuarios();
        })
        .catch(error => manejarError(error, 'eliminar el usuario'));
    }
    });
