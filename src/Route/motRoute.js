const express = require("express");
const MotController = require("../Controller/motController");

const route = express.Router();

// Route pour demander un lien de réinitialisation
route.post("/forgot-password", MotController.forgotPassword);

// Route pour changer le mot de passe avec le token
route.post("/reset-password/:token", MotController.resetPassword);

module.exports = route;
