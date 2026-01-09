import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // 1. Créer un utilisateur (Directeur de l'école) - Adaptez selon votre modèle Utilisateur
  // Note: Si vous avez déjà des utilisateurs, récupérez-en un existant.
  const user = await prisma.utilisateur.upsert({
    where: { email: 'directeur@tech-institute.com' },
    update: {},
    create: {
      email: 'directeur@tech-institute.com',
      nom: 'Dupont',
      prenom: 'Jean',
      mot_de_passe: 'password123', // En vrai, il faudrait le hasher
      role: 'ECOLE', // Adaptez selon votre Enum Role
      // Ajoutez les champs obligatoires de votre table Utilisateur ici
    },
  })

  // 2. Créer une École
  const ecole = await prisma.ecole.create({
    data: {
      nom: 'Tech Institute Dakar',
      adresse: '123 Avenue Cheikh Anta Diop',
      ville: 'Dakar', // champ supprimé dans votre dernier modèle ? Vérifiez si vous l'avez gardé dans Ecole
      // Si adresse contient tout, ok. Sinon ajustez.
      email: 'contact@tech-dakar.sn',
      type: 'INSTITUT',
      id_utilisateur: user.id_utilisateur,
      description: 'Institut de référence en Afrique de l\'Ouest',
    },
  })

  // 3. Créer des Formations (Avec les nouveaux ENUMS)
  
  // Formation 1 : Informatique au Sénégal
  await prisma.formation.create({
    data: {
      titre: 'Master DevOps & Cloud',
      description: 'Formation experte sur AWS et Azure.',
      categorie: 'INFORMATIQUE',     // Enum
      niveau: 'MASTER',              // Enum
      duree_standard: 'ANS_2',       // Enum
      duree_mois: 24,                // Int
      mode: 'PRESENTIEL',
      continent: 'AFRIQUE',
      pays: 'Sénégal',
      ville: 'Dakar',
      prix: 2500.00,
      id_ecole: ecole.id_ecole,
    },
  })

  // Formation 2 : Commerce en France
  await prisma.formation.create({
    data: {
      titre: 'Licence Business International',
      description: 'Échange culturel et techniques de vente.',
      categorie: 'COMMERCE',
      niveau: 'LICENCE',
      duree_standard: 'ANS_3',
      duree_mois: 36,
      mode: 'PRESENTIEL',
      continent: 'EUROPE',
      pays: 'France',
      ville: 'Paris',
      prix: 4500.00,
      id_ecole: ecole.id_ecole,
    },
  })

  // Formation 3 : Marketing en Ligne
  await prisma.formation.create({
    data: {
      titre: 'Certificat Marketing Digital',
      description: 'Apprenez le SEO et Google Ads rapidement.',
      categorie: 'MARKETING',
      niveau: 'CERTIFICAT',
      duree: 'MOIS_6',
      mode: 'EN_LIGNE',
      // Pas de pays/ville car en ligne (ou optionnel)
      continent: 'AFRIQUE', // Si c'est basé en Afrique
      prix: 500.00,
      id_ecole: ecole.id_ecole,
    },
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })