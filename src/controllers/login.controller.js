const conexion = require("../config/databaseConexion");
const bcrypt = require("bcrypt");

const login = {};

login.postVerificar = (req, res) => {
  const { nombre, contrasenha } = req.body;

  if (!nombre || !contrasenha) {
    return res
      .status(400)
      .json({ error: "Nombre de usuario y contraseña son requeridos" });
  }

  const sql = "SELECT * FROM usuarios WHERE nombre = ?";

  conexion.query(sql, [nombre], (err, results) => {
    if (err) {
      console.error("Error ejecutando la consulta:", err);
      return res.status(500).json({ error: "Error al iniciar sesión" });
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ error: "Nombre de usuario o contraseña incorrectos" });
    }

    const user = results[0];

    bcrypt.compare(contrasenha, user.contrasenha, (err, isMatch) => {
      if (err) {
        console.error("Error comparando contraseñas:", err);
        return res.status(500).json({ error: "Error al iniciar sesión" });
      }

      if (!isMatch) {
        return res
          .status(401)
          .json({ error: "Nombre de usuario o contraseña incorrectos" });
      }

      // Si las credenciales son correctas, devuelve una respuesta exitosa
      return res.status(200).json({ message: "Inicio de sesión exitoso" });
    });
  });
};

module.exports = login;