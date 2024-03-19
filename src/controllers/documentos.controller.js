const conexion = require("../config/database");
const documentos = {};
//ADD UPLOAD
function agregarUpload(data){
  data.forEach(data => {
    // Ejemplo de modificación: Agregar una propiedad "status" a cada objeto
    data.ruta_pdf = "/uploads/"+ data.ruta_pdf;      
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
documentos.getCarrera =(req, res) =>{
  let sql = "Select * from documentos where carrera = ?"
  conexion.query(sql, [req.params.carrera], (err ,result) =>{
    if (err) {
      res.status(500).json({ error: "Error al obtener los documentos" });
      console.log(err);
      return;
    }
    agregarUpload(result);
    res.json(result);
    //console.log(result);    
  })
}

//GET TIPO
documentos.getTipo =(req, res) =>{
  let sql = "Select * from documentos where tipo = ?"
  conexion.query(sql, [req.params.tipo], (err ,result) =>{
    if (err) {
      res.status(500).json({ error: "Error al obtener los documentos por tipo" });
      console.log(err);
      return;
    }
    agregarUpload(result);
    res.json(result);
    //console.log(result);
  })
}

//GET SEDE
documentos.getSede =(req, res) =>{
  let sql = "Select * from documentos where sede = ?"
  conexion.query(sql, [req.params.sede], (err ,result) =>{
    if (err) {
      res.status(500).json({ error: "Error al obtener los documentos por sede = ?" });
      console.log(err);
      return;
    }
    agregarUpload(result);
    res.json(result);
    //console.log(result);
  })
}


//POST DOCUMENTOS
documentos.post = (req, res) => {
  if (!req.file) {
      res.status(400).json({ error: "No se ha subido ningún archivo" });
      console.log(res);
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
      req.file.originalname 
  ];

  let sql = "INSERT INTO Documentos (tipo, facultad, carrera, titulo, autor, año, sede, ruta_pdf) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

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
documentos.post = (req, res) => {
  if (!req.file) {
      res.status(400).json({ error: "No se ha subido ningún archivo" });
      console.log(res);
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
      req.file.originalname 
  ];

  let sql = "INSERT INTO Documentos (tipo, facultad, carrera, titulo, autor, año, sede, ruta_pdf) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

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


module.exports = documentos;
