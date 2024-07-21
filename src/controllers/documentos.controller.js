const fs = require("fs");
const path = require("path");

const conexion = require("../config/databaseConexion");
const documentos = {};

function agregarUpload(data) {
  data.forEach((data) => {
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

// GET BARRA De BUSQUEDA
documentos.search = (req, res) => {
  const { query } = req.params;

  if (!query) {
    return res
      .status(400)
      .json({ error: "Debe proporcionar un término de búsqueda" });
  }

  let sql =
    "SELECT * FROM documentos WHERE titulo LIKE ? OR autor LIKE ? OR LIKE ? ";
  let params = [`%${query}%`, `%${query}%`];

  conexion.query(sql, params, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al realizar la búsqueda de documentos" });
    }
    const modifiedResult = agregarUpload(result);
    return res.json(modifiedResult);
  });
};

//POST DOCUMENTOS
documentos.post = (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No se ha subido ningún archivo" });
    //console.log(res);
    return;
  }
  let anho = parseInt(req.body.anho);
  let data = [
    req.body.titulo,
    req.body.autor,
    anho,
    req.body.sede,
    req.file.filename,
    req.body.id_tipo_fk,
    req.body.id_facultad_fk,
    req.body.id_carrera_fk,
  ];

  let sql = `INSERT INTO Documentos (titulo, autor, anho, sede, ruta_pdf, id_tipo_fk, id_facultad_fk, id_carrera_fk)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

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
    "UPDATE  Documentos SET id_tipo_fk = ?, id_facultad_fk = ?, id_carrera_fk = ?, titulo = ?, autor = ?, anho = ?, sede = ? ";

    let data = [
      req.body.id_tipo_fk,
      req.body.id_facultad_fk,
      req.body.id_carrera_fk,
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
          //console.log(err);
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
      //console.log(err);
      return;
    }
    res.json(result);
    //console.log(data);
  });
};

//DELETE
documentos.delete = (req, res) => {
  conexion.query(
    "SELECT ruta_pdf FROM documentos WHERE id_documento = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        res
          .status(500)
          .json({ error: "Error al obtener el documento existente", err });
        //console.log(err);
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
  let sql = "Delete from documentos where id_documento = ?";
  conexion.query(sql, [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al eliminar el documento" });
      //console.log(err);
      return;
    }
    res.json(result);
    //console.log(result);
  });
};

module.exports = documentos;
