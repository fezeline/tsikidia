const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");
const transporter = require("../utils/transporter");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET || "tsikidia_secret";

class MotService {
  // 📌 Envoi du lien de réinitialisation par email
  static async sendResetEmail(email) {
    const user = await prisma.utilisateur.findUnique({ where: { email } });
    if (!user) throw new Error("Utilisateur introuvable");

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });
    const resetLink = `http://localhost:5174/reset-password/${token}`;

    await transporter.sendMail({
      from:`"TsikiDia Tour" <${process.env.EMAIL_USER}>`, 
      to: user.email,
      subject: "Réinitialisation de mot de passe",
      html: `
        <p>Bonjour ${user.nom || "utilisateur"},</p>
        <p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>⚠️ Ce lien expire dans 1 heure.</p>
      `,
    });

    return { message: "📩 Email envoyé avec succès !" };
  }

  // 📌 Réinitialisation du mot de passe
  static async resetPassword(token, mot_de_passe) {
    try {
      const decoded = jwt.verify(token, SECRET);
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

      await prisma.utilisateur.update({
        where: { id: decoded.id },
        data: { mot_de_passe: hashedPassword },
      });

      return { message: "✅ Mot de passe réinitialisé avec succès !" };
    } catch (err) {
      throw new Error("Lien invalide ou expiré");
    }
  }
}

module.exports = MotService;
