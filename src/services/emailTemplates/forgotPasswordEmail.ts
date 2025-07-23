export const forgotPasswordEmailTemplate = (resetLink: string, userName?: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe - ZaLaMa</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0a1525 0%, #1a2332 100%);
            color: #ffffff;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        
        .header {
            background: linear-gradient(135deg, #FF671E 0%, #FF8C5A 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.3;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }
        
        .logo-text {
            font-size: 24px;
            font-weight: 800;
            color: white;
            letter-spacing: -0.5px;
        }
        
        .content {
            padding: 40px 30px;
            position: relative;
        }
        
        .content::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(255, 103, 30, 0.03) 0%, rgba(255, 140, 90, 0.03) 100%);
            pointer-events: none;
        }
        
        .greeting {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .message {
            font-size: 16px;
            color: #b0b0b0;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        
        .cta-container {
            text-align: center;
            margin: 40px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #FF671E 0%, #FF8C5A 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(255, 103, 30, 0.3);
            position: relative;
            overflow: hidden;
        }
        
        .cta-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }
        
        .cta-button:hover::before {
            left: 100%;
        }
        
        .security-note {
            background: rgba(255, 103, 30, 0.1);
            border: 1px solid rgba(255, 103, 30, 0.2);
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
            text-align: center;
        }
        
        .security-icon {
            width: 24px;
            height: 24px;
            background: #FF671E;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
        }
        
        .security-text {
            font-size: 14px;
            color: #FF671E;
            font-weight: 500;
        }
        
        .footer {
            background: rgba(0, 0, 0, 0.3);
            padding: 30px;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .footer-text {
            font-size: 14px;
            color: #808080;
            margin-bottom: 15px;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
        }
        
        .social-link {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            color: #ffffff;
            transition: all 0.3s ease;
        }
        
        .social-link:hover {
            background: #FF671E;
            transform: translateY(-2px);
        }
        
        .expiry-warning {
            background: rgba(255, 193, 7, 0.1);
            border: 1px solid rgba(255, 193, 7, 0.3);
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        
        .expiry-text {
            font-size: 13px;
            color: #FFC107;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 20px;
                border-radius: 16px;
            }
            
            .header, .content, .footer {
                padding: 30px 20px;
            }
            
            .greeting {
                font-size: 24px;
            }
            
            .cta-button {
                padding: 14px 28px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">
                <div class="logo-text">ZL</div>
            </div>
            <h1 style="color: white; font-size: 20px; font-weight: 600; margin: 0;">Réinitialisation de mot de passe</h1>
        </div>
        
        <div class="content">
            <h2 class="greeting">Bonjour${userName ? ` ${userName}` : ''} 👋</h2>
            
            <p class="message">
                Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte ZaLaMa. 
                Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
            </p>
            
            <div class="cta-container">
                <a href="${resetLink}" class="cta-button">
                    🔐 Réinitialiser mon mot de passe
                </a>
            </div>
            
            <div class="security-note">
                <div class="security-icon">🔒</div>
                <div class="security-text">
                    Ce lien est sécurisé et expire dans 1 heure pour votre protection
                </div>
            </div>
            
            <div class="expiry-warning">
                <div class="expiry-text">
                    ⏰ Attention : Ce lien expire dans 1 heure pour des raisons de sécurité
                </div>
            </div>
            
            <p class="message" style="font-size: 14px; color: #909090;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                <a href="${resetLink}" style="color: #FF671E; word-break: break-all;">${resetLink}</a>
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                Cet email a été envoyé par ZaLaMa - Votre partenaire financier de confiance
            </p>
            <p class="footer-text" style="font-size: 12px;">
                © 2024 ZaLaMa. Tous droits réservés.
            </p>
            <div class="social-links">
                <a href="#" class="social-link">📧</a>
                <a href="#" class="social-link">📱</a>
                <a href="#" class="social-link">💼</a>
            </div>
        </div>
    </div>
</body>
</html>
`;

export const forgotPasswordEmailText = (resetLink: string, userName?: string) => `
Bonjour${userName ? ` ${userName}` : ''},

Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte ZaLaMa.

Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.

Pour réinitialiser votre mot de passe, cliquez sur le lien suivant :
${resetLink}

Ce lien expire dans 1 heure pour des raisons de sécurité.

Si le lien ne fonctionne pas, copiez et collez l'URL dans votre navigateur.

Cordialement,
L'équipe ZaLaMa

---
ZaLaMa - Votre partenaire financier de confiance
© 2024 ZaLaMa. Tous droits réservés.
`; 