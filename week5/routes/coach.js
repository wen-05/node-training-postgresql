const express = require('express')
const router = express.Router()

const coachController = require('../controllers/coachController')

router.get('/', coachController.getList)
router.get('/:coachId', coachController.detail)

module.exports = router