const express = require("express");

const {getAllVisiteController,
     createVisiteController,
      updateVisiteController,
       deleteVisiteController
       } = require("../Controller/visiteController"); 


const route = express.Router();

route.get("/", getAllVisiteController);
route.post("/", createVisiteController);
route.put("/:id", updateVisiteController);
route.delete("/:id", deleteVisiteController);



module.exports = route;