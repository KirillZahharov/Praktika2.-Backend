const Sequelize = require('sequelize'); // Impordime Sequelize mooduli
require('dotenv').config(); // Laeme keskkonnamuutujad failist .env

// Loome ühenduse PostgreSQL andmebaasiga, kasutades .env failist pärit väärtusi
const sequelize = new Sequelize(
    process.env.DB_NAME, // Andmebaasi nimi
    process.env.DB_USERNAME, // Kasutajanimi
    process.env.DB_PASSWORD, // Parool
    {
        host: process.env.DB_HOST, // Andmebaasi host (tavaliselt 'localhost' või serveri aadress)
        port: process.env.DB_PORT, // Andmebaasi port (PostgreSQL vaikimisi port on 5432)
        dialect: 'postgres', // Kasutame PostgreSQL andmebaasi

        // Ühenduste haldamise konfiguratsioon
        pool: {
            max: 10, // Maksimaalne samaaegsete ühenduste arv
            min: 0, // Minimaalne samaaegsete ühenduste arv
            acquire: 30000, // Maksimaalne aeg (ms), mille jooksul üritatakse uut ühendust luua
            idle: 10000 // Maksimaalne aeg (ms), mille järel mittekasutatud ühendus suletakse
        }
    }
);

// Ühenduse kontrollimine
sequelize
    .authenticate()
    .then(() => {
        console.log('Ühendus andmebaasiga on edukalt loodud.');
    })
    .catch(err => {
        console.error('Andmebaasiga ühenduse loomine ebaõnnestus:', err);
    });

module.exports = sequelize; // Eksportime ühenduse, et seda saaks kasutada teistes failides
