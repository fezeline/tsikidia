const express = require("express");

const { getAllActiviteController,
     createActiviteController,
      updateActiviteController,
       deleteActiviteController } = require("../Controller/activiteController"); 


const route = express.Router();

route.get("/", getAllActiviteController);
route.post("/", createActiviteController);
route.put("/:id", updateActiviteController);
route.delete("/:id", deleteActiviteController);


module.exports = route;