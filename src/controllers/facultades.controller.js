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

// GET FACULTAD POR ID
facultades.getFacultadPorId = (req, res) => {
  let id_facultad = req.params.id;
  let sql = "SELECT * FROM facultades WHERE id_facultad = ?";
  conexion.query(sql, [id_facultad], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener la facultad" });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ error: "Facultad no encontrada" });
      return;
    }
    res.json(result[0]);
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
  const idFacultad = req.params.id;

  // Verificar si la facultad tiene dependencias
  let checkDependenciesSql = "SELECT COUNT(*) AS count FROM carreras WHERE id_facultad_fk = ?";
  conexion.query(checkDependenciesSql, [idFacultad], (err, result) => {
      if (err) {
          res.status(500).json({ error: "Error al verificar dependencias" });
          console.log(err);
          return;
      }

      if (result[0].count > 0) {
          res.status(400).json({ error: "La facultad tiene dependencias y no puede ser eliminada" });
          return;
      }

      // Si no hay dependencias, proceder a eliminar la facultad
      let sql = "DELETE FROM facultades WHERE id_facultad = ?";
      conexion.query(sql, [idFacultad], (err, result) => {
          if (err) {
              res.status(500).json({ error: "Error al eliminar la facultad" });
              console.log(err);
              return;
          }
          res.json(result);
      });
  });
};

module.exports = facultades;