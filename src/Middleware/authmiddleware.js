const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "tsikidia_secret";

function verifyToken(req, res, next) {
  
console.log("Headers reçus :", req.headers);

  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token reçu :", token); // Ajoute ce log
  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Erreur JWT:", error);
    return res.status(403).json({ message: "Token invalide" });
  }
}


module.exports = verifyToken;
