const { getAllHebergement,
     createHebergement,
      updateHebergement,
       deleteHebergement,
       getcalculerTotalFrais } = require ("../Service/hebergementService");
const prisma = require("../utils/prisma");


exports.getAllHebergementController = async (req, res) => {
    try{
     const hebergement = await getAllHebergement()

    res.json(hebergement);
    } catch(error){
        console.error("Erreur lors de la récupération des hebergements :", error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des hebergements." });
    }
};

exports.createHebergementController = async (req, res) => {
    try{
       const data = req.body;
    const hebergement = await createHebergement(data)

    res.json(hebergement);
    } catch(error){
        console.error("Erreur lors de la création de l'hebergement :", error);
         res.status(500).json({ error: "Erreur serveur lors de la création de l'hebergement." });
    }
};


exports.updateHebergementController = async (req, res) => {
    try{
      const {id} = req.params;
    const updateData = req.body;

    console.log(updateData);

       const hebergement = await updateHebergement(Number(id), {
        nom: updateData.nom,
        adresse: updateData.adresse,
        etoile: updateData.etoile ? Number(updateData.etoile) : undefined,
        fraisParNuit: updateData.fraisParNuit ? Number(updateData.fraisParNuit) : undefined,
        nombreNuit: updateData.nombreNuit? Number(updateData.nombreNuit) : undefined,
    });


    res.json(hebergement);
    } catch(error){
        console.error("Erreur lors de la mise à jour de l'hebergement :", error);
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour de l'hebergement." });
    }
};

exports.deleteHebergementController = async (req, res) => {
   try{
      const {id} = req.params;
    console.log(id);

    const hebergement = await deleteHebergement(Number(id));

    res.json(hebergement);
   } catch(error){
         console.error("Erreur lors de la suppression de l'hebergement :", error);
         res.status(500).json({ error: "Erreur serveur lors de la suppression de l'hebergement." });
   }
};


exports.getcalculerTotalFraisController = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreNuit } = req.query; // 🔁 ici on lit depuis req.query

        if (!nombreNuit || isNaN(nombreNuit)) {
            return res.status(400).json({ error: "Le nombre de nuits est requis et doit être un nombre valide." });
        }

        const total = await getcalculerTotalFrais(Number(id), Number(nombreNuit));
        res.json({ total });
    } catch (error) {
        console.error("Erreur lors du calcul des frais :", error);
        res.status(500).json({ error: "Erreur serveur lors du calcul des frais." });
    }
};