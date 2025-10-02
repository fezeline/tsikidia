const express = require("express");

const { getAllOffreController,
     createOffreController,
      updateOffreController,
       deleteOffreController,
       verifierDisponibiliteController,
       filtrerOffreController,
       updatePlacesDisponiblesController
        } = require("../Controller/offreController"); 


const route = express.Router();

route.get("/", getAllOffreController);
route.post("/", createOffreController);
route.put("/:id", updateOffreController);
route.delete("/:id", deleteOffreController);
route.get('/:offreId/disponibilite', verifierDisponibiliteController);
route.get("/filtrer/:prixMax", filtrerOffreController);
route.put("/:id/places", updatePlacesDisponiblesController)


module.exports = route;