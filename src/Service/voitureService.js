const prisma = require("../utils/prisma");

async function getAllVoiture() {
  try {
    return await prisma.voiture.findMany();
  } catch (error) {
    console.error("Erreur lors de la récupération des voitures :", error);
    throw error;
  }
}

async function getCalculerCoutTotalVoiture(id, nombreJours) {
  try {
    const voiture = await prisma.voiture.findUnique({
      where: { id },
    });

    if (!voiture) {
      throw new Error("Voiture introuvable");
    }

    const coutTotal = voiture.coutParJours * nombreJours;
    return coutTotal;

  } catch (error) {
    console.error("Erreur lors du calcul du coût total :", error);
    throw error;
  }
}

async function createVoiture(createVoiture) {
  try {
    // Conversion des chaînes en nombres
    const voitureData = {
      immatriculation: createVoiture.immatriculation,
      marque: createVoiture.marque,
      modele: createVoiture.modele,
      coutParJours: parseFloat(createVoiture.coutParJours),
      nombreJours: parseInt(createVoiture.nombreJours, 10),
      capacite: parseInt(createVoiture.capacite, 10)
    };

    const voiture = await prisma.voiture.create({
      data: voitureData
    });
    
    return voiture;
  } catch (error) {
    console.error("Erreur lors de la création de la voiture :", error);
    throw error;
  }
}

async function updateVoiture(id, updateVoiture) {
  try {
    // Conversion des chaînes en nombres
    const voitureData = {
      immatriculation: updateVoiture.immatriculation,
      marque: updateVoiture.marque,
      modele: updateVoiture.modele,
      coutParJours: parseFloat(updateVoiture.coutParJours),
      nombreJours: parseInt(updateVoiture.nombreJours, 10),
      capacite: parseInt(updateVoiture.capacite, 10)
    };

    const voiture = await prisma.voiture.update({
      where: { id: parseInt(id, 10) }, // Conversion de l'ID aussi
      data: voitureData
    });

    return voiture;

  } catch (error) {
    console.error("Erreur lors de la mise à jour de la voiture :", error);
    throw error;
  }
}

async function deleteVoiture(id) {
  try {
    const voiture = await prisma.voiture.delete({
      where: { id: parseInt(id, 10) }, // Conversion de l'ID
    });

    return voiture;

  } catch (error) {
    console.error("Erreur lors de la suppression de la voiture :", error);
    throw error;
  }
}

module.exports = {
  getAllVoiture,
  getCalculerCoutTotalVoiture,
  createVoiture,
  updateVoiture,
  deleteVoiture
};