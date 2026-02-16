const mongoose = require('mongoose');
const SlotSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('Slot', SlotSchema);