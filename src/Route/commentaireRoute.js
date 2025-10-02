const express = require("express");

const {getAllCommentaireController,
    createCommentaireController,
     updateCommentaireController,
      deleteCommentaireController} = require("../Controller/commentaireController"); 


const route = express.Router();

route.get("/", getAllCommentaireController);
route.post("/", createCommentaireController);
route.put("/:id", updateCommentaireController);
route.delete("/:id", deleteCommentaireController);


module.exports = route;