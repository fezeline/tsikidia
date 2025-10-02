const express = require("express");

const { getAllReservationController,
     createReservationController,
      updateReservationController,
       deleteReservationController,
       confirmerController,
       annulerController,
       calculerMontantTotalController,
       verifierStatusController,
       calculerResteController,
        traiterExpirationController,
        confirmerPaiementController } = require("../Controller/reservationController"); 


const route = express.Router();

route.get("/", getAllReservationController);
route.post("/", createReservationController);
route.put("/:id", updateReservationController);
route.delete("/:id", deleteReservationController);
route.put('/:id/confirmer', confirmerController);
route.put('/:id/annuler', annulerController);
route.get('/:id/montant-total', calculerMontantTotalController);
route.get('/:id/status', verifierStatusController);
route.post('/:id/reste', calculerResteController);
route.post("/traiter-expiration", traiterExpirationController);
route.post("/:id/confirmer-paiement", confirmerPaiementController);

module.exports = route;