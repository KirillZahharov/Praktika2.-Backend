const { film, actor } = require('../models/init-models')(require('../config/database')); // Impordime andmebaasi ja mudelid

// Funktsioon kõigi näitlejate hankimiseks filmi ID alusel
exports.getActorsByFilm = async (req, res) => {
    try {
        const filmData = await film.findByPk(req.params.film_id, { // Otsime filmi ID alusel
            include: {
                model: actor, // Seome filmi näitlejate tabeliga
                as: "actors", // Seose nimi peab vastama init-models.js määratlusele
                attributes: ["actor_id", "first_name", "last_name"] // Tagastame ainult vajalikud väljad
            }
        });

        if (!filmData) {
            return res.status(404).json({ error: "Filmi ei leitud või sellel pole näitlejaid" }); // Kui filmi ei leita, saadame 404
        }

        res.json(filmData.actors); // Tagastame filmi näitlejad JSON-formaadis
    } catch (err) {
        res.status(500).json({ error: err.message }); // Vea korral saadame 500 ja veateate
    }
};

// Funktsioon kõigi filmide hankimiseks näitleja ID alusel
exports.getFilmsByActor = async (req, res) => {
    try {
        const actorData = await actor.findByPk(req.params.actor_id, { // Otsime näitlejat ID alusel
            include: {
                model: film, // Seome näitleja filmidega
                as: "films", // Seose nimi peab vastama init-models.js määratlusele
                attributes: ["film_id", "title", "release_year"] // Tagastame ainult vajalikud väljad
            }
        });

        if (!actorData) {
            return res.status(404).json({ error: "Näitlejat ei leitud või tal pole filme" }); // Kui näitlejat ei leita, saadame 404
        }

        res.json(actorData.films); // Tagastame näitleja filmid JSON-formaadis
    } catch (err) {
        res.status(500).json({ error: err.message }); // Vea korral saadame 500 ja veateate
    }
};

// Funktsioon näitleja lisamiseks filmi
exports.addActorToFilm = async (req, res) => {
    try {
        const { actor_id, film_id } = req.body; // Võtame päringu kehast filmi ja näitleja ID

        // Kontrollime, kas film ja näitleja eksisteerivad
        const filmExists = await film.findByPk(film_id);
        const actorExists = await actor.findByPk(actor_id);

        if (!filmExists || !actorExists) {
            return res.status(404).json({ error: "Näitlejat või filmi ei leitud" }); // Kui kas film või näitleja puudub, saadame 404
        }

        await filmExists.addActor(actorExists); // Sequelize helper Many-to-Many seose lisamiseks

        res.status(201).json({ message: "Näitleja lisati filmi edukalt" }); // Kui lisamine õnnestus, saadame kinnituse
    } catch (err) {
        res.status(500).json({ error: err.message }); // Vea korral saadame 500 ja veateate
    }
};

// Funktsioon näitleja eemaldamiseks filmist
exports.removeActorFromFilm = async (req, res) => {
    try {
        const { actor_id, film_id } = req.body; // Võtame päringu kehast filmi ja näitleja ID

        // Kontrollime, kas film ja näitleja eksisteerivad
        const filmExists = await film.findByPk(film_id);
        const actorExists = await actor.findByPk(actor_id);

        if (!filmExists || !actorExists) {
            return res.status(404).json({ error: "Näitlejat või filmi ei leitud" }); // Kui kas film või näitleja puudub, saadame 404
        }

        await filmExists.removeActor(actorExists); // Sequelize helper Many-to-Many seose eemaldamiseks

        res.json({ message: "Näitleja eemaldati filmist edukalt" }); // Kui eemaldamine õnnestus, saadame kinnituse
    } catch (err) {
        res.status(500).json({ error: err.message }); // Vea korral saadame 500 ja veateate
    }
};
