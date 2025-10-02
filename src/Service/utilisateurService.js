const prisma = require ("../utils/prisma");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const config = require("../config/config.env")

const SECRET = config.JWT_SECRET;


async function getAllUtilisateur() {
   try{
     return await prisma.utilisateur.findMany();
   } catch(error){
      console.error("Erreur lors de la récupération des utilisateurs :", error);
        throw error;
   }
};

async function createUtilisateur(data) {
  try {
    if (!data.mot_de_passe) {
      throw new Error("Mot de passe requis pour créer l'utilisateur");
    }

    const hashedPassword = await bcrypt.hash(data.mot_de_passe, saltRounds);

    const utilisateur = await prisma.utilisateur.create({
      data: {
        nom: data.nom,
        email: data.email,
        mot_de_passe: hashedPassword,
        role: data.role,
        contact: data.contact,
      },
    });

    return utilisateur;
  } catch (error) {
    console.error("Erreur création utilisateur :", error);
    throw error;
  }
}


async function updateUtilisateur(id, data) {
  try {
    let updateData = { ...data };

    // Si mot de passe changé, le rehasher
    if (data.mot_de_passe) {
      updateData.mot_de_passe = await bcrypt.hash(data.mot_de_passe, 10);
    }

    const utilisateur = await prisma.utilisateur.update({
      where: { id },
      data: updateData,
    });

    return utilisateur;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    throw error;
  }
}

async function deleteUtilisateur(id) {
  try {
    const userId = Number(id); // Convertir au cas où
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: userId },
    });

    if (!utilisateur) throw new Error("Utilisateur introuvable");

    await prisma.utilisateur.delete({ where: { id: userId } });
    return utilisateur;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    throw error;
  }
}



// Authentication methods
async function connecter(email, mot_de_passe) {
  try {
    const utilisateur = await prisma.utilisateur.findFirst({ where: { email } });

    if (!utilisateur) {
      throw new Error("Email incorrect"); // ou "Email ou mot de passe incorrect" pour plus de sécurité
    }

    const isValid = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

    if (!isValid) {
      throw new Error("Mot de passe incorrect"); // message distinct
    }

    // Génération du token JWT...
    const token = jwt.sign(
      { id: utilisateur.id, role: utilisateur.role, email: utilisateur.email },
      SECRET,
      { expiresIn: "1d" }
    );

    return { utilisateur, token };
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error;
  }
}


async function deconnecter() {
  return { success: true, message: "Déconnexion réussie" };
}


// Business logic methods
async function reserverOffre(utilisateurId, offreId, nombrePers) {
    try {
        const reservation = await prisma.reservation.create({
            data: {
                utilisateurId,
                offreId,
                nombrePers,
                dateReservation: new Date(),
                estConfirm: false // ✅ valeur réelle (false ou true)
            },
            include: {
                offre: true
            }
        });
        return reservation;
    } catch (error) {
        console.error("Erreur lors de la réservation de l'offre :", error);
        throw error;
    }
}



async function commenterOffre(utilisateurId, offreId, contenuCommentaire, notes) {
    try {
        const commentaire = await prisma.commentaire.create({
            data: {
                contenuCommentaire: contenuCommentaire,
                utilisateurId: utilisateurId,
                offreId: offreId,
                dateCommentaire: new Date(),
                notes: notes // <-- valeur à fournir
            },
            include: {
                utilisateur: true,
                offre: true
            }
        });
        return commentaire;
    } catch(error) {
        console.error("Erreur lors de l'ajout du commentaire :", error);
        throw error;
    }
};


async function supprimerMessage(utilisateurId, messageId) {
    try {
        const message = await prisma.message.findFirst({
            where: {
                utilisateurId: utilisateurId,
                id: parseInt(messageId)
            }
        });

        if (!message) {
            throw new Error("Message non trouvé ou vous n'avez pas les droits");
        }

        return await prisma.message.delete({
            where: { id: parseInt(messageId) }
        });
    } catch (error) {
        console.error("Erreur lors de la suppression du message :", error);
        throw error;
    }
}



async function genererVoucher(payementId) {
  try {
    console.log("payementId reçu :", payementId);

    if (typeof payementId !== "number" || isNaN(payementId)) {
      throw new Error("payementId doit être un nombre valide");
    }

    const payement = await prisma.payement.findUnique({
      where: { id: payementId },
      include: { reservation: true }
    });

    if (!payement) {
      throw new Error("Paiement non trouvé");
    }

    const voucher = {
      code: `VOUCH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      dateCreation: new Date(),
      payementId: payementId,
      montant: payement.montantPaye
    };

    return voucher;
  } catch (error) {
    console.error("Erreur lors de la génération du voucher :", error);
    throw error;
  }
}



module.exports = {getAllUtilisateur,
                  createUtilisateur, 
                  updateUtilisateur,
                  deleteUtilisateur,
                  connecter,
                  deconnecter,
                  reserverOffre,
                  commenterOffre,
                  supprimerMessage,
                  genererVoucher};