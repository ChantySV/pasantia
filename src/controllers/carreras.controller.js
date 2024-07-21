const conexion = require("../config/databaseConexion");
const carreras = {};

// GET GENERAL
carreras.getCarreras = (req, res) => {
  let sql = "SELECT * FROM carreras";
  conexion.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener las Carreras" });
      return;
    }
    res.json(result);
  });
};

// GET CARRERAS POR FACULTAD
carreras.getCarrerasPorFacultad = (req, res) => {
  const idFacultad = req.params.id; // Obtener el parámetro de la solicitud
    
  if (!idFacultad) {
    return res.status(400).json({ error: "Se debe proporcionar el ID de la facultad" });
  }
  
  // Consulta SQL para obtener las carreras de una facultad específica
  let sql = `
   SELECT nombre AS nombreCarrera, id_carrera  
    FROM carreras 
    WHERE id_facultad_fk = ?;
  `;
  
  conexion.query(sql, [idFacultad], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener las Carreras" });
      return;
    }
    res.json(result);
  });
};

// GET CARRERA Y FACULTAD
carreras.getCarrerasFacultad = (req, res) => {
  let sql = "SELECT carreras.nombre nombreCarrera, facultades.nombre nombreFacultad FROM carreras INNER JOIN facultades ON carreras.id_facultad_fk = facultades.id_facultad;";
  conexion.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener las Carreras y Su Facultad" });
      return;
    }
    res.json(result);
  });
};

// POST CARRERAS
carreras.postCarreras = (req, res) => {
  let { nombre, id_facultad_fk } = req.body;

  // Verificar si el nombre ya está en uso
  let checkSql = "SELECT * FROM carreras WHERE nombre = ?";
  conexion.query(checkSql, [nombre], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al verificar el nombre", err });
      return;
    }
    if (result.length > 0) {
      res.status(400).json({ error: "El nombre de la carrera ya está en uso" });
      return;
    }

    // Insertar la nueva carrera
    let sql = "INSERT INTO carreras (nombre, id_facultad_fk) VALUES (?, ?)";
    conexion.query(sql, [nombre, id_facultad_fk], (err, result) => {
      if (err) {
        res.status(500).json({ error: "Error al ingresar los datos", err });
        return;
      }
      res.json(result);
    });
  });
};

// PUT CARRERAS
carreras.putCarreras = (req, res) => {
  let { nombre, id_facultad_fk } = req.body;
  let id_carrera = req.params.id;

  // Verificar si el nombre ya está en uso por otra carrera
  let checkSql = "SELECT * FROM carreras WHERE nombre = ? AND id_carrera != ?";
  conexion.query(checkSql, [nombre, id_carrera], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al verificar el nombre", err });
      return;
    }
    if (result.length > 0) {
      res.status(400).json({ error: "El nombre de la carrera ya está en uso" });
      return;
    }

    // Actualizar la carrera
    let sql = "UPDATE carreras SET nombre = ?, id_facultad_fk = ? WHERE id_carrera = ?";
    conexion.query(sql, [nombre, id_facultad_fk, id_carrera], (err, result) => {
      if (err) {
        res.status(500).json({ error: "Error al actualizar los datos", err });
        return;
      }
      res.json(result);
    });
  });
};

// DELETE CARRERAS
carreras.deleteCarreras = (req, res) => {
  let sql = "DELETE FROM carreras WHERE id_carrera = ?";
  conexion.query(sql, req.params.id, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al eliminar la facultad" });
      console.log(err);
      return;
    }
    res.json(result);
  });
};

module.exports = carreras;