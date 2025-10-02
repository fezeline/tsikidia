const prisma = require ("../utils/prisma");

async function getAllHebergement() {
   try{
     return await prisma.hebergement.findMany();
   } catch(error){
        console.error("Erreur lors de la récupération des hebergements :", error);
        throw new Error("Impossible de récupérer les hebergements");
   }
};

async function createHebergement(createHebergement) {
    try{
      const hebergement = await prisma.hebergement.create({
        data: {
          nom: createHebergement.nom,
          adresse: createHebergement.adresse,
          etoile: createHebergement.etoile,
          fraisParNuit: createHebergement.fraisParNuit,
          nombreNuit: createHebergement.nombreNuit,
        },
    });

    return hebergement
    } catch(error){
        console.error("Erreur lors de la création de l'hebergement :", error);
        throw new Error("Impossible de créer l'hebergement");
    }
};

async function updateHebergement(id, updateHebergement) {
    try{
     const hebergement = await prisma.hebergement.update({
        where: {id: id},
        data: {
          nom: updateHebergement.nom,
          adresse: updateHebergement.adresse,
          etoile: updateHebergement.etoile,
          fraisParNuit: updateHebergement.fraisParNuit,
          nombreNuit: updateHebergement.nombreNuit,
        },
       
    });

    return hebergement
    } catch(error){
         console.error(`Erreur lors de la mise à jour de l'hebergement avec l'ID ${id} :`, error);
        throw new Error("Impossible de mettre à jour l'hebergement");
    }
};


async function deleteHebergement(id) {
    try{
     const hebergement = await prisma.hebergement.delete({
        where: {id: id},
    });

    return hebergement
    } catch(error){
         console.error(`Erreur lors de la suppression de l'hebergement avec l'ID ${id} :`, error);
          throw new Error("Impossible de supprimer l'hebergement");
    }
};

async function getcalculerTotalFrais(id, nombreNuit) {
    try {
        const hebergement = await prisma.hebergement.findUnique({
            where: { id: id }
        });

        if (!hebergement) {
            throw new Error("Hebergement non trouvé");
        }

        // Calculate total fees: fraisParNuit multiplied by number of people
        const total = hebergement.fraisParNuit * nombreNuit;
        return total;
    } catch(error) {
        console.error(`Erreur lors du calcul des frais pour l'hebergement avec l'ID ${id} :`, error);
        throw new Error("Impossible de calculer les frais totaux");
    }
};

module.exports = {getAllHebergement,
                  createHebergement,
                  updateHebergement,
                  deleteHebergement,
                  getcalculerTotalFrais};