-- AlterTable
ALTER TABLE "ecoles" ADD COLUMN     "date_fondation" TIMESTAMP(3),
ADD COLUMN     "devis" VARCHAR(255),
ADD COLUMN     "nom_directeur" VARCHAR(100),
ADD COLUMN     "photo_directeur" VARCHAR(255),
ADD COLUMN     "photo_etablissement" VARCHAR(255);
