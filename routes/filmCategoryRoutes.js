const express = require('express'); // Impordime Express.js, et luua API marsruudid
const router = express.Router(); // Loome uue Expressi marsruudiobjekti
const filmCategoryController = require('../controllers/filmCategoryController'); // Impordime filmide ja kategooriate vahelise seose kontrolleri

// Marsruut kõigi kategooriate hankimiseks konkreetse filmi ID alusel
router.get('/film/:film_id', filmCategoryController.getCategoriesByFilm);

// Marsruut kõigi filmide hankimiseks konkreetse kategooria ID alusel
router.get('/category/:category_id', filmCategoryController.getFilmsByCategory);

// Marsruut kategooria lisamiseks filmile
router.post('/', filmCategoryController.addCategoryToFilm);

// Marsruut kategooria eemaldamiseks filmist
router.delete('/', filmCategoryController.removeCategoryFromFilm);

module.exports = router; // Eksportime marsruudid, et neid saaks kasutada Expressi rakenduses
