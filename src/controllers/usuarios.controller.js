const conexion = require("../config/databaseConexion");
const bcrypt = require("bcrypt");

const usuarios = {};

//GET GENERAL
usuarios.getUsuarios = (req, res) => {
  let sql = "SELECT * FROM usuarios";
  conexion.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener los usuarios" });
      return;
    }
    res.json(result);
  });
};

// GET USUARIOS UNICO
usuarios.getUsuariosUnico = (req, res) => {
  const userId = req.params.id;

  const sql = "SELECT * FROM usuarios WHERE id_usuario = ?";

  conexion.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error al obtener usuario", err);
      return res.status(500).json({ error: "Error al obtener usuario" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(result[0]);
  });
};

//POST USUARIOS
usuarios.postNuevoUsario = async (req, res) => {
  const { nombre, contrasenha } = req.body;

  if (!nombre || !contrasenha) {
    return res
      .status(400)
      .json({ error: "Nombre de usuario y contraseña son requeridos" });
  }

  try {
    const checkUserQuery = "SELECT * FROM usuarios WHERE nombre = ?";
    conexion.query(checkUserQuery, [nombre], async (err, results) => {
      if (err) {
        console.error("Error al verificar nombre de usuario:", err);
        return res
          .status(500)
          .json({ error: "Error al verificar nombre de usuario", err });
      }
      if (results.length > 0) {
        return res
          .status(400)
          .json({ error: "El nombre de usuario ya está en uso" });
      }

      const hashedPassword = await bcrypt.hash(contrasenha, 10);
      const insertUserQuery =
        "INSERT INTO usuarios (nombre, contrasenha) VALUES (?, ?)";
      const data = [nombre, hashedPassword];

      conexion.query(insertUserQuery, data, (err, result) => {
        if (err) {
          console.error("Error al ingresar los datos", err);
          return res
            .status(500)
            .json({ error: "Error al ingresar los datos", err });
        }
        res
          .status(201)
          .json({ message: "Usuario creado exitosamente", result });
        console.log(data);
      });
    });
  } catch (err) {
    console.error("Error al encriptar la contraseña", err);
    res.status(500).json({ error: "Error al encriptar la contraseña", err });
  }
};

//PUT USUARIOS
usuarios.putUsuario = async (req, res) => {
  const userId = req.params.id;
  const { nombre, contrasenha } = req.body;

  if (!nombre && !contrasenha) {
    return res
      .status(400)
      .json({ error: "Se requiere al menos un campo para actualizar" });
  }

  const updates = [];
  const data = [];

  if (nombre) {
    updates.push("nombre = ?");
    data.push(nombre);
  }

  if (contrasenha) {
    const hashedPassword = await bcrypt.hash(contrasenha, 10);
    updates.push("contrasenha = ?");
    data.push(hashedPassword);
  }

  data.push(userId);

  const sql = `UPDATE usuarios SET ${updates.join(", ")} WHERE id_usuario = ?`;

  conexion.query(sql, data, (err, result) => {
    if (err) {
      console.error("Error al actualizar usuario", err);
      return res.status(500).json({ error: "Error al actualizar usuario" });
    }

    res
      .status(200)
      .json({ message: "Usuario actualizado exitosamente", result });
  });
};

//DELETE  USUARIOS
usuarios.deleteUsuario = (req, res) => {
  const userId = req.params.id;

  const sql = "DELETE FROM usuarios WHERE id_usuario = ?";

  conexion.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error al eliminar usuario", err);
      return res.status(500).json({ error: "Error al eliminar usuario" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  });
};

module.exports = usuarios;