const { film, category } = require('../models/init-models')(require('../config/database')); // Impordime andmebaasi ja mudelid

// Funktsioon kõigi kategooriate hankimiseks filmi ID alusel
exports.getCategoriesByFilm = async (req, res) => {
    try {
        const filmData = await film.findByPk(req.params.film_id, { // Otsime filmi ID alusel
            include: {
                model: category, // Seome filmi kategooriate tabeliga
                as: "categories", // Seose nimi peab vastama init-models.js määratlusele
                attributes: ["category_id", "name"] // Tagastame ainult vajalikud väljad
            }
        });

        if (!filmData) {
            return res.status(404).json({ error: "Filmi ei leitud või sellel pole kategooriaid" }); // Kui filmi ei leita, saadame 404
        }

        res.json(filmData.categories); // Tagastame filmi kategooriad JSON-formaadis
    } catch (err) {
        res.status(500).json({ error: err.message }); // Vea korral saadame 500 ja veateate
    }
};

// Funktsioon kõigi filmide hankimiseks kategooria ID alusel
exports.getFilmsByCategory = async (req, res) => {
    try {
        const categoryData = await category.findByPk(req.params.category_id, { // Otsime kategooriat ID alusel
            include: {
                model: film, // Seome kategooria filmidega
                as: "films", // Seose nimi peab vastama init-models.js määratlusele
                attributes: ["film_id", "title", "release_year"] // Tagastame ainult vajalikud väljad
            }
        });

        if (!categoryData) {
            return res.status(404).json({ error: "Kategooriat ei leitud või sellel pole filme" }); // Kui kategooriat ei leita, saadame 404
        }

        res.json(categoryData.films); // Tagastame kategooria filmid JSON-formaadis
    } catch (err) {
        res.status(500).json({ error: err.message }); // Vea korral saadame 500 ja veateate
    }
};

// Funktsioon kategooria lisamiseks filmile
exports.addCategoryToFilm = async (req, res) => {
    try {
        const { category_id, film_id } = req.body; // Võtame päringu kehast filmi ja kategooria ID

        // Kontrollime, kas film ja kategooria eksisteerivad
        const filmExists = await film.findByPk(film_id);
        const categoryExists = await category.findByPk(category_id);

        if (!filmExists || !categoryExists) {
            return res.status(404).json({ error: "Filmi või kategooriat ei leitud" }); // Kui kas film või kategooria puudub, saadame 404
        }

        await filmExists.addCategory(categoryExists); // Sequelize helper Many-to-Many seose lisamiseks

        res.status(201).json({ message: "Kategooria lisati filmile edukalt" }); // Kui lisamine õnnestus, saadame kinnituse
    } catch (err) {
        res.status(500).json({ error: err.message }); // Vea korral saadame 500 ja veateate
    }
};

// Funktsioon kategooria eemaldamiseks filmist
exports.removeCategoryFromFilm = async (req, res) => {
    try {
        const { category_id, film_id } = req.body; // Võtame päringu kehast filmi ja kategooria ID

        // Kontrollime, kas film ja kategooria eksisteerivad
        const filmExists = await film.findByPk(film_id);
        const categoryExists = await category.findByPk(category_id);

        if (!filmExists || !categoryExists) {
            return res.status(404).json({ error: "Filmi või kategooriat ei leitud" }); // Kui kas film või kategooria puudub, saadame 404
        }

        await filmExists.removeCategory(categoryExists); // Sequelize helper Many-to-Many seose eemaldamiseks

        res.json({ message: "Kategooria eemaldati filmist edukalt" }); // Kui eemaldamine õnnestus, saadame kinnituse
    } catch (err) {
        res.status(500).json({ error: err.message }); // Vea korral saadame 500 ja veateate
    }
};
