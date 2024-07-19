const express = require('express')
const router = express.Router()
const controller = require('../controllers/documentos.controller2')
const upload = require('../controllers/upload.controller')

router.get('/documentos2', controller.get )
router.post('/documentos2', upload.uploadPDF, controller.post)
router.put('/documentos2/put/:id', upload.uploadPDF, controller.put)
router.delete('/documentos2/delete/:id_del', controller.delete)
router.get('/documentos2/busqueda/:query', controller.search);
module.exports = router