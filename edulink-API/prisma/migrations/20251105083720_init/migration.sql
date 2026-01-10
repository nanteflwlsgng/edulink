-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ETUDIANT', 'ECOLE');

-- CreateEnum
CREATE TYPE "Statut" AS ENUM ('ACTIF', 'INACTIF', 'SUSPENDU', 'EN_ATTENTE');

-- CreateEnum
CREATE TYPE "StatutInscription" AS ENUM ('EN_ATTENTE', 'VALIDEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "StatutPaiement" AS ENUM ('EN_ATTENTE', 'PAYE', 'ECHEC', 'ANNULE', 'REMBOURSE');

-- CreateEnum
CREATE TYPE "TypePaiement" AS ENUM ('MOBILE_MONEY', 'CARTE');

-- CreateEnum
CREATE TYPE "FormationStatut" AS ENUM ('EN_ATTENTE', 'ACTIF', 'INACTIF', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "TypeAdmission" AS ENUM ('DIRECT', 'DOSSIER', 'CONCOURS', 'MIXTE');

-- CreateEnum
CREATE TYPE "RaisonPaiement" AS ENUM ('INSCRIPTION', 'DROIT_CONCOURS', 'FRAIS_GENERAUX', 'FRAIS_FORMATION', 'AUTRE');

-- CreateEnum
CREATE TYPE "MethodePaiement" AS ENUM ('CARTE', 'MOBILE_MONEY', 'ESPECES', 'VIREMENT');

-- CreateEnum
CREATE TYPE "ModePaiement" AS ENUM ('UNIQUE', 'MENSUEL', 'TRANCHE', 'GRATUIT');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id_utilisateur" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "statut" "Statut" NOT NULL DEFAULT 'ACTIF',

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateTable
CREATE TABLE "Etudiant" (
    "id_etudiant" SERIAL NOT NULL,
    "date_naissance" TIMESTAMP(3),
    "adresse" TEXT,
    "telephone" TEXT,
    "id_utilisateur" INTEGER NOT NULL,

    CONSTRAINT "Etudiant_pkey" PRIMARY KEY ("id_etudiant")
);

-- CreateTable
CREATE TABLE "ecoles" (
    "id_ecole" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "id_utilisateur" INTEGER NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_validation" TIMESTAMP(3),
    "description" TEXT,
    "logo" TEXT,
    "site_web" TEXT,

    CONSTRAINT "ecoles_pkey" PRIMARY KEY ("id_ecole")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id_admin" SERIAL NOT NULL,
    "id_utilisateur" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "Formation" (
    "id_formation" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "duree" INTEGER,
    "prix" DECIMAL(65,30),
    "nbr_max_etudiant" INTEGER,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_modification" TIMESTAMP(3),
    "id_ecole" INTEGER NOT NULL,
    "statut" "FormationStatut" NOT NULL DEFAULT 'ACTIF',

    CONSTRAINT "Formation_pkey" PRIMARY KEY ("id_formation")
);

-- CreateTable
CREATE TABLE "session" (
    "id_session" SERIAL NOT NULL,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3) NOT NULL,
    "id_formation" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id_session")
);

-- CreateTable
CREATE TABLE "inscriptions" (
    "id_inscription" SERIAL NOT NULL,
    "date_inscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" "StatutInscription" NOT NULL DEFAULT 'EN_ATTENTE',
    "id_etudiant" INTEGER NOT NULL,
    "id_formation" INTEGER NOT NULL,

    CONSTRAINT "inscriptions_pkey" PRIMARY KEY ("id_inscription")
);

-- CreateTable
CREATE TABLE "evaluation" (
    "id_evaluation" SERIAL NOT NULL,
    "type_admission" "TypeAdmission" NOT NULL,
    "date_debut_depot_dossier" TIMESTAMP(3),
    "date_fin_depot_dossier" TIMESTAMP(3),
    "date_debut_concours" TIMESTAMP(3),
    "date_fin_concours" TIMESTAMP(3),
    "date_resultat" TIMESTAMP(3),
    "resultat" TEXT,
    "id_formation" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluation_pkey" PRIMARY KEY ("id_evaluation")
);

-- CreateTable
CREATE TABLE "paiement" (
    "id_paiement" SERIAL NOT NULL,
    "mode_paiement" "ModePaiement" NOT NULL,
    "methode_paiement" "MethodePaiement",
    "raison_paiement" "RaisonPaiement" NOT NULL,
    "montant_total" DECIMAL(65,30) NOT NULL,
    "statut" "StatutPaiement" NOT NULL DEFAULT 'EN_ATTENTE',
    "date_paiement" TIMESTAMP(3),
    "id_inscription" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paiement_pkey" PRIMARY KEY ("id_paiement")
);

-- CreateTable
CREATE TABLE "tranche_paiement" (
    "id_tranche" SERIAL NOT NULL,
    "montant" DECIMAL(65,30) NOT NULL,
    "date_echance" TIMESTAMP(3) NOT NULL,
    "statut" "StatutPaiement" NOT NULL DEFAULT 'EN_ATTENTE',
    "date_paiement" TIMESTAMP(3),
    "numero_tranche" INTEGER NOT NULL,
    "id_paiement" INTEGER NOT NULL,

    CONSTRAINT "tranche_paiement_pkey" PRIMARY KEY ("id_tranche")
);

-- CreateTable
CREATE TABLE "CarteEtudiant" (
    "id_carte" SERIAL NOT NULL,
    "numero_carte" TEXT NOT NULL,
    "date_emission" TIMESTAMP(3) NOT NULL,
    "statut" "Statut" NOT NULL DEFAULT 'ACTIF',
    "id_etudiant" INTEGER NOT NULL,

    CONSTRAINT "CarteEtudiant_pkey" PRIMARY KEY ("id_carte")
);

-- CreateTable
CREATE TABLE "Avis" (
    "id_avis" SERIAL NOT NULL,
    "commentaire" TEXT NOT NULL,
    "note" INTEGER NOT NULL,
    "id_utilisateur" INTEGER NOT NULL,
    "id_ecole" INTEGER,

    CONSTRAINT "Avis_pkey" PRIMARY KEY ("id_avis")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id_notification" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "donnees" JSONB,
    "lue" BOOLEAN NOT NULL DEFAULT false,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_utilisateur" INTEGER NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id_notification")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_id_utilisateur_key" ON "Etudiant"("id_utilisateur");

-- CreateIndex
CREATE UNIQUE INDEX "ecoles_id_utilisateur_key" ON "ecoles"("id_utilisateur");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_id_utilisateur_key" ON "Admin"("id_utilisateur");

-- CreateIndex
CREATE UNIQUE INDEX "inscriptions_id_etudiant_id_formation_key" ON "inscriptions"("id_etudiant", "id_formation");

-- CreateIndex
CREATE UNIQUE INDEX "CarteEtudiant_numero_carte_key" ON "CarteEtudiant"("numero_carte");

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ecoles" ADD CONSTRAINT "ecoles_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Formation" ADD CONSTRAINT "Formation_id_ecole_fkey" FOREIGN KEY ("id_ecole") REFERENCES "ecoles"("id_ecole") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_id_formation_fkey" FOREIGN KEY ("id_formation") REFERENCES "Formation"("id_formation") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_id_etudiant_fkey" FOREIGN KEY ("id_etudiant") REFERENCES "Etudiant"("id_etudiant") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_id_formation_fkey" FOREIGN KEY ("id_formation") REFERENCES "Formation"("id_formation") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation" ADD CONSTRAINT "evaluation_id_formation_fkey" FOREIGN KEY ("id_formation") REFERENCES "Formation"("id_formation") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiement" ADD CONSTRAINT "paiement_id_inscription_fkey" FOREIGN KEY ("id_inscription") REFERENCES "inscriptions"("id_inscription") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tranche_paiement" ADD CONSTRAINT "tranche_paiement_id_paiement_fkey" FOREIGN KEY ("id_paiement") REFERENCES "paiement"("id_paiement") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarteEtudiant" ADD CONSTRAINT "CarteEtudiant_id_etudiant_fkey" FOREIGN KEY ("id_etudiant") REFERENCES "Etudiant"("id_etudiant") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_id_ecole_fkey" FOREIGN KEY ("id_ecole") REFERENCES "ecoles"("id_ecole") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;
