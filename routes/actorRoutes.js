const express = require('express'); // Impordime Express.js, et luua API marsruudid
const router = express.Router(); // Loome uue Expressi marsruudiobjekti
const actorController = require('../controllers/actorController'); // Impordime näitlejate kontrolleri

// Marsruut kõigi näitlejate hankimiseks
router.get('/', actorController.getAllActors);

// Marsruut konkreetse näitleja hankimiseks ID alusel
router.get('/:id', actorController.getActorById);

// Marsruut uue näitleja loomiseks
router.post('/', actorController.createActor);

// Marsruut olemasoleva näitleja andmete uuendamiseks
router.put('/:id', actorController.updateActor);

// Marsruut näitleja kustutamiseks ID alusel
router.delete('/:id', actorController.deleteActor);

module.exports = router; // Eksportime marsruudid, et neid saaks kasutada Expressi rakenduses
