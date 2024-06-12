const fs = require("fs");
const path = require("path");

const conexion = require("../config/databaseConexion");
const documentos = {};

function agregarUpload(data) {
  data.forEach((data) => {
    // Ejemplo de modificación: Agregar una propiedad "status" a cada objeto
    data.ruta_pdf = "/uploads/" + data.ruta_pdf;
  });
  return data;
}

//GET GENERAL
documentos.get = (req, res) => {
  let sql = "SELECT * FROM documentos";
  conexion.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener los documentos" });
      return;
    }
    agregarUpload(result);
    res.json(result);
  });
};

//GET CARRERA
documentos.getCarrera = (req, res) => {
  let sql = "Select * from documentos where carrera = ?";
  conexion.query(sql, [req.params.carrera], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener los documentos" });
      console.log(err);
      return;
    }
    agregarUpload(result);
    res.json(result);
    //console.log(result);
  });
};

//GET TIPO
documentos.getTipo = (req, res) => {
  let sql = "Select * from documentos where tipo = ?";
  conexion.query(sql, [req.params.tipo], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error al obtener los documentos por tipo" });
      console.log(err);
      return;
    }
    agregarUpload(result);
    res.json(result);
    //console.log(result);
  });
};

//GET SEDE
documentos.getSede = (req, res) => {
  let sql = "Select * from documentos where sede = ?";
  conexion.query(sql, [req.params.sede], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error al obtener los documentos por sede = ?" });
      console.log(err);
      return;
    }
    agregarUpload(result);
    res.json(result);
    //console.log(result);
  });
};

//POST DOCUMENTOS
documentos.post = (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No se ha subido ningún archivo" });
    console.log(res);
    return;
  }
  let anho = parseInt(req.body.anho);
  let data = [
    req.body.tipo,
    req.body.facultad,
    req.body.carrera,
    req.body.titulo,
    req.body.autor,
    anho,
    req.body.sede,
    req.file.filename,
  ];

  let sql =
    "INSERT INTO Documentos (tipo, facultad, carrera, titulo, autor, anho, sede, ruta_pdf) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  conexion.query(sql, data, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al ingresar los datos", err });
      console.log(err);
      return;
    }
    res.json(result);
    console.log(data);
  });
};

//PUT DOCUMENTOS
documentos.put = (req, res) => {
  let anho = parseInt(req.body.anho);
  let sql =
    "UPDATE  Documentos SET tipo = ?, facultad = ?, carrera = ?, titulo = ?, autor = ?, anho = ?, sede = ? ";

  let data = [
    req.body.tipo,
    req.body.facultad,
    req.body.carrera,
    req.body.titulo,
    req.body.autor,
    anho,
    req.body.sede,
  ];

  // Agregar la ruta del PDF solo si se envió un archivo adjunto
  if (req.file) {
    sql += ", ruta_pdf = ?";
    data.push(req.file.filename);

    conexion.query(
      "SELECT ruta_pdf FROM documentos WHERE id_documento = ?",
      [req.params.id],
      (err, result) => {
        if (err) {
          res
            .status(500)
            .json({ error: "Error al obtener el documento existente", err });
          console.log(err);
          return;
        }

        if (result && result.length > 0 && result[0].ruta_pdf) {
          let rutaPDFExistente = path.join(
            __dirname,
            "..",
            "..",
            "uploads",
            result[0].ruta_pdf
          );
          fs.unlink(rutaPDFExistente, (err) => {
            if (err) {
              console.log("Error al eliminar el archivo PDF existente", err);
            } else {
              console.log("Archivo PDF existente eliminado con éxito");
            }
          });
        }
      }
    );
  }
  data.push(req.params.id);
  sql += "WHERE id_documento = ?";

  conexion.query(sql, data, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al actualizar los datos", err });
      console.log(err);
      return;
    }
    res.json(result);
    //console.log(data);
  });
};

//DELETE
documentos.delete = (req, res) => {  
    conexion.query("SELECT ruta_pdf FROM documentos WHERE id_documento = ?",
      [req.params.id_del],
      (err, result) => {
        if (err) {
          res.status(500).json({ error: "Error al obtener el documento existente", err });
          console.log(err);
          return;
        }

        if (result && result.length > 0 && result[0].ruta_pdf) {
          let rutaPDFExistente = path.join(
            __dirname,
            "..",
            "..",
            "uploads",
            result[0].ruta_pdf
          );
          fs.unlink(rutaPDFExistente, (err) => {
            if (err) {
              console.log("Error al eliminar el archivo PDF existente", err);
            } else {
              console.log("Archivo PDF existente eliminado con éxito");
            }
          });
        }
      }
    );
  let sql = "Delete  from documentos where id_documento = ?";
  conexion.query(sql, [req.params.id_del], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al eliminar el documento" });
      console.log(err);
      return;
    }    
    res.json(result)
    //console.log(result);
  });
};

module.exports = documentos;