const {
  getAllPayement,
  createPayement,
  updatePayement,
  updatePayementByReservationId,
  markPaymentAsSuccess,
  markPaymentByReservationAsSuccess,
  deletePayement,
  verifierStatus,
  getModePayement,
} = require("../Service/payementService");

const prisma = require("../utils/prisma");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// ---------------- CONTROLLERS ----------------

// Récupérer tous les paiements
exports.getAllPayementController = async (req, res) => {
  try {
    const payements = await getAllPayement();
    res.json(payements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des paiements." });
  }
};

// Créer un paiement avec Stripe
exports.createPayementController = async (req, res) => {
  try {
    const data = req.body;
    if (!data.montant || !data.utilisateurId) {
      return res.status(400).json({ error: "Montant et utilisateurId sont obligatoires." });
    }

    // Créer PaymentIntent Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.montant * 100), // montant en centimes
      currency: "eur",
      description: data.description || "Paiement réservation",
      metadata: {
        utilisateurId: data.utilisateurId.toString(),
        reservationId: data.reservationId?.toString() || "",
      },
      automatic_payment_methods: { enabled: true },
    });

    // Sauvegarder en DB avec statut "EN_ATTENTE"
    const payement = await createPayement({
      montant: data.montant,
      modePayement: "STRIPE",
      status: "EN_ATTENTE",
      description: data.description || "",
      utilisateurId: data.utilisateurId,
      reservationId: data.reservationId || null,
      stripePaymentIntentId: paymentIntent.id,
    });

    res.json({
      message: "Paiement créé",
      clientSecret: paymentIntent.client_secret,
      payement,
    });
  } catch (error) {
    console.error("Erreur lors de la création du paiement :", error);
    res.status(500).json({ error: "Erreur serveur lors de la création du paiement." });
  }
};

// Mettre à jour un paiement
exports.updatePayementController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const payement = await updatePayement(Number(id), updateData);
    res.json(payement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de la mise à jour du paiement." });
  }
};

// Confirmer manuellement un paiement réussi
exports.confirmPaymentSuccessController = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { stripePaymentIntentId } = req.body;

    const payement = await markPaymentAsSuccess(Number(paymentId), stripePaymentIntentId);
    
    res.json({
      message: "Paiement confirmé avec succès",
      payement
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de la confirmation du paiement." });
  }
};

// Confirmer un paiement réussi par réservation ID
exports.confirmPaymentByReservationController = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { stripePaymentIntentId } = req.body;

    const result = await markPaymentByReservationAsSuccess(Number(reservationId), stripePaymentIntentId);
    
    if (result.count === 0) {
      return res.status(404).json({ error: "Aucun paiement en attente trouvé pour cette réservation" });
    }

    res.json({
      message: "Paiement confirmé avec succès",
      updatedCount: result.count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de la confirmation du paiement." });
  }
};

// Vérifier et mettre à jour le statut d'un paiement depuis Stripe
exports.verifierStatusController = async (req, res) => {
  try {
    const { id } = req.params;

    const payement = await prisma.payement.findUnique({
      where: { id: Number(id) },
    });

    if (!payement) {
      return res.status(404).json({ error: "Paiement introuvable." });
    }

    // Si le paiement est déjà en SUCCES, retourner directement
    if (payement.status === "SUCCES") {
      return res.json({ status: "SUCCES" });
    }

    // Vérifier l'état auprès de Stripe si c'est un paiement Stripe
    if (payement.stripePaymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(payement.stripePaymentIntentId);

      let nouveauStatut = payement.status;
      
      if (paymentIntent.status === "succeeded") {
        // Paiement réussi chez Stripe, mettre à jour en SUCCES
        await markPaymentAsSuccess(payement.id, payement.stripePaymentIntentId);
        nouveauStatut = "SUCCES";
        
      } else if (paymentIntent.status === "requires_payment_method" || 
                 paymentIntent.status === "canceled" ||
                 paymentIntent.status === "requires_action") {
        nouveauStatut = "ECHEC";
        
        // Mettre à jour seulement le statut du paiement
        await prisma.payement.update({
          where: { id: payement.id },
          data: { status: nouveauStatut },
        });
      }

      res.json({ status: nouveauStatut });
    } else {
      // Pour les paiements non-Stripe, retourner le statut actuel
      res.json({ status: payement.status });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de la vérification du statut." });
  }
};

// Traiter le succès d'un paiement côté client
exports.handlePaymentSuccessController = async (req, res) => {
  try {
    const { paymentIntentId, reservationId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "paymentIntentId est requis" });
    }

    // Vérifier le statut du paiement avec Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      let result;
      
      if (reservationId) {
        // Mettre à jour par réservation ID
        result = await markPaymentByReservationAsSuccess(Number(reservationId), paymentIntentId);
      } else {
        // Trouver le paiement par stripePaymentIntentId
        const payement = await prisma.payement.findFirst({
          where: { stripePaymentIntentId: paymentIntentId }
        });
        
        if (payement) {
          result = await markPaymentAsSuccess(payement.id, paymentIntentId);
        } else {
          return res.status(404).json({ error: "Paiement non trouvé" });
        }
      }

      res.json({
        message: "Paiement traité avec succès",
        status: "SUCCES",
        details: result
      });
    } else {
      res.status(400).json({
        error: "Paiement non réussi",
        status: paymentIntent.status
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors du traitement du paiement." });
  }
};

// Supprimer un paiement
exports.deletePayementController = async (req, res) => {
  try {
    const { id } = req.params;
    const payement = await deletePayement(Number(id));
    res.json(payement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de la suppression du paiement." });
  }
};

// Récupérer le mode de paiement
exports.getModePayementController = async (req, res) => {
  try {
    const { id } = req.params;
    const modePayement = await getModePayement(Number(id));
    res.json({ modePayement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération du mode de paiement." });
  }
};