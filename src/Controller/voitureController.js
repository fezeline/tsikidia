const {getAllVoiture,getCalculerCoutTotalVoiture, createVoiture, updateVoiture, deleteVoiture} = require ("../Service/voitureService");
const prisma = require("../utils/prisma");


exports.getAllVoitureController = async (req, res) => {
    try {
        const voitures = await getAllVoiture();
        res.status(200).json(voitures); // Corrigez res.sta en res.status
    } catch(error) {
        console.error("Erreur lors de la récupération des voitures :", error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des voitures." });
    }
}

exports.getCalculerCoutTotalVoitureController = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreJours } = req.query;

        if (!nombreJours) {
            return res.status(400).json({ message: "Le paramètre 'nombreJours' est requis." });
        }

        const result = await getCalculerCoutTotalVoiture(Number(id), Number(nombreJours));

        res.status(200).json(result);
    } catch (error) {
        console.error("Erreur lors du calcul du coût total :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};


exports.createVoitureController = async (req, res) => {
    try{
        const data = req.body;
        const voiture = await createVoiture(data)

        res.status(201).json(voiture);

    }catch(error){
        console.error("Erreur lors de la création de la voiture :", error);
        res.status(400).json({ message: "Erreur lors de la création de la voiture." });
    }
};

exports.updateVoitureController = async (req, res) => {
    try{
       const {id} = req.params;
       const updateData = req.body;

       console.log(updateData);

        const voiture = await updateVoiture(Number(id), {
        immatriculation: updateData.immatriculation,
        marque: updateData.marque,
        modele: updateData.modele, 
        coutParJours: updateData.coutParJours? Number(updateData.coutParJours) : undefined,
        nombreJours: updateData.nombreJours?Number(updateData.nombreJours) : undefined,
        capacite: updateData.capacite ?Number(updateData.capacite) : undefined,
    });

    res.status(200).json(voiture);

    }catch(error){
        console.error("Erreur lors de la mise à jour de la voiture :", error);
        res.status(400).json({ message: "Erreur lors de la mise à jour." });
    }

    
};

exports.deleteVoitureController = async (req, res) => {
  try {
    const { id } = req.params; // ✅ on récupère l'id depuis l'URL
    const voiture = await deleteVoiture(Number(id)); // conversion en nombre
    res.status(200).json(voiture);
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ error: "Erreur serveur lors de la suppression" });
  }
};
