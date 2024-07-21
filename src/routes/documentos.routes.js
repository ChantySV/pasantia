const express = require('express')
const router = express.Router()
const controller = require('../controllers/documentos.controller')
const upload = require('../controllers/upload.controller')

router.get('/documentos', controller.get )
router.get('/documentos/vista', controller.getVista )
router.post('/documentos', upload.uploadPDF, controller.post)
router.put('/documentos/put/:id', upload.uploadPDF, controller.put)
router.delete('/documentos/delete/:id', controller.delete)
router.get('/documentos/busqueda/:query', controller.search);
module.exports = router