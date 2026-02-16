const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerPatient = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const patient = new Patient({ name, email, password: hashedPassword });
    await patient.save();
    res.status(201).json({ message: "Compte Patient créé" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialty, city } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = new Doctor({ name, email, password: hashedPassword, specialty, city });
    await doctor.save();
    res.status(201).json({ message: "Compte Docteur créé" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await Patient.findOne({ email });
    let role = 'patient';
    if (!user) { user = await Doctor.findOne({ email }); role = 'doctor'; }
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { res.status(500).json({ error: "Erreur Login" }); }
};

exports.getDoctors = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = city ? { city: new RegExp(city, 'i') } : {};
    const doctors = await Doctor.find(filter).select('-password');
    res.json(doctors);
  } catch (err) { res.status(500).json({ error: "Erreur récupération docteurs" }); }
};