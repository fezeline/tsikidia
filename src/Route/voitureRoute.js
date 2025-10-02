const express = require("express");

const { getAllVoitureController, 
    createVoitureController, 
    updateVoitureController,
     deleteVoitureController,getCalculerCoutTotalVoitureController } = require("../Controller/voitureController"); 


const route = express.Router();

route.get("/", getAllVoitureController);
route.post("/", createVoitureController);
route.put("/:id", updateVoitureController);
route.delete("/:id", deleteVoitureController);
route.get("/:id/cout-total", getCalculerCoutTotalVoitureController);


module.exports = route;