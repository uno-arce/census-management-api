const express = require('express')
const router = express.Router()
const { verify } = require('../auth')
const recordController = require('../controllers/recordController.js')

router.get('/get-records', verify, recordController.getRecords)
router.get('/get-total-records', verify, recordController.getTotalRecords)
router.post('/create-records', verify, recordController.createRecords)
router.put('/update-record/:recordId', verify, recordController.updateRecord)
router.put('/delete-records', verify, recordController.deleteRecords)

module.exports = router