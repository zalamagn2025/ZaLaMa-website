export const forgotPasswordEmailTemplate = (resetLink: string, userName?: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de mot de passe - ZaLaMa</title>
</head>
<body style="background-color: #ffffff; font-family: 'Roboto', Helvetica, sans-serif; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; min-height: 100%; margin: 20px auto; background-color: #ffffff; border: 4px solid #FF671E; border-radius: 16px;">
    <tr>
      <td style="background: linear-gradient(135deg, #FF671E 0%, #FF8C5A 100%); padding: 15px; text-align: center; border-radius: 12px 12px 0 0;">
        <span style="color: #ffffff; font-size: 28px; font-weight: 900; letter-spacing: 2px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); display: inline-block; padding: 8px 16px; background-color: rgba(0,0,0,0.1); border-radius: 8px;">ZalaMa</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px; background-color: #f9fafb;">
        <h2 style="color: #FF671E; font-size: 30px; font-weight: 700; margin: 0 0 25px 0; border-bottom: 6px solid #FF8C5A; padding-bottom: 12px; text-align: center; letter-spacing: 1px;">Réinitialisation de Mot de Passe</h2>
        
        <div style="background-color: #ffffff; border-radius: 12px; padding: 30px; margin-bottom: 25px; border: 2px solid #FFE4D6; box-shadow: 0 4px 12px rgba(255, 103, 30, 0.1);">
          <h3 style="color: #FF671E; font-size: 20px; font-weight: 600; margin: 0 0 15px 0;">Bonjour${userName ? ` ${userName}` : ''} 👋</h3>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte ZaLaMa. 
            Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #FF671E 0%, #FF8C5A 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 25px rgba(255, 103, 30, 0.3); transition: all 0.3s ease;">
              🔐 Réinitialiser mon mot de passe
            </a>
          </div>
          
          <div style="background-color: #FFF3E0; border: 1px solid #FFB74D; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
            <p style="color: #E65100; font-size: 14px; font-weight: 500; margin: 0;">
              ⏰ <strong>Important :</strong> Ce lien expire dans 1 heure pour des raisons de sécurité
            </p>
          </div>
          
          <div style="background-color: #E8F5E8; border: 1px solid #81C784; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
            <p style="color: #2E7D32; font-size: 14px; font-weight: 500; margin: 0;">
              🔒 <strong>Sécurisé :</strong> Ce lien est protégé et ne peut être utilisé qu'une seule fois
            </p>
          </div>
        </div>
        
        <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; border: 1px solid #FFE4D6;">
          <h4 style="color: #FF671E; font-size: 16px; font-weight: 600; margin: 0 0 10px 0;">Lien alternatif :</h4>
          <p style="color: #6B7280; font-size: 14px; line-height: 1.5; margin: 0;">
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
          </p>
          <a href="${resetLink}" style="color: #FF671E; text-decoration: none; word-break: break-all; font-size: 13px; display: block; margin-top: 8px; padding: 8px; background-color: #FFF3E0; border-radius: 4px;">
            ${resetLink}
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background-color: #FF671E; padding: 25px; text-align: center; font-size: 14px; color: #ffffff; border-radius: 0 0 12px 12px;">
        <p style="margin: 0 0 15px 0; font-weight: 500;">ZaLaMa - Votre partenaire financier de confiance</p>
        <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td style="background: linear-gradient(135deg, #FF8C5A 0%, #FFB74D 100%); padding: 12px 30px; border-radius: 10px; border: 1px solid #ffffff;">
              <a href="mailto:contact@zalamagn.com" style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">Contactez-nous</a>
            </td>
          </tr>
        </table>
        <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.8;">© 2024 ZaLaMa. Tous droits réservés.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const forgotPasswordEmailText = (resetLink: string, userName?: string) => `
Bonjour${userName ? ` ${userName}` : ''},

Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte ZaLaMa.

Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.

Pour réinitialiser votre mot de passe, cliquez sur le lien suivant :
${resetLink}

IMPORTANT : Ce lien expire dans 1 heure pour des raisons de sécurité.

SÉCURISÉ : Ce lien est protégé et ne peut être utilisé qu'une seule fois.

Si le lien ne fonctionne pas, copiez et collez l'URL dans votre navigateur.

Cordialement,
L'équipe ZaLaMa

---
ZaLaMa - Votre partenaire financier de confiance
© 2024 ZaLaMa. Tous droits réservés.
`; 