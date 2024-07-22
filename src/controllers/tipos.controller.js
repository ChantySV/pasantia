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

// GET TIPO POR ID
tipos.getTipoPorId = (req, res) => {
  const idTipo = req.params.id;

  if (!idTipo) {
    return res.status(400).json({ error: "Se debe proporcionar el ID del tipo" });
  }

  let sql = "SELECT * FROM tipos WHERE id_tipo = ?";
  conexion.query(sql, [idTipo], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener el Tipo de Titulación" });
      return;
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Tipo no encontrado" });
    }
    res.json(result[0]);
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
  const idTipo = req.params.id;

  // Verificar si el tipo tiene dependencias
  let checkDependenciesSql = `
    SELECT COUNT(*) AS count
    FROM documentos
    WHERE id_tipo_fk = ?
  `;

  conexion.query(checkDependenciesSql, [idTipo], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al verificar dependencias", err });
      return;
    }

    if (result[0].count > 0) {
      return res.status(400).json({ error: "La Modalidad de Titulacion tiene dependencias y no puede ser eliminado" });
    }

    // Si no hay dependencias, proceder con la eliminación
    let sql = "DELETE FROM tipos WHERE id_tipo = ?";
    conexion.query(sql, [idTipo], (err, result) => {
      if (err) {
        res.status(500).json({ error: "Error al eliminar el Tipo de Titulación" });
        console.log(err);
        return;
      }
      res.json(result);
    });
  });
};

module.exports = tipos;