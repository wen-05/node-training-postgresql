const express = require('express')
const router = express.Router()

const skillController = require('../controllers/skillController')

router.get('/', skillController.getSkill)
router.post('/', skillController.createSkill)
router.delete('/:creditPackageId', skillController.deleteSkill)

module.exports = router