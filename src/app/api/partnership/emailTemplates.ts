export const getAdminEmailTemplate = (data: {
  companyName: string;
  legalStatus: string;
  rccm: string;
  nif: string;
  legalRepresentative: string;
  position: string;
  headquartersAddress: string;
  phone: string;
  email: string;
  employeesCount: string;
  payroll: string;
  cdiCount: string;
  cddCount: string;
  docId: string;
  activityDomain: string;
  paymentDate: string;
  repEmail: string;
  repPhone: string;
  repPosition: string;
  hrFullName: string;
  hrEmail: string;
  hrPhone: string;
}) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle Demande de Partenariat</title>
</head>
<body style="background-color: #ffffff; font-family: 'Roboto', Helvetica, sans-serif; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; min-height: 100%; margin: 20px auto; background-color: #ffffff; border: 4px solid #1e40af; border-radius: 16px;">
    <tr>
      <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 15px; text-align: center; border-radius: 12px 12px 0 0;">
        <span style="color: #ffffff; font-size: 28px; font-weight: 900; letter-spacing: 2px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); display: inline-block; padding: 8px 16px; background-color: rgba(0,0,0,0.1); border-radius: 8px;">ZalaMa</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px; background-color: #f9fafb;">
        <h2 style="color: #1e3a8a; font-size: 30px; font-weight: 700; margin: 0 0 25px 0; border-bottom: 6px solid #3b82f6; padding-bottom: 12px; text-align: center; letter-spacing: 1px;">Nouvelle Demande de Partenariat</h2>
        
        <h3 style="color: #1e3a8a; font-size: 20px; font-weight: 600; margin: 20px 0 15px 0; border-left: 4px solid #3b82f6; padding-left: 15px;">Informations de l'entreprise</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Entreprise :</span> ${data.companyName}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Raison sociale :</span> ${data.legalStatus}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Domaine d'activité :</span> ${data.activityDomain}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">RCCM :</span> ${data.rccm}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">NIF :</span> ${data.nif}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Adresse :</span> ${data.headquartersAddress}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Téléphone :</span> ${data.phone}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Email :</span> <a href="mailto:${data.email}" style="color: #3b82f6; text-decoration: none;">${data.email}</a>
            </td>
          </tr>
        </table>

        <h3 style="color: #1e3a8a; font-size: 20px; font-weight: 600; margin: 20px 0 15px 0; border-left: 4px solid #3b82f6; padding-left: 15px;">Informations RH</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Nombre d'employés :</span> ${data.employeesCount}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Masse salariale :</span> ${data.payroll}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Employés CDI :</span> ${data.cdiCount}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Employés CDD :</span> ${data.cddCount}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Date de paiement :</span> ${data.paymentDate}
            </td>
          </tr>
        </table>

        <h3 style="color: #1e3a8a; font-size: 20px; font-weight: 600; margin: 20px 0 15px 0; border-left: 4px solid #3b82f6; padding-left: 15px;">Représentant légal</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Nom :</span> ${data.legalRepresentative}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Fonction :</span> ${data.position}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Email :</span> <a href="mailto:${data.repEmail}" style="color: #3b82f6; text-decoration: none;">${data.repEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Téléphone :</span> ${data.repPhone}
            </td>
          </tr>
        </table>

        <h3 style="color: #1e3a8a; font-size: 20px; font-weight: 600; margin: 20px 0 15px 0; border-left: 4px solid #3b82f6; padding-left: 15px;">Responsable RH</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Nom :</span> ${data.hrFullName}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Email :</span> <a href="mailto:${data.hrEmail}" style="color: #3b82f6; text-decoration: none;">${data.hrEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              <span style="font-weight: bold; color: #1e40af;">Téléphone :</span> ${data.hrPhone}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background-color: #1e40af; padding: 25px; text-align: center; font-size: 14px; color: #ffffff; border-radius: 0 0 12px 12px;">
        <p style="margin: 0 0 15px 0; font-weight: 500;">Zalama SAS - Demande de partenariat</p>
        <p style="margin: 0; font-size: 12px;">ID: ${data.docId}</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const getUserEmailTemplate = (data: {
  legalRepresentative: string;
  companyName: string;
  docId: string;
}) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de réception de votre demande de partenariat</title>
</head>
<body style="background-color: #ffffff; font-family: 'Roboto', sans-serif; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; min-height: 100%; margin: 20px auto; background-color: #ffffff; border: 4px solid #1e40af; border-radius: 16px;">
    <tr>
      <td style="background: linear-gradient(135deg, #1e3b8a 0%, #3b82f6 100%); padding: 15px; text-align: center; border-radius: 12px 12px 0 0;">
        <span style="color: #ffffff; font-size: 28px; font-weight: 900;  letter-spacing: 2px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); display: inline-block; padding: 8px 16px; background-color: rgba(0,0,0,0.1); border-radius: 8px;">ZaLaMa</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px; background-color: #f9fafb;">
        <h2 style="color: #1e3a8a; font-size: 28px; font-weight: 700; margin: 0 25px; border-bottom: 6px solid #3b82f6; padding-bottom: 12px; text-align: center; letter-spacing: 1px;">Confirmation de réception</h2>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              Bonjour Mr <span style="font-weight: bold; color: #1e40af;">${data.legalRepresentative}</span>,
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              Nous vous remercions pour l'intérêt que vous portez à ZaLaMa.
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              Nous accusons bonne réception de votre demande de partenariat soumise pour <span style="font-weight: bold; color: #1e40af;">${data.companyName}</span>.
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              Notre équipe étudiera attentivement votre dossier et vous reviendra dans les plus brefs délais.
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; color: #1f2937; font-size: 16px; line-height: 1.6; background-color: #ffffff; border-radius: 8px; margin-bottom: 10px; border: 1px solid #dbeafe;">
              En attendant, n'hésitez pas à consulter notre site ou à nous contacter pour toute information complémentaire.
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background-color: #1e40af; padding: 25px; text-align: center; font-size: 14px; color: #ffffff; border-radius: 0 0 12px 12px;">
        <p style="margin: 0 0 15px 0; font-weight: 500; color: #ffffff;">Zalama SAS - Merci pour votre confiance</p>
        <table cellpadding="0" cellspacing="0" style="margin: 0 auto 15px auto;">
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); padding: 12px 30px; border-radius: 10px; border: 1px solid #ffffff;">
              <a href="mailto:contact@zalamagn.com" style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">Contactez-nous</a>
            </td>
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td style="background-color: #ffffff; padding: 12px 30px; border-radius: 10px; border: 1px solid #dbeafe; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <a href="https://www.zalamagn.com" style="color: #1e40af; text-decoration: none; font-weight: bold; font-size: 16px; display: flex; align-items: center; justify-content: center;">
                www.zalamagn.com
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;