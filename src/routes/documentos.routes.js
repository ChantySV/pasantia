const express = require('express')
const router = express.Router()
const controller = require('../controllers/documentos.controller')
const upload = require('../controllers/upload.controller')

router.get('/documentos', controller.get )
router.post('/documentos', upload.uploadPDF, controller.post)
router.get('/documentos/carrera/:carrera', controller.getCarrera)
router.get('/documentos/tipo/:tipo', controller.getTipo)
router.get('/documentos/sede/:sede', controller.getSede)

module.exports = router