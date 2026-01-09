-- AlterTable
ALTER TABLE "Formation" ADD COLUMN     "langue" VARCHAR(50) NOT NULL DEFAULT 'Français',
ADD COLUMN     "type_admission" VARCHAR(100) NOT NULL DEFAULT 'Dossier';
