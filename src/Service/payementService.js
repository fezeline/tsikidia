const prisma = require("../utils/prisma");

// 🔹 Récupérer tous les paiements
async function getAllPayement() {
  try {
    return await prisma.payement.findMany({
      include: { utilisateur: true, reservation: true },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements :", error);
    throw error;
  }
}

// 🔹 Créer un paiement en DB
async function createPayement(data) {
  try {
    // ✅ Vérification : description obligatoire
    if (!data.description || data.description.trim() === "") {
      throw new Error("Le champ 'description' est obligatoire pour le paiement.");
    }

    const payement = await prisma.payement.create({
      data: {
        montant: data.montant,
        date: data.date ? new Date(data.date) : new Date(),
        modePayement: data.modePayement || null,
        status: data.status || "EN_ATTENTE", // défaut EN_ATTENTE
        description: data.description,
        utilisateurId: data.utilisateurId,
        reservationId: data.reservationId || null,
        stripePaymentIntentId: data.stripePaymentIntentId || null,
      },
      include: { utilisateur: true, reservation: true },
    });
    return payement;
  } catch (error) {
    console.error("Erreur lors de la création du paiement :", error);
    throw error;
  }
}

// 🔹 Mettre à jour un paiement par son ID
async function updatePayement(id, data) {
  try {
    const payement = await prisma.payement.update({
      where: { id },
      data: {
        montant: data.montant !== undefined ? data.montant : undefined,
        date: data.date ? new Date(data.date) : undefined,
        modePayement: data.modePayement !== undefined ? data.modePayement : undefined,
        status: data.status !== undefined ? data.status : undefined,
        description: data.description !== undefined ? data.description : undefined,
        utilisateur: data.utilisateurId
          ? { connect: { id: data.utilisateurId } }
          : undefined,
        reservation: data.reservationId
          ? { connect: { id: data.reservationId } }
          : undefined,
      },
      include: { utilisateur: true, reservation: true },
    });

    // ✅ Si le paiement est marqué comme SUCCES, on confirme la réservation liée
    if (payement.status === "SUCCES" && payement.reservationId) {
      await prisma.reservation.update({
        where: { id: payement.reservationId },
        data: { status: "CONFIRMEE" },
      });
    }

    return payement;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du paiement :", error);
    throw error;
  }
}

// 🔹 Mettre à jour un paiement par reservationId (utile après paiement)
async function updatePayementByReservationId(reservationId, data) {
  try {
    const result = await prisma.payement.updateMany({
      where: { reservationId: Number(reservationId) },
      data: data,
    });

    // ✅ Si on marque le paiement comme SUCCES, mettre la réservation CONFIRMEE
    if (data.status === "SUCCES") {
      await prisma.reservation.update({
        where: { id: Number(reservationId) },
        data: { status: "CONFIRMEE" },
      });
    }

    return result;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du paiement par réservation :", error);
    throw error;
  }
}

// 🔹 Fonction spécifique pour marquer un paiement comme réussi
async function markPaymentAsSuccess(paymentId, stripePaymentIntentId = null) {
  try {
    const updateData = {
      status: "SUCCES",
      date: new Date(),
    };

    if (stripePaymentIntentId) {
      updateData.stripePaymentIntentId = stripePaymentIntentId;
    }

    const payement = await prisma.payement.update({
      where: { id: paymentId },
      data: updateData,
      include: { utilisateur: true, reservation: true },
    });

    // ✅ Confirmer la réservation liée si elle existe
    if (payement.reservationId) {
      await prisma.reservation.update({
        where: { id: payement.reservationId },
        data: { status: "CONFIRMEE" },
      });
    }

    return payement;
  } catch (error) {
    console.error("Erreur lors du marquage du paiement comme réussi :", error);
    throw error;
  }
}

// 🔹 Fonction spécifique pour marquer un paiement par réservation comme réussi
async function markPaymentByReservationAsSuccess(reservationId, stripePaymentIntentId = null) {
  try {
    const updateData = {
      status: "SUCCES",
      date: new Date(),
    };

    if (stripePaymentIntentId) {
      updateData.stripePaymentIntentId = stripePaymentIntentId;
    }

    const result = await prisma.payement.updateMany({
      where: { 
        reservationId: Number(reservationId),
        status: { not: "SUCCES" } // Éviter de mettre à jour les paiements déjà réussis
      },
      data: updateData,
    });

    // ✅ Confirmer la réservation
    if (result.count > 0) {
      await prisma.reservation.update({
        where: { id: Number(reservationId) },
        data: { status: "CONFIRMEE" },
      });
    }

    return result;
  } catch (error) {
    console.error("Erreur lors du marquage du paiement par réservation comme réussi :", error);
    throw error;
  }
}

// 🔹 Supprimer un paiement
async function deletePayement(id) {
  try {
    const payement = await prisma.payement.delete({ where: { id } });
    return payement;
  } catch (error) {
    console.error("Erreur lors de la suppression du paiement :", error);
    throw error;
  }
}

// 🔹 Vérifier le statut d'un paiement
async function verifierStatus(id) {
  try {
    const payement = await prisma.payement.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!payement) throw new Error("Paiement non trouvé");
    return payement.status;
  } catch (error) {
    console.error("Erreur lors de la vérification du statut du paiement :", error);
    throw error;
  }
}

// 🔹 Récupérer le mode de paiement
async function getModePayement(id) {
  try {
    const payement = await prisma.payement.findUnique({
      where: { id },
      select: { modePayement: true },
    });
    if (!payement) throw new Error("Paiement non trouvé");
    return payement.modePayement;
  } catch (error) {
    console.error("Erreur lors de la récupération du mode de paiement :", error);
    throw error;
  }
}

module.exports = {
  getAllPayement,
  createPayement,
  updatePayement,
  updatePayementByReservationId,
  markPaymentAsSuccess,
  markPaymentByReservationAsSuccess,
  deletePayement,
  verifierStatus,
  getModePayement,
};