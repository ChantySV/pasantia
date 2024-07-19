const express = require("express");
const router = express.Router();
const carrerasController = require("../controllers/carreras.controller");

router.get("/carreras/", carrerasController.getCarreras);
router.post("/carreras/agregar", carrerasController.postCarreras);
router.put("/carreras/modificar/:id", carrerasController.putCarreras);
router.delete("/carreras/eliminar/:id", carrerasController.deleteCarreras);

module.exports = router;