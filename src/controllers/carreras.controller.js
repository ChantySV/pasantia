const conexion = require("../config/databaseConexion");
const carreras = {};

//GET GENERAL
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

//POST CARRERAS
carreras.postCarreras = (req, res) => {
  let data = [req.body.nombre ,req.body.id_facultad_fk];

  let sql = "INSERT INTO carreras (nombre, id_facultad_fk) VALUES (?, ?)";

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
carreras.putCarreras = (req, res) => {
  let data = [req.body.nombre, req.body.id_facultad_fk, req.params.id];
  let sql = "UPDATE  carreras SET nombre = ?, id_facultad_fk = ? WHERE id_carrera = ?";

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
carreras.deleteCarreras = (req, res) => {
  let sql = "DELETE FROM carreras WHERE id_carrera = ?";
  conexion.query(sql, req.params.id, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error al eliminar la facultad" });
      console.log(err);
      return;
    }
    res.json(result);
    //console.log(result);
  });
};

module.exports = carreras;