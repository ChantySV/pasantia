const express = require("express");
const router = express.Router();
const facultadesController = require("../controllers/facultades.controller");

router.get("/facultades/", facultadesController.getFacultades);
router.post("/facultades/agregar", facultadesController.postFacultades);
router.put("/facultades/modificar/:id", facultadesController.putFacultades);
router.delete("/facultades/eliminar/:id", facultadesController.deleteFacultades);

module.exports = router;