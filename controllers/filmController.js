const { film, language, actor, category, film_actor, film_category } = require('../models/init-models')(require('../config/database'));
const { Op } = require('sequelize'); // Impordime Sequelize operaatorid otsingute ja filtrite jaoks

// Funktsioon kõigi filmide hankimiseks koos filtreerimise, sorteerimise ja leheküljendamisega
exports.getAllFilms = async (req, res) => {
    try {
        let { page, size, sortBy, order, category: categoryName, language: languageName, actor: actorName } = req.query;

        // Määrame vaikimisi väärtused, kui neid pole päringus määratud
        page = page && !isNaN(page) ? parseInt(page) : 1;
        size = size && !isNaN(size) ? parseInt(size) : 10;
        sortBy = sortBy || "title"; // Vaikimisi sordime pealkirja järgi
        order = order && order.toUpperCase() === "DESC" ? "DESC" : "ASC"; // Vaikimisi tõusev järjekord

        if (page < 1 || size < 1) {
            return res.status(400).json({ error: "Lehekülje ja suuruse väärtused peavad olema positiivsed täisarvud" });
        }

        // Kontrollime, kas kasutaja määratud sorteerimisväli on kehtiv
        const validSortFields = ["title", "release_year", "length", "rental_rate"];
        if (!validSortFields.includes(sortBy)) {
            return res.status(400).json({ error: `Vale sorteerimisväli. Kasuta ühte järgmistest: ${validSortFields.join(", ")}` });
        }

        // Koostame filtritingimused
        let includeConditions = [];

        if (categoryName) {
            includeConditions.push({
                model: category,
                as: "categories",
                through: { attributes: [] }, // Ei tagasta vahetabeli andmeid
                where: { name: { [Op.iLike]: `%${categoryName}%` } } // Juhusuurte tähtede suhtes tundetu otsing
            });
        }

        if (languageName) {
            includeConditions.push({
                model: language,
                as: "language",
                where: { name: { [Op.iLike]: `%${languageName}%` } }
            });
        }

        if (actorName) {
            includeConditions.push({
                model: actor,
                as: "actors",
                through: { attributes: [] },
                where: {
                    [Op.or]: [
                        { first_name: { [Op.iLike]: `%${actorName}%` } },
                        { last_name: { [Op.iLike]: `%${actorName}%` } }
                    ]
                }
            });
        }

        // Otsime filmid koos leheküljendamise, sorteerimise ja filtritega
        const films = await film.findAndCountAll({
            limit: size,
            offset: (page - 1) * size,
            order: [[sortBy, order]],
            include: includeConditions
        });

        if (films.rows.length === 0) {
            return res.status(404).json({ message: "Ühtegi filmi ei leitud antud filtritega." });
        }

        res.json({
            totalFilms: films.count,
            totalPages: Math.ceil(films.count / size),
            currentPage: page,
            sortBy,
            order,
            filters: { category: categoryName, language: languageName, actor: actorName },
            films: films.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Funktsioon filmi hankimiseks ID alusel
exports.getFilmById = async (req, res) => {
    try {
        const movie = await film.findByPk(req.params.id, {
            include: [
                { model: language, as: "language", attributes: ["name"] },
                { model: language, as: "original_language", attributes: ["name"] }
            ]
        });
        if (!movie) return res.status(404).json({ error: "Filmi ei leitud" });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Funktsioon uue filmi lisamiseks
exports.createFilm = async (req, res) => {
    try {
        const newFilm = await film.create(req.body);
        res.status(201).json(newFilm);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Funktsioon filmi uuendamiseks
exports.updateFilm = async (req, res) => {
    try {
        const updated = await film.update(req.body, { where: { film_id: req.params.id } });
        if (!updated[0]) return res.status(404).json({ error: "Filmi ei leitud" });
        res.json({ message: "Film uuendati edukalt" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Funktsioon filmi kustutamiseks
exports.deleteFilm = async (req, res) => {
    try {
        const deleted = await film.destroy({ where: { film_id: req.params.id } });
        if (!deleted) return res.status(404).json({ error: "Filmi ei leitud" });
        res.json({ message: "Film kustutati edukalt" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Funktsioon filmide otsimiseks pealkirja järgi
exports.searchFilmByTitle = async (req, res) => {
    try {
        const movies = await film.findAll({
            where: {
                title: { [Op.iLike]: `%${req.query.title}%` } // Juhusuurte tähtede suhtes tundetu otsing
            }
        });

        if (movies.length === 0) return res.status(404).json({ message: "Ühtegi filmi ei leitud" });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Funktsioon filmide otsimiseks näitleja järgi
exports.searchFilmByActor = async (req, res) => {
    try {
        const movies = await film.findAll({
            include: {
                model: actor,
                as: "actors",
                where: {
                    [Op.or]: [
                        { first_name: { [Op.iLike]: `%${req.query.name}%` } },
                        { last_name: { [Op.iLike]: `%${req.query.name}%` } }
                    ]
                }
            }
        });

        if (movies.length === 0) return res.status(404).json({ message: "Ühtegi filmi ei leitud selle näitlejaga" });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Funktsioon filmide otsimiseks keele järgi
exports.searchFilmByLanguage = async (req, res) => {
    try {
        const movies = await film.findAll({
            include: {
                model: language,
                as: "language",
                where: { name: { [Op.iLike]: `%${req.query.language}%` } }
            }
        });

        if (movies.length === 0) return res.status(404).json({ message: "Ühtegi filmi ei leitud selles keeles" });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Funktsioon filmide otsimiseks kategooria järgi
exports.searchFilmByCategory = async (req, res) => {
    try {
        const movies = await film.findAll({
            include: {
                model: category,
                as: "categories",
                where: { name: { [Op.iLike]: `%${req.query.category}%` } }
            }
        });

        if (movies.length === 0) return res.status(404).json({ message: "Ühtegi filmi ei leitud selles kategoorias" });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
