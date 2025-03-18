const { actor } = require('../models/init-models')(require('../config/database')); // Impordime andmebaasi ja 'actor' mudeli

// Funktsioon kõigi näitlejate hankimiseks
exports.getAllActors = async (req, res) => {
    try {
        const actors = await actor.findAll(); // Otsime kõik andmebaasis olevad näitlejad
        res.json(actors); // Saadame vastuseks JSON-formaadis andmed
    } catch (err) {
        res.status(500).json({ error: err.message }); // Vea korral saadame 500 ja veateate
    }
};

// Funktsioon konkreetse näitleja hankimiseks ID alusel
exports.getActorById = async (req, res) => {
    try {
        const actorData = await actor.findByPk(req.params.id); // Otsime näitlejat tema ID järgi
        if (!actorData) return res.status(404).json({ error: "Näitlejat ei leitud" }); // Kui näitlejat ei leitud, saadame 404
        res.json(actorData); // Kui näitleja leiti, saadame JSON-vastuse
    } catch (err) {
        res.status(500).json({ error: err.message }); // Vea korral saadame 500 ja veateate
    }
};

// Funktsioon uue näitleja lisamiseks
exports.createActor = async (req, res) => {
    try {
        const newActor = await actor.create(req.body); // Lisame uue näitleja, kasutades päringu keha andmeid
        res.status(201).json(newActor); // Tagastame 201 (loodud) ja uue näitleja andmed
    } catch (err) {
        res.status(400).json({ error: err.message }); // Vea korral saadame 400 (vale sisend) ja veateate
    }
};

// Funktsioon olemasoleva näitleja andmete uuendamiseks
exports.updateActor = async (req, res) => {
    try {
        const updated = await actor.update(req.body, { where: { actor_id: req.params.id } }); // Uuendame näitleja andmed
        if (!updated[0]) return res.status(404).json({ error: "Näitlejat ei leitud" }); // Kui uuendamist ei toimunud, saadame 404
        res.json({ message: "Näitleja uuendatud edukalt" }); // Kui uuendamine õnnestus, saadame kinnituse
    } catch (err) {
        res.status(400).json({ error: err.message }); // Vea korral saadame 400 ja veateate
    }
};

// Funktsioon näitleja kustutamiseks
exports.deleteActor = async (req, res) => {
    try {
        const deleted = await actor.destroy({ where: { actor_id: req.params.id } }); // Kustutame näitleja ID alusel
        if (!deleted) return res.status(404).json({ error: "Näitlejat ei leitud" }); // Kui kustutamist ei toimunud, saadame 404
        res.json({ message: "Näitleja kustutatud edukalt" }); // Kui kustutamine õnnestus, saadame kinnituse
    } catch (err) {
        res.status(500).json({ error: err.message }); // Vea korral saadame 500 ja veateate
    }
};
