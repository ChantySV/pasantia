const conexion = require("../config/database");
const documentos = {};

documentos.get = (req, res) => {
  let sql = "SELECT * FROM documentos";
  conexion.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener los documentos" });
      return;
    }
    res.json(result);
  });
};
documentos.post = (req, res) => {
  if (!req.file) {
      res.status(400).json({ error: "No se ha subido ningún archivo" });
      return;
  }
  let año = parseInt(req.body.anho);
  let data = [
      req.body.tipo,
      req.body.facultad,
      req.body.carrera,
      req.body.titulo,
      req.body.autor,
      año, 
      req.body.sede,
      req.file.path
  ];

  let sql = "INSERT INTO Documentos (tipo, facultad, carrera, titulo, autor, año, sede, ruta_pdf) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  conexion.query(sql, data, (err, result) => {
      if (err) {
          res.status(500).json({ error: "Error al ingresar los datos", err });
          return;
      }
      res.json(result);
      console.log(data);
  });
};
// documentos.postSelectCarrera =(req, res) =>{
//   if (!req.file) {
//     res.status(400).json({ error: "No se recibio la peticion de orden por carrera" });
//     return;
//   }

// }
module.exports = documentos;