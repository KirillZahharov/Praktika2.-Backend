const express = require('express'); // Impordime Express.js, et luua API marsruudid
const router = express.Router(); // Loome uue Expressi marsruudiobjekti
const filmController = require('../controllers/filmController'); // Impordime filmide kontrolleri
const authMiddleware = require('../middleware/authMiddleware'); // Impordime autentimise keskkihi (middleware)

// Avalikud marsruudid (kõigile kasutajatele kättesaadavad)
router.get('/', filmController.getAllFilms); // Kõigi filmide hankimine
router.get('/:id', filmController.getFilmById); // Ühe filmi hankimine ID järgi

// Kaitstud marsruudid (vajavad JWT tokenit)
router.post('/', authMiddleware, filmController.createFilm); // Uue filmi loomine (vajab autentimist)
router.put('/:id', authMiddleware, filmController.updateFilm); // Filmi andmete uuendamine (vajab autentimist)
router.delete('/:id', authMiddleware, filmController.deleteFilm); // Filmi kustutamine (vajab autentimist)

// Avalikud otsingufunktsioonid (kõigile kättesaadavad)
router.get('/search/title', filmController.searchFilmByTitle); // Otsing pealkirja järgi
router.get('/search/actor', filmController.searchFilmByActor); // Otsing näitleja järgi
router.get('/search/language', filmController.searchFilmByLanguage); // Otsing keele järgi
router.get('/search/category', filmController.searchFilmByCategory); // Otsing kategooria järgi

module.exports = router; // Eksportime marsruudid, et neid saaks kasutada Expressi rakenduses
