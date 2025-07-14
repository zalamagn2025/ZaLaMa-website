// @/utils/generateSalaryAdvancePDF.ts
import { pdf } from '@react-pdf/renderer';// Ajustez le chemin selon votre structure de dossiers
import { TransactionPDF } from './TransactionPDF';

// Interface pour les données du PDF, alignée avec SalaryAdvancePDFProps
interface SalaryAdvancePDFProps {
  id: string;
  montant: string;
  statut: 'En attente' | 'Validé' | 'Rejeté';
  date: string;
  telephone: string;
  reference: string;
  nomEmploye?: string;
  nomPartenaire?: string;
  motif?: string;
  fraisService?: string;
  dateValidation?: string | null;
  motifRejet?: string | null;
}

export async function generateSalaryAdvancePDF({
  id,
  montant,
  statut,
  date,
  telephone,
  reference,
  nomEmploye,
  nomPartenaire,
  motif,
  fraisService,
  dateValidation,
  motifRejet,
}: SalaryAdvancePDFProps): Promise<Blob> {
  const pdfDoc = pdf(
    <TransactionPDF
      id={id}
      montant={montant}
      statut={statut}
      date={date}
      telephone={telephone}
      reference={reference}
      nomEmploye={nomEmploye}
      nomPartenaire={nomPartenaire}
      motif={motif}
      fraisService={fraisService}
      dateValidation={dateValidation}
      motifRejet={motifRejet}
    />
  );
  return await pdfDoc.toBlob();
}