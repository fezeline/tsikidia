const prisma = require("../utils/prisma");

// Récupérer tous les messages avec expéditeur et destinataire
async function getAllMessage() {
  try {
    return await prisma.message.findMany({
      include: { expediteur: true, destinataire: true },
      orderBy: { dateEnvoie: 'asc' }, // Tri chronologique
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    throw error;
  }
}

async function createMessage(data) {
  try {
    const message = await prisma.message.create({
      data: {
        dateEnvoie: data.dateEnvoie,
        contenuMessage: data.contenuMessage,
        expediteurId: data.expediteurId,
        destinataireId: data.destinataireId,
      },
      include: { expediteur: true, destinataire: true },
    });
    return message;
  } catch (error) {
    console.error("Erreur lors de la création de message :", error);
    throw new Error("Impossible de créer le message");
  }
}

async function updateMessage(id, data) {
  try {
    const message = await prisma.message.update({
      where: { id },
      data: {
        contenuMessage: data.contenuMessage,
        dateEnvoie: data.dateEnvoie,
        expediteurId: data.expediteurId,
        destinataireId: data.destinataireId,
      },
      include: { expediteur: true, destinataire: true },
    });
    return message;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de message :", error);
    throw new Error("Impossible de mettre à jour le message");
  }
}

async function deleteMessage(id) {
  try {
    return await prisma.message.delete({ where: { id } });
  } catch (error) {
    console.error("Erreur lors de la suppression du message :", error);
    throw new Error("Impossible de supprimer le message");
  }
}

async function getContenuMessage(id) {
  try {
    const message = await prisma.message.findUnique({
      where: { id },
      select: { contenuMessage: true },
    });
    if (!message) throw new Error("Message non trouvé");
    return message.contenuMessage;
  } catch (error) {
    console.error("Erreur lors de la récupération du contenu :", error);
    throw error;
  }
}

module.exports = {
  getAllMessage,
  createMessage,
  updateMessage,
  deleteMessage,
  getContenuMessage,
};
