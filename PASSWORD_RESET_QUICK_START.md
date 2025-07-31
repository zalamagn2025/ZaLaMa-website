# 🚀 Guide de Démarrage Rapide - Réinitialisation de Mot de Passe

## ⚡ Installation Express

### 1. Variables d'Environnement
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_APP_URL=https://zalamagn.com
```

### 2. Base de Données
```sql
-- Exécuter dans Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_hash ON public.password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON public.password_reset_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_used ON public.password_reset_tokens(used);
```

### 3. Démarrage
```bash
npm install
npm run dev
```

## 🔗 API Endpoints

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/auth/send-reset-email` | POST | Envoi d'email de réinitialisation |
| `/api/auth/verify-reset-code` | POST | Vérification du token |
| `/api/auth/reset-password` | POST | Réinitialisation du mot de passe |

## 📁 Fichiers Principaux

```
src/
├── app/
│   ├── api/auth/
│   │   ├── send-reset-email/route.ts      # Génération et envoi d'email
│   │   ├── verify-reset-code/route.ts     # Vérification de token
│   │   └── reset-password/route.ts        # Réinitialisation mot de passe
│   └── auth/
│       └── reset-password/page.tsx        # Page de réinitialisation
├── components/ui/
│   └── sign-in-card-2.tsx                 # Interface de connexion
└── services/
    └── resendEmailService.ts              # Service d'envoi d'emails
```

## 🧪 Test Rapide

### 1. Créer un utilisateur de test
```sql
INSERT INTO employees (nom, prenom, email, poste, genre, type_contrat, actif)
VALUES ('Test', 'User', 'test@example.com', 'Employé', 'Homme', 'CDI', true);
```

### 2. Tester le flux
1. Aller sur `https://zalamagn.com/login`
2. Cliquer "Mot de passe oublié"
3. Saisir `test@example.com`
4. Vérifier l'email
5. Cliquer sur le lien
6. Réinitialiser le mot de passe

## 🔍 Logs de Débogage

```bash
# Dans le terminal
npm run dev

# Observer les logs :
🔐 Demande de réinitialisation pour: test@example.com
🔒 Token de réinitialisation généré: {...}
✅ Email envoyé avec succès pour: test@example.com
```

## 🚨 Problèmes Courants

| Problème | Solution |
|----------|----------|
| Email non reçu | Vérifier spam, config Resend |
| Lien invalide | Vérifier NEXT_PUBLIC_APP_URL |
| Erreur DB | Exécuter le script SQL |
| Token expiré | Demander un nouveau lien |

## 📞 Support

- **Documentation complète** : `README_PASSWORD_RESET.md`
- **Logs** : Console du serveur
- **Base de données** : Supabase Dashboard

---

**Développé par l'équipe ZaLaMa** 🚀 