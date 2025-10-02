const { registerUtilisateur, loginUtilisateur } = require("../Service/authService");

exports.register = async (req, res) => {
  try {
    const user = await registerUtilisateur(req.body);
    res.status(201).json({ message: "Utilisateur créé avec succès", user });
  } catch (error) {
    console.error("Erreur d'inscription :", error);
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    const { token, user } = await loginUtilisateur(email, mot_de_passe);
    res.status(200).json({ message: "Connexion réussie", token, user });
  } catch (error) {
    console.error("Erreur de connexion :", error);
    res.status(401).json({ error: error.message });
  }
};


