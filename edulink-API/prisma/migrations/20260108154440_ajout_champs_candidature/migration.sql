-- AlterTable
ALTER TABLE "Etudiant" ADD COLUMN     "dernier_diplome" VARCHAR(100),
ADD COLUMN     "ecole_origine" VARCHAR(150),
ADD COLUMN     "sexe" CHAR(1);

-- AlterTable
ALTER TABLE "inscriptions" ADD COLUMN     "motivation" TEXT,
ADD COLUMN     "url_cv" VARCHAR(255),
ADD COLUMN     "url_lettre" VARCHAR(255),
ADD COLUMN     "url_piece_identite" VARCHAR(255),
ADD COLUMN     "url_releve_notes" VARCHAR(255);
