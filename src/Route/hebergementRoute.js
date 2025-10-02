const express = require("express");

const { getAllHebergementController,
     createHebergementController,
      updateHebergementController, 
      deleteHebergementController, 
      getcalculerTotalFraisController} = require("../Controller/hebergementController"); 


const route = express.Router();

route.get("/", getAllHebergementController);
route.post("/", createHebergementController);
route.put("/:id", updateHebergementController);
route.delete("/:id", deleteHebergementController);
route.get("/:id/calculer-total", getcalculerTotalFraisController);


module.exports = route;