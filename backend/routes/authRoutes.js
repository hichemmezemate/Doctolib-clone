const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register/patient', authController.registerPatient);
router.post('/register/doctor', authController.registerDoctor);
router.post('/login', authController.login);
router.get('/doctors', auth, authController.getDoctors);

module.exports = router;