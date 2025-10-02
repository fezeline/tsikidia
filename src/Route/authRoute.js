const express = require("express");
const route = express.Router();
const authController = require("../Controller/authController");

// Inscription
route.post("/register", authController.register);

// Connexion
route.post("/login", authController.login);


module.exports = route;
