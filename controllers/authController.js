const bcrypt = require('bcryptjs'); // Impordime bcrypt.js, et räsida paroole
const jwt = require('jsonwebtoken'); // Impordime jsonwebtoken, et luua JWT autentimistoken
const { body, validationResult } = require('express-validator'); // Impordime express-validator andmete valideerimiseks
const { user } = require('../models/init-models')(require('../config/database')); // Impordime andmebaasiühenduse ja kasutaja mudeli

const JWT_SECRET = "awoken"; // JWT jaoks salajane võti (soovitav kasutada .env failis)

// Kasutaja registreerimine
exports.register = async (req, res) => {
    try {
        //  Sisendi valiseerimine
        await body('email').isEmail().normalizeEmail().run(req); // Kontrollib, kas e-post on kehtiv ja normaliseerib selle
        await body('password').isLength({ min: 6 }).run(req); // Kontrollib, kas parool on vähemalt 6 tähemärki pikk

        const errors = validationResult(req); // Kogub valideerimisvead
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() }); // Kui on vigu, saadab veateate

        const { email, password } = req.body; // Võtab e-posti ja parooli päringu kehast

        //  Kontrollib, kas kasutaja juba eksisteerib
        const existingUser = await user.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Email on juba kasutusel" });

        //  Parooli räsimine enne salvestamist
        const hashedPassword = await bcrypt.hash(password, 10);

        //  Loome uue kasutaja andmebaasi
        const newUser = await user.create({ email, password: hashedPassword });

        res.status(201).json({ message: "Kasutaja registreeriti edukalt", userId: newUser.id });
    } catch (err) {
        res.status(500).json({ error: err.message }); // Serveri vea korral saadab 500 veateate
    }
};

//  Kasutaja sisselogimine
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; // Võtab e-posti ja parooli päringu kehast

        //  Kontrollib, kas kasutaja eksisteerib andmebaasis
        const existingUser = await user.findOne({ where: { email } });
        if (!existingUser) return res.status(400).json({ error: "Vale e-post või parool" });

        //  Kontrollib, kas sisestatud parool vastab andmebaasis olevale räsitud paroolile
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) return res.status(400).json({ error: "Vale e-post või parool" });

        //  Loome JWT autentimistokeni, mis kehtib 1 tunni
        const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token }); // Saadame tokeni vastuseks, et kasutaja saaks seda API päringutes kasutada
    } catch (err) {
        res.status(500).json({ error: err.message }); // Serveri vea korral saadab 500 veateate
    }
};
