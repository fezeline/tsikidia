const {getAllUtilisateur,
    createUtilisateur, 
    updateUtilisateur, 
    deleteUtilisateur,
    connecter,
    deconnecter,
    reserverOffre,
    commenterOffre,
    supprimerMessage,
    genererVoucher} = require("../Service/utilisateurService");

exports.getAllUtilisateurController = async (req, res) => {
    try{
      const utilisateur = await getAllUtilisateur()

      res.json(utilisateur);
    }catch(error){
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération." });
    }
};

exports.createUtilisateurController = async (req, res) => {
  try {
    const utilisateur = await createUtilisateur(req.body);
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      utilisateur,
    });
  } catch (error) {
    console.error("Erreur création utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur lors de la création de l'utilisateur" });
  }
};

exports.updateUtilisateurController = async (req, res) => {
    try{
      const {id} = req.params;
      const updateData = req.body;

      console.log(updateData);

      const utilisateur = await updateUtilisateur(Number(id), updateData);
 
      res.json(utilisateur);
    }catch(error){
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour." });
    }
};



exports.deleteUtilisateurController = async (req, res) => {
  try {
    // Récupérer l'ID depuis la route et convertir en number
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID invalide." });
    }

    // Supprimer l'utilisateur via le service
    const utilisateur = await deleteUtilisateur(id);

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    res.status(200).json({ message: "Utilisateur supprimé avec succès.", utilisateur });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);

    // Gestion spécifique pour Prisma "not found"
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    res.status(500).json({ message: "Erreur serveur lors de la suppression." });
  }
};


// Authentication Controllers
exports.connecterController = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const { utilisateur, token } = await connecter(email, mot_de_passe);

    res.json({
      message: "Connexion réussie",
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role
      },
      token
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(401).json({ message: error.message || "Échec de l'authentification" });
  }
};


exports.deconnecterController = async (req, res) => {
  try {
    const result = await deconnecter(); // rien à faire si JWT
    res.json({ message: result.message });
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    res.status(500).json({ message: "Erreur serveur lors de la déconnexion" });
  }
};


// Business Logic Controllers
exports.reserverOffreController = async (req, res) => {
    try {
        const utilisateurId = parseInt(req.params.id);
        const { offreId, nombrePers } = req.body;

        if (!offreId || !nombrePers) {
            return res.status(400).json({ message: "offreId et nombrePers sont requis" });
        }

        const reservation = await reserverOffre(utilisateurId, offreId, nombrePers);
        res.status(201).json(reservation);
    } catch (error) {
        console.error("Erreur lors de la réservation :", error);
        res.status(500).json({ message: "Erreur lors de la réservation de l'offre" });
    }
};


exports.commenterOffreController = async (req, res) => {
    try {
        const { offreId, commentaire, notes } = req.body;
        if (!offreId || !commentaire || notes === undefined) {
            return res.status(400).json({ message: "Offre ID, commentaire et notes requis" });
        }

        // Assure-toi que notes est bien un nombre
        const notesNumber = Number(notes);
        if (isNaN(notesNumber)) {
            return res.status(400).json({ message: "Notes doit être un nombre" });
        }

        const nouveauCommentaire = await commenterOffre(req.user.id, offreId, commentaire, notesNumber);
        res.status(201).json(nouveauCommentaire);
    } catch(error) {
        console.error("Erreur lors de l'ajout du commentaire :", error);
        res.status(400).json({ message: error.message || "Erreur lors de l'ajout du commentaire" });
    }
};

exports.supprimerMessageController = async (req, res) => {
    try {
        const utilisateurId = req.user.id;
        const messageId = req.params.id; // récupéré depuis l’URL

        if (!messageId) {
            return res.status(400).json({ message: "ID du message requis" });
        }

        const resultat = await supprimerMessage(utilisateurId, parseInt(messageId));
        res.status(200).json({ message: "Message supprimé avec succès", resultat });
    } catch (error) {
        console.error("Erreur lors de la suppression du message :", error);
        res.status(400).json({ message: error.message || "Erreur lors de la suppression du message" });
    }
};


exports.genererVoucherController = async (req, res) => {
  try {
    // Par exemple, payementId dans le body JSON
    const payementId = Number(req.body.payementId);
    if (isNaN(payementId)) {
      return res.status(400).json({ message: "payementId invalide" });
    }

    const voucher = await genererVoucher(payementId);
    res.json(voucher);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
