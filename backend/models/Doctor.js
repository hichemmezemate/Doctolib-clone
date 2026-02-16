const mongoose = require('mongoose');
const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: true },
  city: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Doctor', DoctorSchema);