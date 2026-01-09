-- CreateTable
CREATE TABLE "Favoris" (
    "id_etudiant" INTEGER NOT NULL,
    "id_formation" INTEGER NOT NULL,
    "date_ajout" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favoris_pkey" PRIMARY KEY ("id_etudiant","id_formation")
);

-- AddForeignKey
ALTER TABLE "Favoris" ADD CONSTRAINT "Favoris_id_etudiant_fkey" FOREIGN KEY ("id_etudiant") REFERENCES "Etudiant"("id_etudiant") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favoris" ADD CONSTRAINT "Favoris_id_formation_fkey" FOREIGN KEY ("id_formation") REFERENCES "Formation"("id_formation") ON DELETE RESTRICT ON UPDATE CASCADE;
