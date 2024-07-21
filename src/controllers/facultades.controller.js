const conexion = require("../config/databaseConexion");
const facultades = {};

// GET GENERAL
facultades.getFacultades = (req, res) => {
  let sql = "SELECT * FROM facultades";
  conexion.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener las Facultades" });
      return;
    }
    res.json(result);
  });
};

// POST FACULTADES
facultades.postFacultades = (req, res) => {
  let { nombre } = req.body;

  // Verificar si el nombre ya está en uso
  let checkSql = "SELECT * FROM facultades WHERE nombre = ?";
  conexion.query(checkSql, [nombre], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al verificar el nombre", err });
      return;
    }
    if (result.length > 0) {
      res.status(400).json({ error: "El nombre de la facultad ya está en uso" });
      return;
    }

    // Insertar la nueva facultad
    let sql = "INSERT INTO facultades (nombre) VALUES (?)";
    conexion.query(sql, [nombre], (err, result) => {
      if (err) {
        res.status(500).json({ error: "Error al ingresar los datos", err });
        return;
      }
      res.json(result);
    });
  });
};

// PUT FACULTADES
facultades.putFacultades = (req, res) => {
  let { nombre } = req.body;
  let id_facultad = req.params.id;

  // Verificar si el nombre ya está en uso por otra facultad
  let checkSql = "SELECT * FROM facultades WHERE nombre = ? AND id_facultad != ?";
  conexion.query(checkSql, [nombre, id_facultad], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al verificar el nombre", err });
      return;
    }
    if (result.length > 0) {
      res.status(400).json({ error: "El nombre de la facultad ya está en uso" });
      return;
    }

    // Actualizar la facultad
    let sql = "UPDATE facultades SET nombre = ? WHERE id_facultad = ?";
    conexion.query(sql, [nombre, id_facultad], (err, result) => {
      if (err) {
        res.status(500).json({ error: "Error al actualizar los datos", err });
        return;
      }
      res.json(result);
    });
  });
};

// DELETE FACULTADES
facultades.deleteFacultades = (req, res) => {
  let sql = "DELETE FROM facultades WHERE id_facultad = ?";
  conexion.query(sql, req.params.id, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al eliminar la facultad" });
      console.log(err);
      return;
    }
    res.json(result);
  });
};

module.exports = facultades;