const { language } = require('../models/init-models')(require('../config/database')); // Impordime andmebaasi ja keele mudeli

// Funktsioon kõigi keelte hankimiseks
exports.getAllLanguages = async (req, res) => {
    try {
        const languages = await language.findAll(); // Otsime kõik keeled andmebaasist
        res.json(languages); // Tagastame keeled JSON-vormingus
    } catch (err) {
        res.status(500).json({ error: err.message }); // Vea korral saadame 500 ja veateate
    }
};

// Funktsioon konkreetse keele hankimiseks ID alusel
exports.getLanguageById = async (req, res) => {
    try {
        const lang = await language.findByPk(req.params.id); // Otsime keelt ID alusel
        if (!lang) return res.status(404).json({ error: "Keelt ei leitud" }); // Kui keelt ei leita, saadame 404
        res.json(lang); // Kui keel on leitud, saadame JSON-vastuse
    } catch (err) {
        res.status(500).json({ error: err.message }); // Vea korral saadame 500 ja veateate
    }
};

// Funktsioon uue keele lisamiseks
exports.createLanguage = async (req, res) => {
    try {
        const newLang = await language.create(req.body); // Loome uue keele andmebaasis
        res.status(201).json(newLang); // Tagastame loodud keele JSON-vormingus
    } catch (err) {
        res.status(400).json({ error: err.message }); // Vea korral saadame 400 (vale sisend) ja veateate
    }
};

// Funktsioon keele uuendamiseks
exports.updateLanguage = async (req, res) => {
    try {
        const updated = await language.update(req.body, { where: { language_id: req.params.id } }); // Uuendame keele andmed
        if (!updated[0]) return res.status(404).json({ error: "Keelt ei leitud" }); // Kui uuendamist ei toimunud, saadame 404
        res.json({ message: "Keel uuendati edukalt" }); // Kui uuendamine õnnestus, saadame kinnituse
    } catch (err) {
        res.status(400).json({ error: err.message }); // Vea korral saadame 400 ja veateate
    }
};

// Funktsioon keele kustutamiseks
exports.deleteLanguage = async (req, res) => {
    try {
        const deleted = await language.destroy({ where: { language_id: req.params.id } }); // Kustutame keele ID alusel
        if (!deleted) return res.status(404).json({ error: "Keelt ei leitud" }); // Kui kustutamist ei toimunud, saadame 404
        res.json({ message: "Keel kustutati edukalt" }); // Kui kustutamine õnnestus, saadame kinnituse
    } catch (err) {
        res.status(500).json({ error: err.message }); // Vea korral saadame 500 ja veateate
    }
};
