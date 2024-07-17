document.addEventListener("DOMContentLoaded", function () {
  const baseUrl = "http://localhost:5000"; // Cambia la URL base según tu entorno

  // Función para obtener todos los usuarios y llenar la tabla
  function obtenerUsuarios() {
    fetch(`${baseUrl}/usuarios`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los usuarios");
        }
        return response.json();
      })
      .then((usuarios) => {
        const tablaUsuarios = document
          .getElementById("tablaUsuarios")
          .getElementsByTagName("tbody")[0];
        tablaUsuarios.innerHTML = ""; // Limpiar tabla

        usuarios.forEach((usuario, index) => {
          const fila = tablaUsuarios.insertRow();
          fila.innerHTML = `
                        <td>${usuario.id_usuario}</td>
                        <td>${usuario.nombre}</td>
                        <td>
                            <button class="edit-button" onclick="abrirVentanaEditar(${
                              usuario.id_usuario
                            })">Editar</button>
                            ${
                              index > 0
                                ? `<button class="delete-button" onclick="eliminarUsuario(${usuario.id_usuario})">Eliminar</button>`
                                : ""
                            }
                        </td>
                    `;
        });
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
        mostrarMensaje("Error al obtener usuarios", true);
      });
  }

  // Función para mostrar mensaje
  function mostrarMensaje(mensaje, esError = false) {
    const mensajeElement = document.getElementById("mensaje");
    mensajeElement.textContent = mensaje;
    mensajeElement.className = esError ? "error" : "success";

    setTimeout(() => {
      mensajeElement.textContent = "";
      mensajeElement.className = "";
    }, 3000);
  }

  // Función para abrir ventana emergente de edición
  window.abrirVentanaEditar = function (id_usuario) {
    fetch(`${baseUrl}/usuarios/${id_usuario}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener usuario");
        }
        return response.json();
      })
      .then((usuario) => {
        document.getElementById("edit-id_usuario").value = usuario.id_usuario;
        document.getElementById("edit-nombre").value = usuario.nombre;

        document.getElementById("edit-ventanaEmergente").style.display =
          "block";
      })
      .catch((error) => {
        console.error("Error al obtener usuario:", error);
        mostrarMensaje("Error al obtener usuario", true);
      });
  };

  // Función para cerrar la ventana emergente de edición
  document.getElementById("edit-cerrarVentana").onclick = function () {
    document.getElementById("edit-ventanaEmergente").style.display = "none";
  };

  // Evento de envío del formulario de edición
  document
    .getElementById("edit-formularioEditarUsuario")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const id_usuario = document.getElementById("edit-id_usuario").value;
      const nombre = document.getElementById("edit-nombre").value;
      const contrasenha = document.getElementById("edit-contrasenha").value;

      fetch(`${baseUrl}/usuarios/modificar/${id_usuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: nombre, contrasenha: contrasenha }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar usuario");
          }
          return response.json();
        })
        .then((data) => {
          mostrarMensaje("Usuario actualizado exitosamente");
          document.getElementById("edit-ventanaEmergente").style.display =
            "none";
          obtenerUsuarios(); // Refrescar la tabla
        })
        .catch((error) => {
          console.error("Error al actualizar usuario:", error);
          mostrarMensaje("Error al actualizar usuario", true);
        });
    });

  // Función para eliminar usuario
  window.eliminarUsuario = function (id_usuario) {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) {
      return;
    }

    fetch(`${baseUrl}/usuarios/eliminar/${id_usuario}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al eliminar usuario");
        }
        return response.json();
      })
      .then((data) => {
        mostrarMensaje("Usuario eliminado exitosamente");
        obtenerUsuarios(); // Refrescar la tabla
      })
      .catch((error) => {
        console.error("Error al eliminar usuario:", error);
        mostrarMensaje("Error al eliminar usuario", true);
      });
  };

  // Evento de envío del formulario de creación de usuario
  document
    .getElementById("postUsuarios")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const nombre = document.getElementById("nombre").value;
      const contrasenha = document.getElementById("contrasenha").value;

      fetch(`${baseUrl}/usuarios/agregar/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: nombre, contrasenha: contrasenha }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al crear usuario");
          }
          return response.json();
        })
        .then((data) => {
          mostrarMensaje("Usuario creado exitosamente");
          document.getElementById("postUsuarios").reset();
          obtenerUsuarios(); // Refrescar la tabla
        })
        .catch((error) => {
          console.error("Error al crear usuario:", error);
          mostrarMensaje("Error al crear usuario", true);
        });
    });

  // Cargar usuarios al cargar la página
  obtenerUsuarios();
});
