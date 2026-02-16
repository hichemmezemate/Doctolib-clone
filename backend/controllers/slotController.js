const Slot = require('../models/Slot');

exports.getAvailableSlots = async (req, res) => {
  try {
    const slots = await Slot.find({ 
      doctor: req.params.doctorId, 
      isAvailable: true, 
      startTime: { $gte: new Date() } 
    }).sort({ startTime: 1 });
    res.json(slots);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.bookSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.body.slotId);
    if (!slot || !slot.isAvailable) return res.status(400).json({ message: "Indisponible" });

    slot.patient = req.user.id;
    slot.isAvailable = false;
    await slot.save();
    res.json({ message: "RDV réservé", slot });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.cancelBooking = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.slotId);
    if (!slot) return res.status(404).json({ message: "Non trouvé" });
    
    // Seul le patient ou le docteur concerné peut annuler
    if (slot.patient?.toString() !== req.user.id && slot.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Interdit" });
    }

    slot.patient = null;
    slot.isAvailable = true;
    await slot.save();
    res.json({ message: "RDV annulé" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};