const express = require('express'); // Impordime Express.js, et luua API marsruudid
const router = express.Router(); // Loome uue Expressi marsruudiobjekti
const authController = require('../controllers/authController'); // Impordime autentimise kontrolleri

// Marsruut uue kasutaja registreerimiseks
router.post('/register', authController.register);

// Marsruut kasutaja sisselogimiseks
router.post('/login', authController.login);

module.exports = router; // Eksportime marsruudid, et neid saaks kasutada Expressi rakenduses
