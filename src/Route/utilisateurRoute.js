const express = require("express");

const {getAllUtilisateurController,
      createUtilisateurController,
      updateUtilisateurController,
      deleteUtilisateurController,
      commenterOffreController,
      supprimerMessageController,
      genererVoucherController,
      connecterController,
      deconnecterController,
      reserverOffreController} =require ("../Controller/utilisateurController");
const verifyToken = require("../Middleware/authmiddleware");

const route = express.Router();

route.get("/", getAllUtilisateurController);
route.post("/", createUtilisateurController);
route.put("/:id",verifyToken, updateUtilisateurController);
route.delete("/:id",verifyToken, deleteUtilisateurController);
// Auth Routes
route.post("/login", connecterController);
route.post("/logout",verifyToken, deconnecterController);
// Business Logic Routes
route.post("/:id/reservations",verifyToken, reserverOffreController);
route.post("/:id/commentaires",verifyToken, commenterOffreController);
route.delete("/messages/:id",verifyToken, supprimerMessageController);
route.get("/payements/:id/voucher",verifyToken, genererVoucherController);

module.exports = route;