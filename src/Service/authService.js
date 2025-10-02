const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "tsikidia_secret";

// Inscription
async function registerUtilisateur({ nom, email, mot_de_passe, role, contact }) {
  const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

  return await prisma.utilisateur.create({
    data: {
      nom,
      email,
      mot_de_passe: hashedPassword,
      role,
      contact,
    },
  });
}

// Connexion
async function loginUtilisateur(email, mot_de_passe) {
  const user = await prisma.utilisateur.findUnique({ where: { email } });
  if (!user) throw new Error("Email incorrect");

   console.log("Mot de passe reçu:", mot_de_passe);
  console.log("Hash stocké:", user.mot_de_passe);

  const valid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
  if (!valid) throw new Error("Mot de passe incorrect");

  const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: "7d" });

  return { token, user };
}



module.exports = { registerUtilisateur, loginUtilisateur};
