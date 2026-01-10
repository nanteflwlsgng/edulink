import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('🔄 Migration sécurisée...');

try {
  console.log('1. Synchronisation du schéma...');
  execSync('npx prisma db pull', { stdio: 'inherit' });
  
  console.log('2. Génération du client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('3. Vérification des migrations...');
  const status = execSync('npx prisma migrate status', { encoding: 'utf8' });
  
  if (status.includes('not yet applied')) {
    console.log('🔄 Application des migrations en attente...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  }
  
  if (status.includes('drift detected')) {
    console.log('⚠️  Drift détecté, utilisation de db push...');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  }
  
  console.log('✅ Migrations terminées!');
} catch (error) {
  console.error('❌ Erreur:', error.message);
  console.log('💡 Solution manuelle requise');
  process.exit(1);
}