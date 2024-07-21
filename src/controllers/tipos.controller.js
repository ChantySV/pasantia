const conexion = require("../config/databaseConexion");
const tipos = {};

// GET GENERAL
tipos.getTipos = (req, res) => {
  let sql = "SELECT * FROM tipos";
  conexion.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener los Tipos de Titulacion" });
      return;
    }
    res.json(result);
  });
};

// POST TIPOS
tipos.postTipos = (req, res) => {
  let { nombre } = req.body;

  // Verificar si el nombre ya está en uso
  let checkSql = "SELECT * FROM tipos WHERE nombre = ?";
  conexion.query(checkSql, [nombre], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al verificar el nombre", err });
      return;
    }
    if (result.length > 0) {
      res.status(400).json({ error: "El nombre del tipo de titulación ya está en uso" });
      return;
    }

    // Insertar el nuevo tipo de titulación
    let sql = "INSERT INTO tipos (nombre) VALUES (?)";
    conexion.query(sql, [nombre], (err, result) => {
      if (err) {
        res.status(500).json({ error: "Error al ingresar los datos", err });
        return;
      }
      res.json(result);
    });
  });
};

// PUT TIPOS
tipos.putTipos = (req, res) => {
  let { nombre } = req.body;
  let id_tipo = req.params.id;

  // Verificar si el nombre ya está en uso por otro tipo de titulación
  let checkSql = "SELECT * FROM tipos WHERE nombre = ? AND id_tipo != ?";
  conexion.query(checkSql, [nombre, id_tipo], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al verificar el nombre", err });
      return;
    }
    if (result.length > 0) {
      res.status(400).json({ error: "El nombre del tipo de titulación ya está en uso" });
      return;
    }

    // Actualizar el tipo de titulación
    let sql = "UPDATE tipos SET nombre = ? WHERE id_tipo = ?";
    conexion.query(sql, [nombre, id_tipo], (err, result) => {
      if (err) {
        res.status(500).json({ error: "Error al actualizar los datos", err });
        return;
      }
      res.json(result);
    });
  });
};

// DELETE TIPOS
tipos.deleteTipos = (req, res) => {
  let sql = "DELETE FROM tipos WHERE id_tipo = ?";
  conexion.query(sql, req.params.id, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al eliminar el Tipo de Titulacion" });
      console.log(err);
      return;
    }
    res.json(result);
  });
};

module.exports = tipos;