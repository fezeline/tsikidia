const prisma = require("../utils/prisma");

async function getAllOffre() {
    try{
      return await prisma.offre.findMany({
        include: {
          visite: true,
          voiture: true,
          
        }
      });
    } catch(error){
        console.error("Erreur lors de la récupération des offres :", error);
        throw new Error("Impossible de récupérer les offres");
    }
};

async function createOffre(createOffre) {
  try {
    // Vérification obligatoire de l'image
    if (!createOffre.imagePrincipale) {
      throw new Error("L'image principale est obligatoire");
    }

    // Conversion base64 → Buffer
    const imageBuffer = Buffer.from(createOffre.imagePrincipale, "base64");

    const offre = await prisma.offre.create({
      data: {
        titreOffre: createOffre.titreOffre,
        prixParPers: parseFloat(createOffre.prixParPers),
        dateDepart: new Date(createOffre.dateDepart),
        dateRetour: new Date(createOffre.dateRetour),
        descriptionOffre: createOffre.descriptionOffre,
        duree: parseInt(createOffre.duree),
        placeDisponible: parseInt(createOffre.placeDisponible),
        imagePrincipale: imageBuffer,   // ✅ jamais null
        visiteId: createOffre.visiteId ? parseInt(createOffre.visiteId) : null,
        voitureId: createOffre.voitureId ? parseInt(createOffre.voitureId) : null,
      
      },
      include: {
        visite: true,
        voiture: true,
        
      }
    });

    return offre;
  } catch (error) {
    console.error("Erreur lors de la création de l'offre :", error);
    throw new Error("Impossible de créer l'offre");
  }
}




async function updateOffre(id, updateOffre) {
    try{
      const offre = await prisma.offre.update({
        where: {id: parseInt(id)},
        data: {
          titreOffre: updateOffre.titreOffre,      
          prixParPers: updateOffre.prixParPers ? parseFloat(updateOffre.prixParPers) : undefined,  
          dateDepart: updateOffre.dateDepart ? new Date(updateOffre.dateDepart) : undefined,  
          dateRetour: updateOffre.dateRetour ? new Date(updateOffre.dateRetour) : undefined,  
          descriptionOffre: updateOffre.descriptionOffre,
          duree: updateOffre.duree ? parseInt(updateOffre.duree) : undefined,          
          placeDisponible: updateOffre.placeDisponible ? parseInt(updateOffre.placeDisponible) : undefined, 
          imagePrincipale: updateOffre.imagePrincipale ? Buffer.from(updateOffre.imagePrincipale, 'base64') : undefined,
          visiteId: updateOffre.visiteId !== undefined ? 
                   (updateOffre.visiteId ? parseInt(updateOffre.visiteId) : null) : undefined,
          voitureId: updateOffre.voitureId !== undefined ? 
                    (updateOffre.voitureId ? parseInt(updateOffre.voitureId) : null) : undefined,
          
        },
        include: {
          visite: true,
          voiture: true,
         
        }
      });

      return offre;
    } catch(error){
       console.error(`Erreur lors de la mise à jour de l'offre avec l'ID ${id} :`, error);
        throw new Error("Impossible de mettre à jour l'offre");
    }
};

async function deleteOffre(id) {
  try {
    const offreId = parseInt(id);

    // Vérifier si l'offre existe
    const existingOffre = await prisma.offre.findUnique({ where: { id: offreId } });
    if (!existingOffre) {
      throw new Error(`Offre avec l'ID ${offreId} non trouvée`);
    }

    // Supprimer l'offre (les relations avec onDelete: Cascade seront supprimées automatiquement)
    const offre = await prisma.offre.delete({
      where: { id: offreId },
      include: {
        visite: true,
        voiture: true,
        
      }
    });

    return offre;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'offre :", error);
    throw new Error("Impossible de supprimer l'offre");
  }
}



async function verifierDisponibilite(offreId) {
    try {
        const offre = await prisma.offre.findUnique({
            where: { id: parseInt(offreId) }
        });
        return offre.placeDisponible > 0;
    } catch(error) {
        console.error("Erreur lors de la vérification de disponibilité :", error);
        throw new Error("Impossible de vérifier la disponibilité");
    }
};

async function filtrerOffre(prixMax) {
  try {
    const maxPrix = parseFloat(prixMax); // Conversion explicite

    if (isNaN(maxPrix)) {
      throw new Error("prixMax n'est pas un nombre valide");
    }

    return await prisma.offre.findMany({
      where: {
        prixParPers: {
          lte: maxPrix
        }
      },
      include: {
        visite: true,
        voiture: true,
        
      }
    });

  } catch (error) {
    console.error("Erreur lors du filtrage des offres :", error);
    throw new Error("Impossible de filtrer les offres");
  }
};

async function updatePlacesDisponibles(offreId, placesReservees) {
  const offre = await Offre.findById(offreId);
  if (!offre) throw new Error("Offre non trouvée");

  // Calculer les places restantes
  const nouvellesPlaces = offre.placeDisponible - placesReservees;
  if (nouvellesPlaces < 0) throw new Error("Pas assez de places disponibles");

  offre.placeDisponible = nouvellesPlaces;
  await offre.save();

  return offre;
}




module.exports = {
  getAllOffre,
  createOffre,
  updateOffre,
  deleteOffre,
  verifierDisponibilite,
  filtrerOffre,
  updatePlacesDisponibles
};