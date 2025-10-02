const { 
    getAllVisite, 
    createVisite, 
    updateVisite, 
    deleteVisite
} = require("../Service/visiteService");
const prisma = require("../utils/prisma");

exports.getAllVisiteController = async (req, res) => {
    try {
        const visite = await getAllVisite();
        res.json(visite);
    } catch (error) {
        console.error("Erreur lors de la récupération des visites :", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des visites." });
    }
};


exports.createVisiteController = async (req, res) => {
    try {
        const { 
            ville,
            dateVisite,
            ordreVisite,
            activiteId,
            hebergementId
        } = req.body;

        // Validation des champs obligatoires
        if (!ville || !dateVisite || !ordreVisite || !activiteId || !hebergementId) {
            return res.status(400).json({ 
                error: "Tous les champs sont obligatoires" 
            });
        }

        const dateVisiteObj = new Date(dateVisite);
        if (isNaN(dateVisiteObj.getTime())) {
            return res.status(400).json({ 
                error: "Format de date invalide. Utilisez le format YYYY-MM-DD ou ISO-8601" 
            });
        }

        const visiteData = {
            ville,
            dateVisite: dateVisiteObj.toISOString(),
            ordreVisite: Number(ordreVisite),
            activiteId: Number(activiteId),
            hebergementId: Number(hebergementId)
        };

        const nouvelleVisite = await createVisite(visiteData);
        res.status(201).json(nouvelleVisite);
    } catch (error) {
        console.error("Erreur détaillée:", error);
        res.status(500).json({ 
            error: "Erreur serveur lors de la création de la visite",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.updateVisiteController = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const visite = await updateVisite(Number(id), {
            ville: updateData.ville,
            dateVisite: updateData.dateVisite ? new Date(updateData.dateVisite) : undefined,
            ordreVisite: updateData.ordreVisite ? Number(updateData.ordreVisite) : undefined,
            activiteId: updateData.activiteId ? Number(updateData.activiteId) : undefined,
            hebergementId: updateData.hebergementId ? Number(updateData.hebergementId) : undefined
        });

        res.json(visite);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la visite :", error);
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour de la visite." });
    }
};

exports.deleteVisiteController = async (req, res) => {
    try {
        const { id } = req.params;
        const { force } = req.query;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ success: false, error: "ID de visite invalide" });
        }

        const result = await deleteVisite(Number(id), { force: force === 'true' });
        res.status(200).json(result);
    } catch (error) {
        const statusCode = error.code === 'NOT_FOUND' ? 404 : 400;
        res.status(statusCode).json({
            success: false,
            error: error.message,
            code: error.code,
            details: error.details
        });
    }
};
