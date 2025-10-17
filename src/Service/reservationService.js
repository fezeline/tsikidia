const prisma = require("../utils/prisma");
const { updatePlacesDisponibles } = require("./offreService");

const StatusReservation = {
  EN_ATTENTE: "EN_ATTENTE",
  CONFIRMEE: "CONFIRMEE",
  ANNULEE: "ANNULEE",
  EXPIREE: "EXPIREE"
};


async function getAllReservation() {
  try {
    return await prisma.reservation.findMany({
      include: {
        utilisateur: true,
        offre: true
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations :", error);
    throw error;
  }
}

async function createReservation(reservationData) {
  try {
    // Vérifier la disponibilité
    const offre = await prisma.offre.findUnique({
      where: { id: parseInt(reservationData.offreId) }
    });

    if (!offre) {
      throw new Error("Offre non trouvée");
    }

    if (offre.placeDisponible < reservationData.nombrePers) {
      throw new Error("Places insuffisantes disponibles");
    }

    // Dates pour l'expiration
    const dateReservation = new Date();
    const dateExpiration = new Date(dateReservation.getTime() + 24 * 60 * 60 * 1000);

    // Vérification utilisateur
    const utilisateurExists = await prisma.utilisateur.findUnique({
      where: { id: reservationData.utilisateurId }
    });
    if (!utilisateurExists) {
      throw new Error(`L'utilisateur avec l'ID ${reservationData.utilisateurId} n'existe pas`);
    }

    // Créer la réservation avec statut "EN_ATTENTE"
    const reservation = await prisma.reservation.create({
      data: {
        nombrePers: parseInt(reservationData.nombrePers),
        dateReservation,
        prixParPersonne: parseFloat(reservationData.prixParPersonne),
        statut: "EN_ATTENTE", // Statut initial
        dateExpiration,
        utilisateurId: parseInt(reservationData.utilisateurId),
        offreId: parseInt(reservationData.offreId)
      },
      include: { 
        utilisateur: true, 
        offre: true 
      },
    });

    // ⭐⭐ IMPORTANT ⭐⭐ : Mettre à jour les places disponibles UNIQUEMENT si payé immédiatement
    // Si le statut est "CONFIRMEE" directement (paiement instantané)
    if (reservationData.statut === "CONFIRMEE") {
      await updatePlacesDisponibles(reservationData.offreId, reservationData.nombrePers);
      
      // Mettre à jour le statut de la réservation
      await prisma.reservation.update({
        where: { id: reservation.id },
        data: { 
          statut: "CONFIRMEE",
          dateExpiration: null // Supprimer l'expiration si confirmé
        }
      });
    }

    return reservation;
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    throw new Error("Impossible de créer la réservation: " + error.message);
  }
}

async function traiterExpiration() {
  try {
    const now = new Date();
    console.log("⏰ Vérification des réservations expirées à", now);

    const result = await prisma.reservation.updateMany({
      where: {
        statut: StatusReservation.EN_ATTENTE,
        dateExpiration: { lt: now },
      },
      data: {
        statut: StatusReservation.ANNULEE
      },
    });

    console.log("➡️ Résultat updateMany:", result);

    return result.count;
  } catch (error) {
    console.error("Erreur dans traiterExpiration:", error);
    throw error;
  }
}


async function confirmerPaiement(id) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(id) },
      include: { utilisateur: true, offre: true }
    });

    if (!reservation) throw new Error("Réservation non trouvée");

    const now = new Date();

    if (reservation.statut === "EN_ATTENTE") {
      if (reservation.dateExpiration < now) {
        await prisma.reservation.update({
          where: { id: parseInt(id) },
          data: {
            statut: "ANNULEE"
          }
        });
        throw new Error("Impossible de confirmer : la réservation a expiré");
      }

      // 1️⃣ Mettre à jour les places disponibles
      await updatePlacesDisponibles(reservation.offreId, reservation.nombrePers);

      // 2️⃣ Confirmer la réservation
      const updated = await prisma.reservation.update({
        where: { id: parseInt(id) },
        data: { 
          statut: "CONFIRMEE",
          dateExpiration: null // Supprime l'expiration si confirmé
        },
        include: { utilisateur: true, offre: true }
      });


      return updated;
    } else {
      throw new Error(`Impossible de confirmer : statut actuel "${reservation.statut}"`);
    }
  } catch (error) {
    console.error("Erreur lors de la confirmation par paiement :", error);
    throw error;
  }
}


async function updateReservation(id, updateReservation) {
  try {
    const existing = await prisma.reservation.findUnique({ where: { id: parseInt(id) } });
    if (!existing) throw new Error("Réservation non trouvée");

    const dataToUpdate = {};

    if (updateReservation.nombrePers !== undefined)
      dataToUpdate.nombrePers = updateReservation.nombrePers;

    if (updateReservation.dateReservation !== undefined)
      dataToUpdate.dateReservation = new Date(updateReservation.dateReservation);

    if (updateReservation.prixParPersonne !== undefined)
      dataToUpdate.prixParPersonne = updateReservation.prixParPersonne;

    if (updateReservation.statut !== undefined)
      dataToUpdate.statut = updateReservation.statut;

    if (updateReservation.utilisateurId !== undefined) {
      const userExists = await prisma.utilisateur.findUnique({
        where: { id: updateReservation.utilisateurId }
      });
      if (!userExists) throw new Error("Utilisateur non trouvé");
      dataToUpdate.utilisateur = { connect: { id: updateReservation.utilisateurId } };
    }

    if (updateReservation.offreId !== undefined) {
      const offreExists = await prisma.offre.findUnique({
        where: { id: updateReservation.offreId }
      });
      if (!offreExists) throw new Error("Offre non trouvée");
      dataToUpdate.offre = { connect: { id: updateReservation.offreId } };
    }

    return await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
      include: { utilisateur: true, offre: true }
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation:", error);
    throw error;
  }
}

async function deleteReservation(id) {
  try {
    return await prisma.reservation.delete({ where: { id: id } });
  } catch (error) {
    console.error("Erreur lors de la suppression de la réservation :", error);
    throw error;
  }
}

async function confirmer(id) {
  try {
    const reservation = await prisma.reservation.update({
      where: { id: id },
      data: { statut: "CONFIRMEE" },
      include: { utilisateur: true, offre: true }
    });
    return reservation.statut === "CONFIRMEE";
  } catch (error) {
    console.error("Erreur lors de la confirmation de la réservation :", error);
    throw error;
  }
}

async function annuler(id) {
  try {
    const reservation = await prisma.reservation.update({
      where: { id: id },
      data: { statut: "ANNULEE" },
      include: { utilisateur: true, offre: true }
    });
    return reservation.statut === "ANNULEE";
  } catch (error) {
    console.error("Erreur lors de l'annulation de la réservation :", error);
    throw error;
  }
}

async function calculerMontantTotal(id) {
  try {
    const reservation = await prisma.reservation.findUnique({ where: { id: id } });
    if (!reservation) throw new Error("Réservation non trouvée");
    return reservation.prixParPersonne * reservation.nombrePers;
  } catch (error) {
    console.error("Erreur lors du calcul du montant total :", error);
    throw error;
  }
}

async function verifierStatus(id) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: id },
      select: { statut: true }
    });
    if (!reservation) throw new Error("Réservation non trouvée");
    return reservation.statut;
  } catch (error) {
    console.error("Erreur lors de la vérification du statut :", error);
    throw error;
  }
}

async function calculerReste(id, montantPaye) {
  try {
    const reservation = await prisma.reservation.findUnique({ where: { id: id } });
    if (!reservation) throw new Error("Réservation non trouvée");

    const total = reservation.prixParPersonne * reservation.nombrePers;
    const reste = total - montantPaye;
    return reste > 0 ? reste : 0;
  } catch (error) {
    console.error("Erreur lors du calcul du reste à payer :", error);
    throw error;
  }
}

module.exports = {
  getAllReservation,
  createReservation,
  traiterExpiration,
  confirmerPaiement,
  updateReservation,
  deleteReservation,
  confirmer,
  annuler,
  calculerMontantTotal,
  verifierStatus,
  calculerReste
};
