const express = require('express'); // Impordime Express.js, et luua API marsruudid
const router = express.Router(); // Loome uue Expressi marsruudiobjekti
const categoryController = require('../controllers/categoryController'); // Impordime kategooriate kontrolleri

// Marsruut kõigi kategooriate hankimiseks
router.get('/', categoryController.getAllCategories);

// Marsruut konkreetse kategooria hankimiseks ID alusel
router.get('/:id', categoryController.getCategoryById);

// Marsruut uue kategooria loomiseks
router.post('/', categoryController.createCategory);

// Marsruut olemasoleva kategooria andmete uuendamiseks
router.put('/:id', categoryController.updateCategory);

// Marsruut kategooria kustutamiseks ID alusel
router.delete('/:id', categoryController.deleteCategory);

module.exports = router; // Eksportime marsruudid, et neid saaks kasutada Expressi rakenduses
