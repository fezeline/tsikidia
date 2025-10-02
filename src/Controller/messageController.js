const {
  getAllMessage,
  createMessage,
  updateMessage,
  deleteMessage,
  getContenuMessage,
} = require("../Service/messageService");

exports.getAllMessageController = async (req, res) => {
  try {
    const messages = await getAllMessage();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la récupération des messages." });
  }
};

exports.createMessageController = async (req, res) => {
  try {
    const { contenuMessage, dateEnvoie, expediteurId, destinataireId } = req.body;

    if (!contenuMessage || !dateEnvoie || !expediteurId || !destinataireId) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    const message = await createMessage({
      contenuMessage,
      dateEnvoie: new Date(dateEnvoie),
      expediteurId: Number(expediteurId),
      destinataireId: Number(destinataireId),
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Erreur création message :", error);
    res.status(500).json({ error: "Impossible de créer le message" });
  }
};

exports.updateMessageController = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenuMessage, dateEnvoie, expediteurId, destinataireId } = req.body;

    const message = await updateMessage(Number(id), {
      contenuMessage,
      dateEnvoie: dateEnvoie ? new Date(dateEnvoie) : undefined,
      expediteurId: Number(expediteurId),
      destinataireId: Number(destinataireId),
    });

    res.json(message);
  } catch (error) {
    console.error("Erreur mise à jour message :", error);
    res.status(500).json({ error: "Impossible de mettre à jour le message" });
  }
};

exports.deleteMessageController = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await deleteMessage(Number(id));
    res.json(message);
  } catch (error) {
    console.error("Erreur suppression message :", error);
    res.status(500).json({ error: "Impossible de supprimer le message" });
  }
};

exports.getContenuMessageController = async (req, res) => {
  try {
    const { id } = req.params;
    const contenu = await getContenuMessage(Number(id));
    res.json({ contenuMessage: contenu });
  } catch (error) {
    console.error("Erreur récupération contenu message :", error);
    res.status(500).json({ error: "Impossible de récupérer le message" });
  }
};
