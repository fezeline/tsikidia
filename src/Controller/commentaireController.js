const { getAllCommenatire,
     createCommentaire,
      updateCommentaire,
       deleteCommentaire } = require("../Service/commentaireService");
const prisma = require("../utils/prisma");

// Fonction pour gérer les structures circulaires dans JSON
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

exports.getAllCommentaireController = async (req, res) => {
   try{
     const commentaire = await getAllCommenatire();
     res.json(commentaire);
   } catch(error){
        console.error("Erreur lors de la récupération des commentaires :", error);
       res.status(500).json({ message: "Erreur serveur." });
   }
};

exports.createCommentaireController = async (req, res) => {
    try {
      const data = req.body;
      
      // Conversion de la date en format ISO et validation
      if (data.dateCommentaire) {
        data.dateCommentaire = new Date(data.dateCommentaire).toISOString();
      } else {
        data.dateCommentaire = new Date().toISOString(); // Date actuelle par défaut
      }

      // Conversion des nombres
      data.notes = Number(data.notes) || 0;
      data.utilisateurId = Number(data.utilisateurId);
      data.offreId = Number(data.offreId);

      const commentaire = await createCommentaire(data);
      res.status(201).json(commentaire);
    } catch(error) {
      console.error("Erreur détaillée lors de la création:", error);
      res.status(400).json({ 
        message: "Erreur lors de la création de commentaire",
        error: error.message 
      });
    }
};

exports.updateCommentaireController = async (req, res) => {
    try{
       const {id} = req.params;
       const updateData = req.body;

       const commentaire = await updateCommentaire(Number(id), {
        dateCommentaire: updateData.dateCommentaire ? new Date(updateData.dateCommentaire) : undefined,
        contenuCommentaire: updateData.contenuCommentaire,
        notes: updateData.notes ? Number(updateData.notes) : undefined,
        utilisateurId: updateData.utilisateurId ? Number(updateData.utilisateurId) : undefined,
        offreId: updateData.offreId ? Number(updateData.offreId) : undefined,
    });

    res.json(commentaire);
    } catch(error){
        console.error("Erreur lors de la mise à jour de commentaire :", error);
        res.status(400).json({ message: "Erreur lors de la mise à jour." });
    }
};

exports.deleteCommentaireController = async (req, res) => {
    try{
      const {id} = req.params;
      console.log("Tentative de suppression du commentaire ID:", id);

      // CORRECTION : Appeler la fonction deleteCommentaire et utiliser son résultat
      const result = await deleteCommentaire(Number(id));

      // CORRECTION : Renvoyer le résultat de la suppression, pas le modèle Prisma
      res.status(200).json({
        success: true,
        message: result.message || "Commentaire supprimé avec succès",
        data: result
      });
      
    } catch(error){
        console.error("Erreur lors de la suppression :", error);
        
        // Gestion spécifique des erreurs Prisma
        if (error.code === 'P2025') {
            return res.status(404).json({ 
                error: "Commentaire non trouvé",
                message: `Le commentaire avec l'ID ${req.params.id} n'existe pas` 
            });
        }
        
        res.status(500).json({ 
            error: "Erreur serveur lors de la suppression",
            message: error.message 
        });
    }
};