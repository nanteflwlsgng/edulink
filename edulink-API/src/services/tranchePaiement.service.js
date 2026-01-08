// services/tranchePaiement.service.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TranchePaiementService {
  async ajouterTranche(data) {
    const { id_paiement, montant, date_echance, numero_tranche } = data;

    // Validation
    if (!id_paiement || !montant || !date_echance || !numero_tranche) {
      throw new Error("Tous les champs sont obligatoires");
    }

    // Vérifier si le paiement existe
    const paiementExist = await prisma.paiement.findUnique({
      where: { id_paiement }
    });

    if (!paiementExist) {
      throw new Error("Paiement non trouvé");
    }

    return await prisma.tranchePaiement.create({
      data: {
        montant: parseFloat(montant),
        date_echance: new Date(date_echance),
        numero_tranche,
        id_paiement,
      },
      include: {
        paiement: {
          include: {
            inscription: {
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
                },
                formation: true
              }
            }
          }
        }
      }
    });
  }

  async modifierTranche(idTranche, data) {
    const { montant, date_echance, statut } = data;

    // Vérifier si la tranche existe
    const trancheExist = await prisma.tranchePaiement.findUnique({
      where: { id_tranche: idTranche }
    });

    if (!trancheExist) {
      throw new Error("Tranche non trouvée");
    }

    return await prisma.tranchePaiement.update({
      where: { id_tranche: idTranche },
      data: {
        ...(montant !== undefined && { montant: parseFloat(montant) }),
        ...(date_echance && { date_echance: new Date(date_echance) }),
        ...(statut && { statut }),
      },
      include: {
        paiement: {
          include: {
            inscription: {
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
                },
                formation: true
              }
            }
          }
        }
      }
    });
  }

  async supprimerTranche(idTranche) {
    const trancheExist = await prisma.tranchePaiement.findUnique({
      where: { id_tranche: idTranche }
    });

    if (!trancheExist) {
      throw new Error("Tranche non trouvée");
    }

    return await prisma.tranchePaiement.delete({
      where: { id_tranche: idTranche }
    });
  }

  async verifierEcheance() {
    const aujourdHui = new Date();

    return await prisma.tranchePaiement.findMany({
      where: {
        date_echance: { lt: aujourdHui },
        statut: 'EN_ATTENTE'
      },
      include: {
        paiement: {
          include: {
            inscription: {
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
                },
                formation: true
              }
            }
          }
        }
      },
      orderBy: {
        date_echance: 'asc'
      }
    });
  }

  async getTrancheById(idTranche) {
    const tranche = await prisma.tranchePaiement.findUnique({
      where: { id_tranche: idTranche },
      include: {
        paiement: {
          include: {
            inscription: {
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
                },
                formation: true
              }
            }
          }
        }
      }
    });

    if (!tranche) {
      throw new Error("Tranche non trouvée");
    }

    return tranche;
  }

  async getTranchesByPaiement(idPaiement) {
    return await prisma.tranchePaiement.findMany({
      where: { id_paiement: idPaiement },
      include: {
        paiement: {
          include: {
            inscription: {
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
                },
                formation: true
              }
            }
          }
        }
      },
      orderBy: {
        numero_tranche: 'asc'
      }
    });
  }
}

export const tranchePaiementService = new TranchePaiementService();