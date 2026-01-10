/*
  Warnings:

  - You are about to alter the column `commentaire` on the `Avis` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `adresse` on the `Etudiant` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `telephone` on the `Etudiant` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `titre` on the `Formation` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `description` on the `Formation` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `nom` on the `Utilisateur` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `prenom` on the `Utilisateur` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `email` on the `Utilisateur` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `mot_de_passe` on the `Utilisateur` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `nom` on the `ecoles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `adresse` on the `ecoles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `email` on the `ecoles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `telephone` on the `ecoles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `description` on the `ecoles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `logo` on the `ecoles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `site_web` on the `ecoles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `resultat` on the `evaluation` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `type` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `titre` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `message` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.

*/
-- AlterTable
ALTER TABLE "Avis" ALTER COLUMN "commentaire" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Etudiant" ALTER COLUMN "adresse" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "telephone" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "Formation" ALTER COLUMN "titre" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Utilisateur" ALTER COLUMN "nom" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "prenom" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "mot_de_passe" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "ecoles" ALTER COLUMN "nom" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "adresse" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "telephone" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "logo" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "site_web" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "evaluation" ALTER COLUMN "resultat" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "type" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "titre" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "message" SET DATA TYPE VARCHAR(500);
