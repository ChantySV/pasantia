const conexion = require("../config/databaseConexion");
const facultades = {};

//GET GENERAL
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

//POST FACULTADES
facultades.postFacultades = (req, res) => {
  let data = [req.body.nombre];

  let sql = "INSERT INTO facultades (nombre) VALUES (?)";

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

//PUT FACULTADES
facultades.putFacultades = (req, res) => {
  let data = [req.body.nombre, req.params.id];
  let sql = "UPDATE  facultades SET nombre = ? WHERE id_facultad = ?";

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

//DELETE FACULTADES
facultades.deleteFacultades = (req, res) => {
  let sql = "DELETE FROM facultades WHERE id_facultad = ?";
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

module.exports = facultades;
