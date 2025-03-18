const jwt = require('jsonwebtoken'); // Impordime jsonwebtoken, et kontrollida ja dekodeerida JWT-tokeneid

const JWT_SECRET = process.env.JWT_SECRET; // Loeme keskkonnamuutujast JWT salajase võtme (.env failist)

// Middleware autentimiseks - kontrollib, kas päringul on kehtiv JWT-token
module.exports = (req, res, next) => {
    const token = req.header("Authorization"); // Võtame tokeni HTTP päisest "Authorization"

    // Kontrollime, kas token on olemas
    if (!token) {
        return res.status(401).json({ error: "Juurdepääs keelatud, token puudub" }); // Kui token puudub, saadame 401 (Unauthorized)
    }

    try {
        // Kontrollime, kas token on õigel kujul (näiteks: "Bearer <token>")
        const tokenParts = token.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(401).json({ error: "Vale tokeni formaat" }); // Kui formaadis on viga, saadame 401
        }

        // Dekodeerime ja valideerime tokeni, kasutades JWT_SECRET salajast võtit
        const decoded = jwt.verify(tokenParts[1], JWT_SECRET);
        req.user = decoded; // Salvestame dekodeeritud kasutaja andmed päringusse

        next(); // Jätkame järgmise middleware või päringu töötlemisega
    } catch (err) {
        res.status(401).json({ error: "Vale token" }); // Kui token on kehtetu või aegunud, saadame 401 (Unauthorized)
    }
};
