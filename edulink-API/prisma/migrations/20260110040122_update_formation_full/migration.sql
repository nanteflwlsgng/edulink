-- AlterTable
ALTER TABLE "Formation" ADD COLUMN     "categorie" VARCHAR(50),
ADD COLUMN     "conditions" JSONB,
ADD COLUMN     "date_debut" TIMESTAMP(3),
ADD COLUMN     "date_fin" TIMESTAMP(3),
ADD COLUMN     "image_url" VARCHAR(255),
ADD COLUMN     "langue" VARCHAR(50),
ADD COLUMN     "mode" VARCHAR(50),
ADD COLUMN     "niveau" VARCHAR(50),
ADD COLUMN     "ville" VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE TEXT,
ALTER COLUMN "duree" SET DATA TYPE VARCHAR(50);
