// utils/pdf.js
import PDFDocument from 'pdfkit';
import fs from 'fs';

export const generatePDF = (filename, content) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filename));

  // En-tête
  doc.fontSize(20).text('REÇU D\'INSCRIPTION', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(12).text('Edulink - Plateforme de Formation', { align: 'center' });
  doc.moveDown(1);

  // Ligne séparatrice
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(1);

  // Contenu formaté
  const lines = content.split('\n');
  lines.forEach(line => {
    if (line.includes('===') || line.includes('---')) {
      // Ignorer les séparateurs textuels
      return;
    }
    
    if (line.trim() === '') {
      doc.moveDown(0.5);
    } else if (line === 'REÇU D\'INSCRIPTION' || line === '==================') {
      // Déjà traité dans l'en-tête
      return;
    } else if (line.includes(':')) {
      const [label, value] = line.split(':');
      doc.font('Helvetica-Bold').text(label + ':', { continued: true });
      doc.font('Helvetica').text(value || '');
    } else {
      doc.font('Helvetica-Bold').text(line);
    }
  });

  // Pied de page
  doc.moveDown(2);
  doc.fontSize(10).text('Document généré automatiquement par Edulink - Ce document fait foi d\'inscription', { align: 'center' });

  doc.end();
  return filename;
};

// Nouvelle fonction pour générer un PDF en mémoire (pour envoi direct)
export const generatePDFBuffer = (content) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    doc.on('error', reject);

    // Même logique de formatage que generatePDF
    doc.fontSize(20).text('REÇU D\'INSCRIPTION', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text('Edulink - Plateforme de Formation', { align: 'center' });
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.includes('===') || line.includes('---') || line.trim() === '' || 
          line === 'REÇU D\'INSCRIPTION' || line === '==================') {
        if (line.trim() === '') doc.moveDown(0.5);
        return;
      }
      
      if (line.includes(':')) {
        const [label, value] = line.split(':');
        doc.font('Helvetica-Bold').text(label + ':', { continued: true });
        doc.font('Helvetica').text(value || '');
      } else {
        doc.font('Helvetica-Bold').text(line);
      }
    });

    doc.moveDown(2);
    doc.fontSize(10).text('Document généré automatiquement par Edulink', { align: 'center' });

    doc.end();
  });
};