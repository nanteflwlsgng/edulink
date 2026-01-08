import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding sécurisé...');

  try {
    console.log('🔍 Vérification des données existantes...');

    // Vérifier si les utilisateurs existent déjà
    const existingUsers = await prisma.utilisateur.findMany({
      where: {
        email: {
          in: ['santatra@gmail.com', 'admin@gmail.com', 'etudiant@gmail.com', 'marie.dupont@student.com']
        }
      }
    });

    if (existingUsers.length > 0) {
      console.log('⚠️  Des données existent déjà. Ajout seulement des données manquantes...');
    }

    console.log('👥 Création des utilisateurs...');

    // Créer les utilisateurs seulement s'ils n'existent pas
    const saltRounds = 10;

    // Utilisateur École
    const userEcole = await prisma.utilisateur.upsert({
      where: { email: 'santatra@gmail.com' },
      update: {}, // Ne rien mettre à jour si existe
      create: {
        email: 'santatra@gmail.com',
        nom: 'Santatra',
        prenom: 'Ecole',
        mot_de_passe: await bcrypt.hash('santatra', saltRounds),
        role: 'ECOLE'
      }
    });

    // Utilisateur Admin
    const userAdmin = await prisma.utilisateur.upsert({
      where: { email: 'admin@gmail.com' },
      update: {},
      create: {
        email: 'admin@gmail.com',
        nom: 'Admin',
        prenom: 'System',
        mot_de_passe: await bcrypt.hash('admin', saltRounds),
        role: 'ADMIN'
      }
    });

    // Utilisateur Étudiant
    const userEtudiant = await prisma.utilisateur.upsert({
      where: { email: 'etudiant@gmail.com' },
      update: {},
      create: {
        email: 'etudiant@gmail.com',
        nom: 'Etudiant',
        prenom: 'Test',
        mot_de_passe: await bcrypt.hash('etudiant', saltRounds),
        role: 'ETUDIANT'
      }
    });

    // Autre étudiant
    const userEtudiant2 = await prisma.utilisateur.upsert({
      where: { email: 'marie.dupont@student.com' },
      update: {},
      create: {
        email: 'marie.dupont@student.com',
        nom: 'Dupont',
        prenom: 'Marie',
        mot_de_passe: await bcrypt.hash('etudiant123', saltRounds),
        role: 'ETUDIANT'
      }
    });

    console.log('🏫 Création de l\'école...');

    // Créer l'école
    const ecole = await prisma.ecole.upsert({
      where: { id_utilisateur: userEcole.id_utilisateur },
      update: {},
      create: {
        nom: 'ENI Ecole Informatique',
        adresse: '123 Avenue de la Technologie',
        ville: 'Nantes',
        code_postal: '44000',
        telephone: '02 40 00 00 00',
        site_web: 'https://www.eni-ecole.fr',
        description: 'École spécialisée en informatique et développement web',
        id_utilisateur: userEcole.id_utilisateur
      }
    });

    console.log('🎓 Création des étudiants...');

    // Créer les étudiants
    const etudiant1 = await prisma.etudiant.upsert({
      where: { id_utilisateur: userEtudiant.id_utilisateur },
      update: {},
      create: {
        date_naissance: new Date('2000-05-15'),
        telephone: '06 12 34 56 78',
        id_utilisateur: userEtudiant.id_utilisateur
      }
    });

    const etudiant2 = await prisma.etudiant.upsert({
      where: { id_utilisateur: userEtudiant2.id_utilisateur },
      update: {},
      create: {
        date_naissance: new Date('1999-08-22'),
        telephone: '06 98 76 54 32',
        id_utilisateur: userEtudiant2.id_utilisateur
      }
    });

    console.log('📚 Création des formations...');

    // Créer des formations de base
    const formation1 = await prisma.formation.upsert({
      where: { 
        id_ecole_titre: {
          id_ecole: ecole.id_ecole,
          titre: 'Développement Web Fullstack'
        }
      },
      update: {},
      create: {
        titre: 'Développement Web Fullstack',
        description: 'Formation complète en développement web avec les technologies modernes',
        duree: 400,
        prix: 2500.00,
        id_ecole: ecole.id_ecole,
        statut: 'ACTIF'
      }
    });

    const formation2 = await prisma.formation.upsert({
      where: { 
        id_ecole_titre: {
          id_ecole: ecole.id_ecole,
          titre: 'Data Science et Intelligence Artificielle'
        }
      },
      update: {},
      create: {
        titre: 'Data Science et Intelligence Artificielle',
        description: 'Maîtrisez la data science et les algorithmes d\'IA',
        duree: 350,
        prix: 3000.00,
        id_ecole: ecole.id_ecole,
        statut: 'ACTIF'
      }
    });

    console.log('✅ Seed sécurisé terminé!');
    console.log('');
    console.log('🔑 Comptes créés:');
    console.log('   École: santatra@gmail.com / santatra');
    console.log('   Admin: admin@gmail.com / admin');
    console.log('   Étudiant: etudiant@gmail.com / etudiant');
    console.log('   Étudiant 2: marie.dupont@student.com / etudiant123');

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });