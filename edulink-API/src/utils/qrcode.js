// utils/qrcode.js
import QRCode from 'qrcode';

export const generateQRCode = async (data) => {
  try {
    // Si les données sont un objet, on les convertit en JSON
    const text = typeof data === 'object' ? JSON.stringify(data) : data;
    
    const url = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H', // Haute correction d'erreur
      margin: 2,
      scale: 8,
      width: 300,
      color: {
        dark: '#000000', // Couleur des modules
        light: '#FFFFFF' // Couleur de fond
      }
    });
    return url; // renvoie une image base64 du QR code
  } catch (err) {
    console.error('Erreur génération QR Code:', err);
    throw new Error('Impossible de générer le QR code');
  }
};

// Nouvelle fonction spécifique pour la carte étudiante
export const generateCarteEtudiantQR = async (etudiantData) => {
  try {
    // Structure optimisée pour le scan
    const qrData = {
      type: 'CARTE_ETUDIANT',
      version: '1.0',
      etudiant: {
        id: etudiantData.etudiant.id_etudiant,
        nom: etudiantData.etudiant.nom,
        prenom: etudiantData.etudiant.prenom,
        email: etudiantData.etudiant.email
      },
      formations: etudiantData.formations,
      date_emission: etudiantData.date_emission,
      qr_code: etudiantData.qr_code
    };

    return await generateQRCode(qrData);
  } catch (error) {
    console.error('Erreur génération QR carte étudiante:', error);
    throw error;
  }
};