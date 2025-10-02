const {
  getAllReservation,
  createReservation,
  traiterExpiration,
  confirmerPaiement,
  updateReservation,
  deleteReservation,
  calculerMontantTotal,
  verifierStatus,
  calculerReste,
  confirmer,
  annuler 
} = require("../Service/reservationService");
const prisma = require("../utils/prisma");

// 🎯 GET ALL RESERVATIONS
exports.getAllReservationController = async (req, res) => {
  try {
    const reservations = await getAllReservation();
    res.json(reservations);
  } catch(error) {
    console.error("Erreur lors de la récupération des réservations :", error);
    res.status(500).json({ 
      error: "Erreur serveur lors de la récupération des réservations.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🎯 CREATE RESERVATION (AMÉLIORÉ)
exports.createReservationController = async (req, res) => {
  try {
    // Validation des champs requis
    const { utilisateurId, offreId, nombrePers, dateReservation, prixParPersonne } = req.body;
    
    if (!utilisateurId || !offreId || !nombrePers || !dateReservation || !prixParPersonne) {
      return res.status(400).json({
        error: "Champs manquants: utilisateurId, offreId, nombrePers, dateReservation, prixParPersonne sont requis"
      });
    }

    const data = {
      ...req.body,
      dateReservation: new Date(dateReservation),
      utilisateurId: parseInt(utilisateurId),
      offreId: parseInt(offreId),
      nombrePers: parseInt(nombrePers),
      prixParPersonne: parseFloat(prixParPersonne)
    };

    // Validation de la date
    if (isNaN(data.dateReservation.getTime())) {
      return res.status(400).json({ error: "Format de date invalide" });
    }

    const nouvelleReservation = await createReservation(data);
    res.status(201).json({
      message: "Réservation créée avec succès",
      reservation: nouvelleReservation
    });
  } catch(error) {
    console.error("Erreur détaillée création réservation :", error);
    
    // Gestion d'erreurs spécifiques
    if (error.message.includes("n'existe pas")) {
      return res.status(404).json({ error: error.message });
    }
    
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: "Données invalides: utilisateur ou offre non trouvé" 
      });
    }

    res.status(500).json({ 
      error: "Erreur serveur lors de la création de la réservation.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🎯 TRAITEMENT EXPIRATION (AMÉLIORÉ AVEC EMAIL)
exports.traiterExpirationController = async (req, res) => {
  try {
    const reservationsExpirees = await traiterExpiration(); // modifié pour retourner les réservations expirées

    res.json({ 
      message: `${reservationsExpirees.length} réservation(s) expirée(s) traitées avec succès et notifications envoyées`,
      count: reservationsExpirees.length
    });
  } catch(error) {
    console.error("Erreur lors du traitement des expirations :", error);
    res.status(500).json({ 
      error: "Erreur serveur lors du traitement des expirations.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🎯 CONFIRMER PAIEMENT (OPTIMISÉ POUR L'EXPIRATION ET DEBUG)
exports.confirmerPaiementController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de réservation invalide" });
    }

    const reservationId = Number(id);

    // 🔹 Récupérer réservation avec offre et utilisateur
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { offre: true, utilisateur: true }
    });
    console.log("Réservation trouvée:", reservation);

    if (!reservation) return res.status(404).json({ error: "Réservation introuvable" });

    // 🔹 Vérifier expiration
    const now = new Date();
    if (reservation.statut === "EN_ATTENTE" && reservation.dateExpiration < now) {
      await prisma.reservation.update({
        where: { id: reservationId },
        data: {
          statut: "ANNULEE",
          raisonAnnulation: "Tentative de paiement après expiration"
        }
      });
      return res.status(400).json({
        error: "Impossible de confirmer le paiement : la réservation a expiré",
        statut: "ANNULEE"
      });
    }

    // 🔹 Vérifier qu'un paiement est en attente
    const payement = await prisma.payement.findFirst({
      where: { reservationId, status: "EN_ATTENTE" }
    });
    console.log("Paiement en attente:", payement);

    if (!payement) {
      return res.status(400).json({ error: "Aucun paiement en attente pour cette réservation" });
    }

    // 🔹 Transaction pour confirmer paiement, réservation et mettre à jour les places
    const [updatedPayement, updatedReservation, updatedOffre] = await prisma.$transaction([
      prisma.payement.update({
        where: { id: payement.id },
        data: { status: "SUCCES" }
      }),
      prisma.reservation.update({
        where: { id: reservationId },
        data: { statut: "CONFIRMEE" },
        include: { utilisateur: true, offre: true }
      }),
      prisma.offre.update({
        where: { id: reservation.offre.id },
        data: { placeDisponible: reservation.offre.placeDisponible - reservation.nombrePers }
      })
    ]);

    res.json({
      message: "Paiement confirmé, réservation mise à jour et places disponibles ajustées",
      reservation: updatedReservation,
      payement: updatedPayement,
      offre: updatedOffre
    });

  } catch(error) {
    console.error("Erreur lors de la confirmation par paiement :", error);
    res.status(500).json({
      error: "Erreur serveur lors de la confirmation par paiement.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// 🎯 UPDATE RESERVATION (AVEC VÉRIFICATION D'EXPIRATION)
exports.updateReservationController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de réservation invalide" });
    }

    const reservationId = Number(id);

    // Vérifier que la réservation n'est pas expirée
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId }
    });

    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    const now = new Date();
    if (reservation.statut === "EN_ATTENTE" && reservation.dateExpiration < now) {
      return res.status(400).json({ 
        error: "Impossible de modifier : la réservation a expiré",
        statut: "ANNULEE"
      });
    }

    const updateData = {
      ...req.body,
      dateReservation: req.body.dateReservation ? new Date(req.body.dateReservation) : undefined
    };

    const reservationMaj = await updateReservation(reservationId, updateData);
    res.status(200).json({
      message: "Réservation mise à jour avec succès",
      reservation: reservationMaj
    });
  } catch(error) {
    console.error("Erreur lors de la mise à jour de la réservation :", error);
    
    if (error.message.includes("non trouvé") || error.message.includes("non trouvée")) {
      return res.status(404).json({ error: error.message });
    }

    if (error.message.includes("expiré")) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ 
      error: "Erreur serveur lors de la mise à jour de la réservation.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🎯 DELETE RESERVATION
exports.deleteReservationController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de réservation invalide" });
    }

    const reservation = await deleteReservation(Number(id));
    res.json({
      message: "Réservation supprimée avec succès",
      reservation: reservation
    });
  } catch(error) {
    console.error("Erreur lors de la suppression de la réservation :", error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    res.status(500).json({ 
      error: "Erreur serveur lors de la suppression de la réservation.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🎯 CONFIRMER RESERVATION (AVEC VÉRIFICATION D'EXPIRATION)
exports.confirmerController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de réservation invalide" });
    }

    const reservationId = Number(id);

    // Vérifier que la réservation n'est pas expirée
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId }
    });

    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    const now = new Date();
    if (reservation.statut === "EN_ATTENTE" && reservation.dateExpiration < now) {
      return res.status(400).json({ 
        error: "Impossible de confirmer : la réservation a expiré",
        statut: "ANNULEE"
      });
    }

    const isConfirmed = await confirmer(reservationId);
    res.json({
      message: "Réservation confirmée avec succès",
      confirmed: isConfirmed
    });
  } catch(error) {
    console.error("Erreur lors de la confirmation de la réservation :", error);
    
    if (error.message.includes("expiré")) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ 
      error: "Erreur serveur lors de la confirmation de la réservation.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🎯 ANNULER RESERVATION
exports.annulerController = async (req, res) => {
  try {
    const { id } = req.params;
    const { raison } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de réservation invalide" });
    }

    const reservationId = Number(id);

    // Si une raison est fournie, mettre à jour avec la raison
    if (raison) {
      await prisma.reservation.update({
        where: { id: reservationId },
        data: { 
          statut: "ANNULEE",
          raisonAnnulation: raison 
        }
      });
    } else {
      await annuler(reservationId);
    }

    res.json({
      message: "Réservation annulée avec succès",
      cancelled: true
    });
  } catch(error) {
    console.error("Erreur lors de l'annulation de la réservation :", error);
    res.status(500).json({ 
      error: "Erreur serveur lors de l'annulation de la réservation.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🎯 CALCULER MONTANT TOTAL
exports.calculerMontantTotalController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de réservation invalide" });
    }

    const montantTotal = await calculerMontantTotal(Number(id));
    res.json({ 
      montantTotal,
      devise: "EUR"
    });
  } catch(error) {
    console.error("Erreur lors du calcul du montant total :", error);
    
    if (error.message.includes("non trouvée")) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ 
      error: "Erreur serveur lors du calcul du montant total.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🎯 VERIFIER STATUS
exports.verifierStatusController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de réservation invalide" });
    }

    const status = await verifierStatus(Number(id));
    res.json({ status });
  } catch(error) {
    console.error("Erreur lors de la vérification du statut :", error);
    
    if (error.message.includes("non trouvée")) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ 
      error: "Erreur serveur lors de la vérification du statut.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🎯 CALCULER RESTE
exports.calculerResteController = async (req, res) => {
  try {
    const { id } = req.params;
    const { montantPaye } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de réservation invalide" });
    }

    if (!montantPaye || isNaN(Number(montantPaye))) {
      return res.status(400).json({ error: "Montant payé invalide" });
    }

    const reste = await calculerReste(Number(id), Number(montantPaye));
    res.json({ 
      reste,
      devise: "EUR"
    });
  } catch(error) {
    console.error("Erreur lors du calcul du reste à payer :", error);
    
    if (error.message.includes("non trouvée")) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ 
      error: "Erreur serveur lors du calcul du reste à payer.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🎯 NOUVEAU: VÉRIFIER EXPIRATION D'UNE RÉSERVATION SPÉCIFIQUE
exports.verifierExpirationController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID de réservation invalide" });
    }

    const reservationId = Number(id);
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { utilisateur: true, offre: true }
    });

    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    const now = new Date();
    const estExpiree = reservation.statut === "EN_ATTENTE" && reservation.dateExpiration < now;
    const tempsRestant = estExpiree ? 0 : Math.max(0, reservation.dateExpiration - now);

    res.json({
      reservation: {
        id: reservation.id,
        statut: reservation.statut,
        dateExpiration: reservation.dateExpiration,
        estExpiree,
        tempsRestantMs: tempsRestant,
        tempsRestantHeures: Math.floor(tempsRestant / (1000 * 60 * 60)),
        tempsRestantMinutes: Math.floor((tempsRestant % (1000 * 60 * 60)) / (1000 * 60))
      }
    });
  } catch(error) {
    console.error("Erreur lors de la vérification d'expiration :", error);
    res.status(500).json({ 
      error: "Erreur serveur lors de la vérification d'expiration.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};