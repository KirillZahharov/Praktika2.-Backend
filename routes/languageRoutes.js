const express = require('express'); // Impordime Express.js, et luua API marsruudid
const router = express.Router(); // Loome uue Expressi marsruudiobjekti
const languageController = require('../controllers/languageController'); // Impordime keelte kontrolleri

// Marsruut kõigi keelte hankimiseks
router.get('/', languageController.getAllLanguages);

// Marsruut konkreetse keele hankimiseks ID alusel
router.get('/:id', languageController.getLanguageById);

// Marsruut uue keele loomiseks
router.post('/', languageController.createLanguage);

// Marsruut olemasoleva keele andmete uuendamiseks
router.put('/:id', languageController.updateLanguage);

// Marsruut keele kustutamiseks ID alusel
router.delete('/:id', languageController.deleteLanguage);

module.exports = router; // Eksportime marsruudid, et neid saaks kasutada Expressi rakenduses
