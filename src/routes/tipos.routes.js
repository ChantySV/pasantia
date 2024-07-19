const express = require("express");
const router = express.Router();
const tiposController = require("../controllers/tipos.controller");

router.get("/tipos/", tiposController.getTipos);
router.post("/tipos/agregar", tiposController.postTipos);
router.put("/tipos/modificar/:id", tiposController.putTipos);
router.delete("/tipos/eliminar/:id", tiposController.deleteTipos);

module.exports = router;