const express = require('express')
const router = express.Router()
const { verify } = require('../auth')
const recordController = require('../controllers/recordController.js')

router.get('/get-records', recordController.getRecords)
router.post('/create-records', verify, recordController.createRecords)
router.put('/update-records', verify, recordController.updateRecord)
router.delete('/delete-records', verify, recordController.deleteRecords)

module.exports = router