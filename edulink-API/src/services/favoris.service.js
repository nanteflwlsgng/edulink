import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FavorisService {
  
  /**
   * Ajoute ou supprime un favori (Toggle)
   * @param {number} id_etudiant 
   * @param {number} id_formation 
   * @returns {object} { isFavorite: boolean, message: string }
   */
  async toggleFavoris(id_utilisateur, id_formation) {
     const etudiant = await prisma.etudiant.findFirst({
        where: {
            id_utilisateur: parseInt(id_utilisateur)
        }
    });
     if (!etudiant) {
        throw new Error("Aucun profil étudiant trouvé pour cet utilisateur (ID: " + id_utilisateur_recu + ")");
    }
    const VRAI_ID_ETUDIANT = etudiant.id_etudiant;
    const existingFavori = await prisma.favoris.findFirst({
        where: {
            id_etudiant: VRAI_ID_ETUDIANT,
            id_formation: parseInt(id_formation)
        }
    });
    if (existingFavori) {
        await prisma.favoris.delete({
            where: {
                id_favoris: existingFavori.id_favoris
            }
        });
        return { isFavorite: false, message: "Retiré des favoris" };
    } else {
        await prisma.favoris.create({
            data: {
                id_etudiant: VRAI_ID_ETUDIANT, // <--- C'est ici que ça corrige l'erreur Foreign Key
                id_formation: parseInt(id_formation)
            }
        });
        return { isFavorite: true, message: "Ajouté aux favoris" };
    }
  }

  /**
   * Récupère la liste des favoris d'un étudiant avec les détails de la formation
   * @param {number} id_etudiant 
   * @returns {Array} Liste des favoris
   */
 // DANS LE FICHIER SERVICE (favoris.service.js)

async getFavorisByUtilisateur(id_utilisateur_recu) {
    try {
      // 1. Conversion : On cherche l'ID Étudiant à partir de l'ID Utilisateur
      console.log("Service reçoit:", id_utilisateur_recu); // Doit afficher '5' (pas {id: '5'})

      // Conversion explicite pour éviter les bugs
      const idInt = parseInt(id_utilisateur_recu);

      if (isNaN(idInt)) {
         throw new Error("L'ID utilisateur n'est pas un nombre valide");
      }

      // 1. Conversion
      const etudiant = await prisma.etudiant.findFirst({
        where: {
          id_utilisateur: idInt // Utiliser la variable convertie
        }
      });

      // Si l'utilisateur n'est pas encore étudiant, il n'a pas de favoris
      if (!etudiant) {
        return [];
      }

      // 2. Récupération avec le VRAI id_etudiant
      return await prisma.favoris.findMany({
        where: {
          id_etudiant: etudiant.id_etudiant // <--- La clé du succès est ici
        },
        include: {
          formation: {
            select: {
              id_formation: true, 
              titre: true,
              prix: true,
              ecole: {
                select: {
                  nom: true,
                  adresse: true
                }
              }
            }
          }
        },
        orderBy: {
          date_ajout: 'desc'
        }
      });
    } catch (error) {
      throw new Error(`Erreur récupération favoris: ${error.message}`);
    }
}
}