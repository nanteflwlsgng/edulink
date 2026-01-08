// services/session.service.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SessionService {
  async creerSession(data) {
    const { id_formation, date_debut, date_fin } = data;
    
    // Validation des dates
    this.validerDatesSession(date_debut, date_fin);
    
    // Vérifier si la formation existe
    const formationExist = await prisma.formation.findUnique({
      where: { id_formation }
    });
    
    if (!formationExist) {
      throw new Error("Formation non trouvée");
    }
    
    return await prisma.session.create({
      data: {
        date_debut: new Date(date_debut),
        date_fin: new Date(date_fin),
        id_formation,
      },
      include: {
        formation: true
      }
    });
  }

  async modifierSession(idSession, data) {
    const { date_debut, date_fin } = data;
    
    // Vérifier si la session existe
    const sessionExist = await prisma.session.findUnique({
      where: { id_session: idSession }
    });
    
    if (!sessionExist) {
      throw new Error("Session non trouvée");
    }
    
    // Validation des dates si fournies
    if (date_debut || date_fin) {
      this.validerDatesSession(
        date_debut || sessionExist.date_debut,
        date_fin || sessionExist.date_fin
      );
    }
    
    return await prisma.session.update({
      where: { id_session: idSession },
      data: {
        ...(date_debut && { date_debut: new Date(date_debut) }),
        ...(date_fin && { date_fin: new Date(date_fin) }),
      },
      include: {
        formation: true
      }
    });
  }

  async supprimerSession(idSession) {
    const sessionExist = await prisma.session.findUnique({
      where: { id_session: idSession }
    });
    
    if (!sessionExist) {
      throw new Error("Session non trouvée");
    }
    
    return await prisma.session.delete({
      where: { id_session: idSession }
    });
  }

  async consulterPlanning() {
    return await prisma.session.findMany({
      include: {
        formation: {
          select: {
            id_formation: true,
            titre: true,
            description: true
          }
        }
      },
      orderBy: {
        date_debut: 'asc'
      }
    });
  }

  async getSessionById(idSession) {
    const session = await prisma.session.findUnique({
      where: { id_session: idSession },
      include: {
        formation: {
          select: {
            id_formation: true,
            titre: true,
            description: true
          }
        }
      }
    });
    
    if (!session) {
      throw new Error("Session non trouvée");
    }
    
    return session;
  }

  async getSessionsByFormation(idFormation) {
    return await prisma.session.findMany({
      where: { id_formation: idFormation },
      include: {
        formation: {
          select: {
            id_formation: true,
            titre: true,
            description: true
          }
        }
      },
      orderBy: {
        date_debut: 'asc'
      }
    });
  }

  // Méthode de validation des dates
  validerDatesSession(date_debut, date_fin) {
    const debut = new Date(date_debut);
    const fin = new Date(date_fin);
    
    if (debut >= fin) {
      throw new Error("La date de début doit être antérieure à la date de fin");
    }
    
    if (debut < new Date()) {
      throw new Error("La date de début ne peut pas être dans le passé");
    }
  }
}

export const sessionService = new SessionService();