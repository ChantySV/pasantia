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

// GET CARRERA POR ID
carreras.getCarreraPorId = (req, res) => {
  const idCarrera = req.params.id; // Obtener el ID de la carrera desde los parámetros de la solicitud

  if (!idCarrera) {
      return res.status(400).json({ error: "Se debe proporcionar el ID de la carrera" });
  }

  // Consulta SQL para obtener la carrera por ID
  let sql = "SELECT * FROM carreras WHERE id_carrera = ?";
  
  conexion.query(sql, [idCarrera], (err, result) => {
      if (err) {
          res.status(500).json({ error: "Error al obtener la carrera" });
          return;
      }
      if (result.length === 0) {
          res.status(404).json({ error: "Carrera no encontrada" });
          return;
      }
      res.json(result[0]); // Enviar el primer (y único) resultado
  });
};

// GET VISTA
carreras.getCarrerasVista = (req, res) => {
  let sql = "    SELECT carreras.nombre nombreCarrera, facultades.nombre nombreFacultad, carreras.id_carrera, facultades.id_facultad FROM carreras inner join	facultades on carreras.id_facultad_fk = facultades.id_facultad";
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
// DELETE CARRERAS
carreras.deleteCarreras = (req, res) => {
  const idCarrera = req.params.id;

  if (!idCarrera) {
    return res.status(400).json({ error: "Se debe proporcionar el ID de la carrera" });
  }

  // Consulta para verificar si la carrera tiene dependencias
  let checkSql = "SELECT COUNT(*) AS cantidad FROM documentos WHERE id_carrera_fk = ?";

  conexion.query(checkSql, [idCarrera], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al verificar las dependencias" });
      return;
    }

    if (result[0].cantidad > 0) {
      return res.status(400).json({ error: "La carrera tiene dependencias y no puede ser eliminada" });
    }

    // Si no tiene dependencias, proceder a eliminar
    let sql = "DELETE FROM carreras WHERE id_carrera = ?";
    conexion.query(sql, [idCarrera], (err, result) => {
      if (err) {
        res.status(500).json({ error: "Error al eliminar la carrera" });
        return;
      }
      res.json({ message: "Carrera eliminada exitosamente" });
    });
  });
};

module.exports = carreras;