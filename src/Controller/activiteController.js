const { getAllActivite,
     createActivite,
      updateActivite,
       deleteActivite } = require ("../Service/activiteService");
const prisma = require("../utils/prisma");


exports.getAllActiviteController = async (req, res) => {
   try{
     const activite = await getAllActivite()

     res.json(activite);
   } catch(error){
       console.error("Erreur lors de la récupération des activites :", error);
       res.status(500).json({ message: "Erreur serveur." });
   }
};

exports.createActiviteController = async (req, res) => {
    try {
        const { 
            descriptionActivite,
            dateActivite,
            lieuActivite
        } = req.body;

        // Validation
        if (!descriptionActivite || !dateActivite || !lieuActivite ) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires" });
        }

        // Conversion de la date
        const dateObj = new Date(dateActivite);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({ error: "Format de date invalide" });
        }

        const activiteData = {
            descriptionActivite,
            dateActivite: dateObj,
            lieuActivite
        };

        const nouvelleActivite = await createActivite(activiteData);
        res.status(201).json(nouvelleActivite);
    } catch(error) {
        console.error("Erreur détaillée:", error);
        res.status(500).json({ 
            error: "Erreur serveur lors de la création de l'activité",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.updateActiviteController = async (req, res) => {
    try{
       const {id} = req.params;
       const updateData = req.body;

       console.log(updateData);

       const activite = await updateActivite(Number(id), {
        descriptionActivite: updateData.descriptionActivite,
        dateActivite: updateData.dateActivite ? new Date(updateData.dateActivite) : undefined,
        lieuActivite: updateData.lieuActivite,
    });

    res.json(activite); 
    } catch(error){
        console.error("Erreur lors de la mise à jour de l'activite :", error);
        res.status(400).json({ message: "Erreur lors de la mise à jour." });
    }
};

exports.deleteActiviteController = async (req, res) => {
    try{
      const {id} = req.params;
    console.log(id);

    const activite = await deleteActivite(Number(id));

    res.json(activite);
    } catch(error){
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ error: "Erreur serveur lors de la suppression" });
    }
};