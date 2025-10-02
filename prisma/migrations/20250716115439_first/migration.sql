-- CreateTable
CREATE TABLE `Offre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titre0ffre` VARCHAR(191) NOT NULL,
    `prixParPers` DOUBLE NOT NULL,
    `dateDepart` DATETIME(3) NOT NULL,
    `dateRetour` DATETIME(3) NOT NULL,
    `descriptionOffre` VARCHAR(191) NOT NULL,
    `duree` VARCHAR(191) NOT NULL,
    `placeDisponible` INTEGER NOT NULL,
    `imagePrincipale` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Visite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ville` VARCHAR(191) NOT NULL,
    `dateVisite` DATETIME(3) NOT NULL,
    `ordreVisite` INTEGER NOT NULL,
    `offreId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Activite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descriptionActivite` VARCHAR(191) NOT NULL,
    `heureActivite` DATETIME(3) NOT NULL,
    `lieuActivite` VARCHAR(191) NOT NULL,
    `visiteId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Voiture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `immatriculation` VARCHAR(191) NOT NULL,
    `marque` VARCHAR(191) NOT NULL,
    `modele` VARCHAR(191) NOT NULL,
    `coutParJours` DOUBLE NOT NULL,
    `capacite` INTEGER NOT NULL,
    `offreId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Commentaire` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateCommentaire` DATETIME(3) NOT NULL,
    `contenuCommentaire` VARCHAR(191) NOT NULL,
    `notes` DOUBLE NOT NULL,
    `offreId` INTEGER NOT NULL,
    `utilisateurId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hebergement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `adresse` VARCHAR(191) NOT NULL,
    `etoile` INTEGER NOT NULL,
    `fraisParNuit` DOUBLE NOT NULL,
    `visiteId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombrePers` INTEGER NOT NULL,
    `dateReservation` DATETIME(3) NOT NULL,
    `montantTotal` DOUBLE NOT NULL,
    `estConfirm` BOOLEAN NOT NULL,
    `utilisateurId` INTEGER NOT NULL,
    `offreId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `montantPaye` DOUBLE NOT NULL,
    `datePayement` DATETIME(3) NOT NULL,
    `statusPayement` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NOT NULL,
    `reservationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Visite` ADD CONSTRAINT `Visite_offreId_fkey` FOREIGN KEY (`offreId`) REFERENCES `Offre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activite` ADD CONSTRAINT `Activite_visiteId_fkey` FOREIGN KEY (`visiteId`) REFERENCES `Visite`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Voiture` ADD CONSTRAINT `Voiture_offreId_fkey` FOREIGN KEY (`offreId`) REFERENCES `Offre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commentaire` ADD CONSTRAINT `Commentaire_offreId_fkey` FOREIGN KEY (`offreId`) REFERENCES `Offre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commentaire` ADD CONSTRAINT `Commentaire_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hebergement` ADD CONSTRAINT `Hebergement_visiteId_fkey` FOREIGN KEY (`visiteId`) REFERENCES `Visite`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_offreId_fkey` FOREIGN KEY (`offreId`) REFERENCES `Offre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payement` ADD CONSTRAINT `Payement_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
