require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Doctor = require('./models/Doctor');
const Slot = require('./models/Slot');
const Patient = require('./models/Patient');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connexion DB pour peuplement...");

    await Doctor.deleteMany({});
    await Slot.deleteMany({});
    await Patient.deleteMany({});

    const hash = await bcrypt.hash('password123', 10);

    const testPatient = new Patient({
      name: "Patient Test",
      email: "patient@test.com",
      password: hash
    });
    await testPatient.save();
    console.log("✅ Patient de test créé (patient@test.com)");

    const doctorsData = [
      { name: "Dr. Test 1111", specialty: "Généraliste", city: "Paris", email: "test1@clinique.fr", password: hash },
      { name: "Dr. Test 2222", specialty: "Dentiste", city: "Lyon", email: "test2@clinique.fr", password: hash },
      { name: "Dr. Test 3333", specialty: "Cardiologue", city: "Marseille", email: "test3@clinique.fr", password: hash },
      { name: "Dr. Test 4444", specialty: "Ophtalmologue", city: "Paris", email: "test4@clinique.fr", password: hash }
    ];

    const doctors = await Doctor.insertMany(doctorsData);
    console.log("✅ 4 médecins créés");

    const baseDate = "2026-02-16T";
    const allSlots = [];

    const timeBlocks = [
      { start: "09:00", end: "09:30" },
      { start: "09:30", end: "10:00" },
      { start: "10:00", end: "10:30" },
      { start: "10:30", end: "11:00" },
      { start: "14:00", end: "14:30" },
      { start: "14:30", end: "15:00" },
      { start: "15:00", end: "15:30" },
      { start: "15:30", end: "16:00" }
    ];

    doctors.forEach(doc => {
      timeBlocks.forEach(time => {
        allSlots.push({
          doctor: doc._id,
          startTime: new Date(`${baseDate}${time.start}:00Z`),
          endTime: new Date(`${baseDate}${time.end}:00Z`),
          isAvailable: true,
          patient: null
        });
      });
    });

    await Slot.insertMany(allSlots);
    console.log(`✅ ${allSlots.length} créneaux libres générés pour le 16/02/2026`);

    console.log("Email Patient: patient@test.com");
    console.log("Emails Doctors: test1@clinique.fr à test4@clinique.fr");
    console.log("Mot de passe unique: password123");
    
    process.exit();
  } catch (err) {
    console.error("Erreur lors du seed:", err);
    process.exit(1);
  }
};

seed();