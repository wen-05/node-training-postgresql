const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController')

router.post('/courses', adminController.createCourse)
router.put('/courses/:courseId', adminController.editCourse)
router.post('/:userId', adminController.changeRole)

module.exports = router