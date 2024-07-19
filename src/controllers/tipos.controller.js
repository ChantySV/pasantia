const conexion = require("../config/databaseConexion");
const tipos = {};

//GET GENERAL
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

//POST CARRERAS
tipos.postTipos = (req, res) => {
  let data = [req.body.nombre];

  let sql = "INSERT INTO tipos (nombre) VALUES (?)";

  conexion.query(sql, data, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al ingresar los datos", err });
      //console.log(err);
      return;
    }
    res.json(result);
    //console.log(data);
  });
};

//PUT CARRERAS
tipos.putTipos = (req, res) => {
  let data = [req.body.nombre, req.params.id];
  let sql = "UPDATE tipos SET nombre = ?  WHERE id_tipo = ?";

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

//DELETE CARRERAS
tipos.deleteTipos = (req, res) => {
  let sql = "DELETE FROM tipos WHERE id_tipo = ?";
  conexion.query(sql, req.params.id, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al eliminar el Tipo de Titulacion" });
      console.log(err);
      return;
    }
    res.json(result);
    //console.log(result);
  });
};

module.exports = tipos;