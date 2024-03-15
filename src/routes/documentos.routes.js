const express = require('express')
const router = express.Router()
const controller = require('../controllers/documentos.controller')
const upload = require('../controllers/upload.controller')

router.get('/documentos', controller.get )
router.post('/documentos', upload.uploadPDF, controller.post)

module.exports = router