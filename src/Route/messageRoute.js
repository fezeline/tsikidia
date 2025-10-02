const express = require("express");

const {getAllMessageController,
     createMessageController, 
     updateMessageController, 
     deleteMessageController, 
     getContenuMessageController,
      } = require("../Controller/messageController"); 


const route = express.Router();

route.get("/", getAllMessageController);
route.post("/", createMessageController);
route.put("/:id", updateMessageController);
route.delete("/:id", deleteMessageController);
route.get("/:id/contenu", getContenuMessageController);   // Récupérer le contenu d’un message



module.exports = route;