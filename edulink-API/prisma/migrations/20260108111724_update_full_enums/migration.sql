/*
  Warnings:

  - The `duree` column on the `Formation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CategorieFormation" AS ENUM ('MARKETING', 'COMMERCE', 'SCIENCE', 'POLITIQUE', 'INFORMATIQUE', 'TECHNOLOGIE', 'ELECTRONIQUE', 'AUTRE');

-- CreateEnum
CREATE TYPE "NiveauFormation" AS ENUM ('BAC', 'CERTIFICAT', 'LICENCE', 'MASTER', 'DOCTORAT', 'PROFESSEUR');

-- CreateEnum
CREATE TYPE "Continent" AS ENUM ('AFRIQUE', 'AMERIQUE', 'EUROPE', 'ASIE', 'OCEANIE', 'ANTARCTIQUE');

-- CreateEnum
CREATE TYPE "TypeEtablissement" AS ENUM ('CENTRE_FORMATION', 'ECOLE', 'INSTITUT', 'COURS_LANGUE', 'UNIVERSITE');

-- CreateEnum
CREATE TYPE "DureeStandard" AS ENUM ('MOIS_3', 'MOIS_6', 'AN_1', 'ANS_2', 'ANS_3', 'ANS_5', 'ANS_7', 'ANS_12');

-- CreateEnum
CREATE TYPE "ModeFormation" AS ENUM ('PRESENTIEL', 'DISTANCIEL', 'MIXTE');

-- AlterTable
ALTER TABLE "Formation" ADD COLUMN     "categorie" "CategorieFormation" NOT NULL DEFAULT 'INFORMATIQUE',
ADD COLUMN     "continent" "Continent" DEFAULT 'AFRIQUE',
ADD COLUMN     "mode" "ModeFormation" NOT NULL DEFAULT 'PRESENTIEL',
ADD COLUMN     "niveau" "NiveauFormation" NOT NULL DEFAULT 'LICENCE',
ADD COLUMN     "ville" TEXT,
DROP COLUMN "duree",
ADD COLUMN     "duree" "DureeStandard" NOT NULL DEFAULT 'ANS_3';

-- AlterTable
ALTER TABLE "ecoles" ADD COLUMN     "type" "TypeEtablissement" NOT NULL DEFAULT 'ECOLE';
