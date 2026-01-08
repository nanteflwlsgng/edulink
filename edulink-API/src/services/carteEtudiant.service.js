// services/carteEtudiant.service.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CarteEtudiantService {
  async genererCarteEtudiant(idEtudiant) {
    // Vérifier si l'étudiant existe
    const etudiantExist = await prisma.etudiant.findUnique({
      where: { id_etudiant: idEtudiant },
      include: {
        utilisateur: {
          select: {
            nom: true,
            prenom: true,
            email: true
          }
        }
      }
    });

    if (!etudiantExist) {
      throw new Error("Étudiant non trouvé");
    }

    // Vérifier si l'étudiant a déjà une carte active
    const carteExistante = await prisma.carteEtudiant.findFirst({
      where: {
        id_etudiant: idEtudiant,
        statut: 'ACTIF'
      }
    });

    if (carteExistante) {
      throw new Error("L'étudiant a déjà une carte active");
    }

    // Générer un numéro de carte unique
    const numeroCarte = this.genererNumeroCarte();

    const carte = await prisma.carteEtudiant.create({
      data: {
        numero_carte: numeroCarte,
        date_emission: new Date(),
        statut: 'ACTIF',
        id_etudiant: idEtudiant,
      },
      include: {
        etudiant: {
          include: {
            utilisateur: {
              select: {
                nom: true,
                prenom: true,
                email: true
              }
            }
          }
        }
      }
    });

    return carte;
  }

  async afficherQRCode(idCarte) {
    const carte = await prisma.carteEtudiant.findUnique({
      where: { id_carte: idCarte },
      include: {
        etudiant: {
          include: {
            utilisateur: {
              select: {
                nom: true,
                prenom: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!carte) {
      throw new Error("Carte étudiante non trouvée");
    }

    // Pour le moment, nous simulons la génération d'un QR code
    // En production, vous utiliseriez une bibliothèque comme 'qrcode' pour générer un QR code image
    const qrCodeData = {
      numeroCarte: carte.numero_carte,
      etudiant: `${carte.etudiant.utilisateur.prenom} ${carte.etudiant.utilisateur.nom}`,
      dateEmission: carte.date_emission,
      statut: carte.statut
    };

    return {
      qrCodeData,
      // En production, vous renverriez aussi l'image du QR code en base64 par exemple
      // qrCodeImage: await this.genererQRCodeImage(qrCodeData)
    };
  }

  async renouvelerCarte(idCarte) {
    // Vérifier si la carte existe
    const carteExistante = await prisma.carteEtudiant.findUnique({
      where: { id_carte: idCarte }
    });

    if (!carteExistante) {
      throw new Error("Carte étudiante non trouvée");
    }

    // Désactiver l'ancienne carte
    await prisma.carteEtudiant.update({
      where: { id_carte: idCarte },
      data: { statut: 'INACTIF' }
    });

    // Générer une nouvelle carte
    const nouvelleCarte = await this.genererCarteEtudiant(carteExistante.id_etudiant);

    return nouvelleCarte;
  }

  async desactiverCarte(idCarte) {
    const carte = await prisma.carteEtudiant.findUnique({
      where: { id_carte: idCarte }
    });

    if (!carte) {
      throw new Error("Carte étudiante non trouvée");
    }

    const carteDesactivee = await prisma.carteEtudiant.update({
      where: { id_carte: idCarte },
      data: { statut: 'INACTIF' }
    });

    return carteDesactivee;
  }

  async getCarteById(idCarte) {
    const carte = await prisma.carteEtudiant.findUnique({
      where: { id_carte: idCarte },
      include: {
        etudiant: {
          include: {
            utilisateur: {
              select: {
                nom: true,
                prenom: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!carte) {
      throw new Error("Carte étudiante non trouvée");
    }

    return carte;
  }

  async getCartesByEtudiant(idEtudiant) {
    return await prisma.carteEtudiant.findMany({
      where: { id_etudiant: idEtudiant },
      include: {
        etudiant: {
          include: {
            utilisateur: {
              select: {
                nom: true,
                prenom: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        date_emission: 'desc'
      }
    });
  }

  // Méthode pour générer un numéro de carte unique
  genererNumeroCarte() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `CARTE-${timestamp}-${random}`;
  }

  // Méthode pour générer l'image QR code (à implémenter si besoin)
  // async genererQRCodeImage(data) {
  //   const qrCode = await QRCode.toDataURL(JSON.stringify(data));
  //   return qrCode;
  // }
}

export const carteEtudiantService = new CarteEtudiantService();