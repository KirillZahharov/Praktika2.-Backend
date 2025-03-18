const express = require('express'); // Impordime Express.js, et luua API marsruudid
const router = express.Router(); // Loome uue Expressi marsruudiobjekti
const filmActorController = require('../controllers/filmActorController'); // Impordime filmide ja näitlejate vahelise seose kontrolleri

// Marsruut kõigi näitlejate hankimiseks konkreetse filmi ID alusel
router.get('/film/:film_id', filmActorController.getActorsByFilm);

// Marsruut kõigi filmide hankimiseks konkreetse näitleja ID alusel
router.get('/actor/:actor_id', filmActorController.getFilmsByActor);

module.exports = router; // Eksportime marsruudid, et neid saaks kasutada Expressi rakenduses
