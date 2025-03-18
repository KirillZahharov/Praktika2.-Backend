const db = require('../config/database'); // Impordime andmebaasiühenduse
const initModels = require("../models/init-models"); // Impordime mudelid
const models = initModels(db); // Initsialiseerime mudelid andmebaasiühendusega

//  Funktsioon kõigi filmikategooriate hankimiseks
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await models.category.findAll(); // Otsime kõik kategooriad andmebaasist
        res.status(200).json(categories); // Saadame vastuseks JSON-formaadis andmed
    } catch (error) {
        console.error(error); // Logime vea serveri konsooli
        res.status(500).json({ message: 'Tekkis viga filmikategooriate hankimisel' }); // Saadame veateate
    }
};

//  Funktsioon uue filmikategooria lisamiseks
exports.createCategory = async (req, res) => {
    const { name } = req.body; // Võtame päringu kehast kategooria nime
    try {
        const category = await models.category.create({ name }); // Loome uue kategooria
        res.status(201).json(category); // Tagastame loodud kategooria JSON-vormingus
    } catch (error) {
        console.error(error); // Logime vea serveri konsooli
        res.status(500).json({ message: 'Tekkis viga filmikategooria loomisel' }); // Saadame veateate
    }
};

//  Funktsioon filmikategooria hankimiseks ID alusel
exports.getCategoryById = async (req, res) => {
    const { id } = req.params; // Võtame päringu URL-ist kategooria ID
    try {
        const category = await models.category.findByPk(id); // Otsime kategooriat ID järgi
        if (!category) {
            return res.status(404).json({ message: 'Filmikategooriat ei leitud' }); // Kui kategooriat ei leitud, saadame 404
        }
        res.status(200).json(category); // Kui kategooria on leitud, saadame selle JSON-vormingus
    } catch (error) {
        console.error(error); // Logime vea serveri konsooli
        res.status(500).json({ message: 'Tekkis viga filmikategooria hankimisel' }); // Saadame veateate
    }
};

//  Funktsioon filmikategooria uuendamiseks
exports.updateCategory = async (req, res) => {
    const { id } = req.params; // Võtame päringu URL-ist kategooria ID
    const { name } = req.body; // Võtame päringu kehast uue kategooria nime
    try {
        const category = await models.category.findByPk(id); // Otsime kategooriat ID järgi
        if (!category) {
            return res.status(404).json({ message: 'Filmikategooriat ei leitud' }); // Kui kategooriat ei leitud, saadame 404
        }
        await category.update({ name }); // Uuendame kategooria nime
        res.status(200).json(category); // Tagastame uuendatud kategooria
    } catch (error) {
        console.error(error); // Logime vea serveri konsooli
        res.status(500).json({ message: 'Tekkis viga filmikategooria uuendamisel' }); // Saadame veateate
    }
};

//  Funktsioon filmikategooria kustutamiseks
exports.deleteCategory = async (req, res) => {
    const { id } = req.params; // Võtame päringu URL-ist kategooria ID
    try {
        const category = await models.category.findByPk(id); // Otsime kategooriat ID järgi
        if (!category) {
            return res.status(404).json({ message: 'Filmikategooriat ei leitud' }); // Kui kategooriat ei leitud, saadame 404
        }
        await category.destroy(); // Kustutame kategooria
        res.status(204).json(); // Tagastame HTTP 204 (No Content) vastuse, sest kustutatud sisu enam pole
    } catch (error) {
        console.error(error); // Logime vea serveri konsooli
        res.status(500).json({ message: 'Tekkis viga filmikategooria kustutamisel' }); // Saadame veateate
    }
};
