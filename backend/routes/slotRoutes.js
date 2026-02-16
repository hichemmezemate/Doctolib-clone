const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const auth = require('../middleware/auth');

router.get('/available/:doctorId', auth, slotController.getAvailableSlots);
router.post('/book', auth, slotController.bookSlot);
router.put('/cancel/:slotId', auth, slotController.cancelBooking);

module.exports = router;