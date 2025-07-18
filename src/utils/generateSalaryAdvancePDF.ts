import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// Utilitaire pour charger le logo en base64
async function fetchLogoBase64(): Promise<string> {
  const res = await fetch("/images/zalama-logo.svg");
  const svg = await res.text();
  // Encodage base64
  return "data:image/svg+xml;base64," + btoa(svg);
}

export async function generateSalaryAdvancePDF({
  id,
  montant,
  statut,
  date,
  telephone,
  reference,
}: {
  id: string;
  montant: string;
  statut: "En attente" | "Validé" | "Rejeté";
  date: string;
  telephone: string;
  reference: string;
}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([380, 500]);
  const { width, height } = page.getSize();

  // Couleurs ZaLaMa
  const orange = rgb(1, 0.4, 0.12);
  const gray = rgb(0.38, 0.4, 0.45);

  // Polices
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Logo
  const logoBase64 = await fetchLogoBase64();
  const logoImg = await pdfDoc.embedPng(logoBase64);
  page.drawImage(logoImg, {
    x: 30,
    y: height - 80,
    width: 48,
    height: 48,
  });

  // Titre
  page.drawText("Reçu de demande d’avance sur salaire", {
    x: 90,
    y: height - 50,
    size: 13,
    font: fontBold,
    color: orange,
  });

  // Bloc infos
  let y = height - 110;
  const lineHeight = 28;
  const labelX = 40;
  const valueX = 180;

  const drawRow = (label: string, value: string, bold = false) => {
    page.drawText(label, {
      x: labelX,
      y,
      size: 11,
      font,
      color: gray,
    });
    page.drawText(value, {
      x: valueX,
      y,
      size: 12,
      font: bold ? fontBold : font,
      color: rgb(0.13, 0.13, 0.13),
    });
    y -= lineHeight;
  };

  drawRow("Service", "Avance sur salaire");
  drawRow("Téléphone", telephone);
  drawRow("Montant", montant, true);
  drawRow("Date", date);
  drawRow("Statut", statut, true);
  drawRow("Référence", reference);

  // Footer
  page.drawText("Reçu généré par l’application ZaLaMa", {
    x: 60,
    y: 30,
    size: 10,
    font,
    color: gray,
  });

  // Génère le PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  return blob;
} 