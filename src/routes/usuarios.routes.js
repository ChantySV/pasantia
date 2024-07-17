const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");

router.get("/usuarios/", usuariosController.getUsuarios);
router.get("/usuarios/:id", usuariosController.getUsuariosUnico);
router.post("/usuarios/agregar", usuariosController.postNuevoUsario);
router.put("/usuarios/modificar/:id", usuariosController.putUsuario);
router.delete("/usuarios/eliminar/:id", usuariosController.deleteUsuario);

module.exports = router;
