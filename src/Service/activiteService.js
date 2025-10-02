const prisma = require ("../utils/prisma");

async function getAllActivite() {
   try{
    return await prisma.activite.findMany();
   } catch(error){
        console.error("Erreur lors de la récupération des activites :", error);
        throw new Error("Impossible de récupérer les activites");
   }
};

async function createActivite(createActivite) {
    try{
      const activite = await prisma.activite.create({
        data: {
           descriptionActivite: createActivite.descriptionActivite,
           dateActivite: createActivite.dateActivite,
           lieuActivite: createActivite.lieuActivite,
           
        },
       
    });

    return activite
    } catch(error){
        console.error("Erreur lors de la création de l'activite :", error);
        throw new Error("Impossible de créer l'activite");
    }
};

async function updateActivite(id, updateActivite) {
    try{
     const activite = await prisma.activite.update({
        where: {id: id},
        data: {
           descriptionActivite: updateActivite.descriptionActivite,
           dateActivite: updateActivite.dateActivite,
           lieuActivite: updateActivite.lieuActivite,
        },
        
    });

    return activite
    } catch(error){
        console.error(`Erreur lors de la mise à jour de l'activite avec l'ID ${id} :`, error);
        throw new Error("Impossible de mettre à jour l'activite");
    }
};


async function deleteActivite(id) {
    try{
     const activite = await prisma.activite.delete({
        where: {id: id},
    });

    return activite
    } catch(error){
        console.error(`Erreur lors de la suppression de l'activite avec l'ID ${id} :`, error);
        throw new Error("Impossible de supprimer l'activite");
    }
};

module.exports = {getAllActivite, createActivite, updateActivite, deleteActivite};