require('dotenv').config(); // Laadime keskkonnamuutujad .env failist

const express = require('express'); // Impordime Express.js, et luua server ja API marsruudid
const app = express(); // Loome Expressi rakenduse instantsi

// Impordime API marsruudid erinevate ressursside jaoks
const categoryRoutes = require('./routes/categoryRoutes'); // Kategooriad
const actorRoutes = require('./routes/actorRoutes'); // Näitlejad
const filmRoutes = require('./routes/filmRoutes'); // Filmid
const filmActorRoutes = require('./routes/filmActorRoutes'); // Filmide ja näitlejate vahelised seosed
const filmCategoryRoutes = require('./routes/filmCategoryRoutes'); // Filmide ja kategooriate vahelised seosed
const languageRoutes = require('./routes/languageRoutes'); // Keeled
const authRoutes = require('./routes/authRoutes'); // Autentimine (registreerimine ja sisselogimine)

app.use(express.json()); // Lubame JSON-keha parsimise päringutes (req.body)

// API Marsruudid (määrame, millistel URL-idel töötavad erinevad marsruudid)
app.use('/api/categories', categoryRoutes); // Kategooriad
app.use('/api/actors', actorRoutes); // Näitlejad
app.use('/api/films', filmRoutes); // Filmid
app.use('/api/film-actors', filmActorRoutes); // Filmide ja näitlejate seosed
app.use('/api/film-categories', filmCategoryRoutes); // Filmide ja kategooriate seosed
app.use('/api/languages', languageRoutes); // Keeled
app.use('/api/auth', authRoutes); // Autentimine (registreerimine/sisselogimine)

// Serveri käivitamine määratud pordil
const PORT = process.env.PORT || 3000; // Laeme pordi .env failist või kasutame vaikimisi 3000
app.listen(PORT, () => {
    console.log(`Server töötab aadressil: http://localhost:${PORT}`); // Logime serveri käivitamise teate
});
