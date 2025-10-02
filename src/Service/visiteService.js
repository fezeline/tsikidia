const prisma = require("../utils/prisma");

async function getAllVisite() {
  try {
    return await prisma.visite.findMany({
      include: {
        activite: true,
        hebergement: true,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des visites :", error);
    throw error;
  }
}


async function createVisite(createVisite) {
  try {
    const visite = await prisma.visite.create({
      data: {
        ville: createVisite.ville,
        dateVisite: new Date(createVisite.dateVisite),
        ordreVisite: createVisite.ordreVisite,

        // Ajout des relations
        activite: createVisite.activiteId
          ? { connect: { id: createVisite.activiteId } }
          : undefined,
        hebergement: createVisite.hebergementId
          ? { connect: { id: createVisite.hebergementId } }
          : undefined,
      },
      include: {
        activite: true,
        hebergement: true,
      },
    });

    return visite;
  } catch (error) {
    console.error("Erreur lors de la création de la visite :", error);
    throw error;
  }
}

async function updateVisite(id, updateVisite) {
  try {
    const visite = await prisma.visite.update({
      where: { id: Number(id) },
      data: {
        ville: updateVisite.ville,
        dateVisite: new Date(updateVisite.dateVisite),
        ordreVisite: updateVisite.ordreVisite,

        // Relations mises à jour si fournies
        activite: updateVisite.activiteId
          ? { connect: { id: updateVisite.activiteId } }
          : undefined,
        hebergement: updateVisite.hebergementId
          ? { connect: { id: updateVisite.hebergementId } }
          : undefined,
      },
      include: {
        activite: true,
        hebergement: true,
      },
    });

    return visite;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la visite :", error);
    throw error;
  }
}

async function deleteVisite(id, options = {}) {
  try {
    const { force = false } = options;

    const visiteExist = await prisma.visite.findUnique({ where: { id } });
    if (!visiteExist) {
      throw { code: "P2025", message: "Visite non trouvée" };
    }

    const deletedVisite = await prisma.visite.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Visite supprimée avec succès",
      data: deletedVisite,
      warnings: force
        ? ["Suppression forcée - tous les éléments associés ont été supprimés"]
        : [],
    };
  } catch (error) {
    console.error("Erreur dans deleteVisite:", error);

    if (error.code === "P2025") {
      throw {
        success: false,
        code: "NOT_FOUND",
        message: error.message,
      };
    }

    throw {
      success: false,
      code: error.code || "DATABASE_ERROR",
      message: error.message || "Erreur lors de la suppression de la visite",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    };
  }
}



module.exports = {
  getAllVisite,
  createVisite,
  updateVisite,
  deleteVisite,
};
