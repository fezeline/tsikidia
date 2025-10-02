const { getAllOffre,
     createOffre,
      deleteOffre,
       updateOffre,
       verifierDisponibilite,
       filtrerOffre,
       updatePlacesDisponibles } = require ("../Service/offreService");

exports.getAllOffreController = async (req, res) => {
   try{
    const offre = await getAllOffre()
    res.json(offre);
    }catch(error){
        console.error("Erreur lors de la récupération des offres :", error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des offres." });
    }
} 


exports.createOffreController = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug logging
    
    if (!req.body) {
      return res.status(400).json({ 
        error: "Aucune donnée reçue dans le corps de la requête" 
      });
    }

    const data = req.body;

    // Champs obligatoires
    const champsRequis = [
      'titreOffre', 
      'prixParPers', 
      'dateDepart', 
      'dateRetour',
      'descriptionOffre', 
      'duree', 
      'placeDisponible',
      'imagePrincipale'  // ✅ ajout de l'image
    ];

    const champsManquants = champsRequis.filter(champ => !data[champ]);

    if (champsManquants.length > 0) {
      return res.status(400).json({ 
        error: `Champs obligatoires manquants: ${champsManquants.join(', ')}` 
      });
    }

    // Appel du service
    const offre = await createOffre(data);

    res.status(201).json({
      success: true,
      message: "Offre créée avec succès",
      data: offre
    });
  } catch (error) {
    console.error("Erreur controller détaillée:", error);
    res.status(500).json({ 
      error: "Erreur serveur lors de la création de l'offre",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};




exports.updateOffreController = async (req, res) => {
    try{
      const {id} = req.params;
      const updateData = req.body;

      // Conversion des IDs de relations si présents
      if (updateData.visiteId !== undefined) {
        updateData.visiteId = updateData.visiteId ? Number(updateData.visiteId) : null;
      }
      if (updateData.voitureId !== undefined) {
        updateData.voitureId = updateData.voitureId ? Number(updateData.voitureId) : null;
      }
     
      const offre = await updateOffre(id, updateData);
      res.json(offre);
    } catch(error){
        console.error("Erreur lors de la mise à jour de l'offre :", error);
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour de l'offre." });
    }
};

exports.deleteOffreController = async (req, res) => {
    try{
     const {id} = req.params;
    const offre = await deleteOffre(id);
    res.json({ message: "Offre supprimée avec succès", offre });
    } catch(error){
        console.error("Erreur lors de la suppression de l'offre :", error);
        res.status(500).json({ error: "Erreur serveur lors de la suppression de l'offre." });
    }
};


exports.verifierDisponibiliteController = async (req, res) => {
    try {
        const {offreId} = req.params;
        const disponible = await verifierDisponibilite(offreId);
        res.json({ disponible, offreId });
    } catch(error) {
        console.error("Erreur dans verifierDisponibiliteController :", error);
        res.status(500).json({ error: error.message });
    }
};

exports.filtrerOffreController = async (req, res) => {
  try {
    const { prixMax } = req.query; // Utilisation de query params plutôt que params
    if (!prixMax) {
        return res.status(400).json({ error: "Le paramètre prixMax est requis" });
    }

    const offresFiltrees = await filtrerOffre(prixMax);
    res.status(200).json(offresFiltrees);
  } catch (error) {
    console.error("Erreur dans filtrerOffreController :", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updatePlacesDisponiblesController = async (req, res) => {
    try {

       console.log("req.body:", req.body); // <- Ajoute ce log
        const { offreId } = req.params;
        const { placesReservees } = req.body || {}; // <-- protège si req.body undefined

        if (!placesReservees || placesReservees <= 0) {
            return res.status(400).json({ error: "Nombre de places réservées invalide" });
        }

        const updatedOffre = await updatePlacesDisponibles(offreId, placesReservees);
        res.json({ success: true, message: "Places mises à jour", data: updatedOffre });
    } catch (error) {
        console.error("Erreur dans updatePlacesDisponiblesController :", error);
        res.status(500).json({ error: error.message });
    }
};
