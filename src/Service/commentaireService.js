const prisma = require("../utils/prisma");

async function getAllCommenatire() {
    try{
     return await prisma.commentaire.findMany({
         include: {
             utilisateur: true,
             offre: true, // inclut les infos de l'offre
         }
     });
    } catch(error){
        console.error("Erreur lors de la récupération des commentaires :", error);
        throw new Error("Impossible de récupérer les commentaires");
    }
};

async function createCommentaire(createCommentaire) {
    try{
       const commentaire = await prisma.commentaire.create({
        data: {
           dateCommentaire: createCommentaire.dateCommentaire,
           contenuCommentaire: createCommentaire.contenuCommentaire,
           notes: parseFloat(createCommentaire.notes), // Conversion en float
           utilisateurId: parseInt(createCommentaire.utilisateurId), // Conversion en int
           offreId: parseInt(createCommentaire.offreId), // Ajout de l'ID de l'offre
        },
        include: {
            utilisateur: true,
            offre: true, // inclut les infos de l'offre
        }
    });

    return commentaire;

    } catch(error){
        console.error("Erreur lors de la création de commentaire:", error);
        throw new Error("Impossible de créer le commentaire: " + error.message);
    }
};

async function updateCommentaire(id, updateCommentaire) {
    try{
      const data = {
          dateCommentaire: updateCommentaire.dateCommentaire,
          contenuCommentaire: updateCommentaire.contenuCommentaire,
          notes: updateCommentaire.notes ? parseFloat(updateCommentaire.notes) : undefined,
      };
      
      // Ajouter les relations seulement si elles sont fournies
      
      if (updateCommentaire.utilisateurId) {
          data.utilisateur = { connect: { id: parseInt(updateCommentaire.utilisateurId) } };
      }
       if (updateCommentaire.offreId) {
            data.offre = { connect: { id: parseInt(updateCommentaire.offreId) } };
        }

      const commentaire = await prisma.commentaire.update({
        where: { id: parseInt(id) },
        data: data,
        include: {
            utilisateur: true,
            offre: true,
        }
    });

    return commentaire;
    } catch(error){
         console.error(`Erreur lors de la mise à jour de commentaire avec l'ID ${id} :`, error);
        throw new Error("Impossible de mettre à jour le commentaire: " + error.message);
    }
};

async function deleteCommentaire(id) {
    try{
        // Vérifier d'abord si le commentaire existe
        const existingCommentaire = await prisma.commentaire.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingCommentaire) {
            throw new Error(`Commentaire avec l'ID ${id} non trouvé`);
        }

        // Supprimer le commentaire
        const commentaire = await prisma.commentaire.delete({
            where: { id: parseInt(id) },
        });

        return {
            success: true,
            message: "Commentaire supprimé avec succès",
            data: commentaire
        };
        
    } catch(error){
        console.error(`Erreur lors de la suppression de commentaire avec l'ID ${id} :`, error);
        
        if (error.code === 'P2025') {
            throw new Error(`Commentaire avec l'ID ${id} non trouvé`);
        }
        
        throw new Error("Impossible de supprimer le commentaire: " + error.message);
    }
};

module.exports = {getAllCommenatire, createCommentaire, updateCommentaire, deleteCommentaire};