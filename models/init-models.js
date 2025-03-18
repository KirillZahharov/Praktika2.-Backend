const DataTypes = require("sequelize").DataTypes; // Impordime Sequelize andmetüübid
const _actor = require("./actor"); // Impordime näitlejate mudeli
const _category = require("./category"); // Impordime kategooriate mudeli
const _film = require("./film"); // Impordime filmide mudeli
const _film_actor = require("./film_actor"); // Impordime filmide ja näitlejate seose mudeli
const _film_category = require("./film_category"); // Impordime filmide ja kategooriate seose mudeli
const _language = require("./language"); // Impordime keelte mudeli
const _user = require("./user"); // Impordime kasutajate mudeli

function initModels(sequelize) {
    // Initsialiseerime mudelid andmebaasis
    const actor = _actor(sequelize, DataTypes);
    const category = _category(sequelize, DataTypes);
    const film = _film(sequelize, DataTypes);
    const film_actor = _film_actor(sequelize, DataTypes);
    const film_category = _film_category(sequelize, DataTypes);
    const language = _language(sequelize, DataTypes);
    const user = _user(sequelize, DataTypes);

    // Many-to-Many: Filmid - Näitlejad (film_actor vahetabeli kaudu)
    actor.belongsToMany(film, { 
        as: "films", 
        through: film_actor, 
        foreignKey: "actor_id", 
        otherKey: "film_id"
    });

    film.belongsToMany(actor, { 
        as: "actors", 
        through: film_actor, 
        foreignKey: "film_id", 
        otherKey: "actor_id"
    });

    // Many-to-Many: Filmid - Kategooriad (film_category vahetabeli kaudu)
    category.belongsToMany(film, { 
        as: "films", 
        through: film_category, 
        foreignKey: "category_id", 
        otherKey: "film_id"
    });

    film.belongsToMany(category, { 
        as: "categories", 
        through: film_category, 
        foreignKey: "film_id", 
        otherKey: "category_id"
    });

    // One-to-Many: Film_Actors - Näitlejad
    film_actor.belongsTo(actor, { 
        as: "actor", 
        foreignKey: "actor_id"
    });

    actor.hasMany(film_actor, { 
        as: "film_actors", 
        foreignKey: "actor_id"
    });

    // One-to-Many: Film_Actors - Filmid
    film_actor.belongsTo(film, { 
        as: "film", 
        foreignKey: "film_id"
    });

    film.hasMany(film_actor, { 
        as: "film_actors", 
        foreignKey: "film_id"
    });

    // One-to-Many: Film_Categories - Kategooriad
    film_category.belongsTo(category, { 
        as: "category", 
        foreignKey: "category_id"
    });

    category.hasMany(film_category, { 
        as: "film_categories", 
        foreignKey: "category_id"
    });

    // One-to-Many: Film_Categories - Filmid
    film_category.belongsTo(film, { 
        as: "film", 
        foreignKey: "film_id"
    });

    film.hasMany(film_category, { 
        as: "film_categories", 
        foreignKey: "film_id"
    });

    // One-to-Many: Filmid - Keeled (Language)
    film.belongsTo(language, { 
        as: "language", 
        foreignKey: "language_id"
    });

    language.hasMany(film, { 
        as: "films", 
        foreignKey: "language_id"
    });

    // One-to-Many: Filmid - Originaalkeeled
    film.belongsTo(language, { 
        as: "original_language", 
        foreignKey: "original_language_id"
    });

    language.hasMany(film, { 
        as: "original_language_films", 
        foreignKey: "original_language_id"
    });

    return {
        actor,
        category,
        film,
        film_actor,
        film_category,
        language,
        user // Lisatud kasutajate mudel (User)
    };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
