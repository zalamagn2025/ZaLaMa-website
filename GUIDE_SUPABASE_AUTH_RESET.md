# 🔐 Guide de configuration - Réinitialisation mot de passe avec Supabase Auth

## 🎯 Vue d'ensemble

Ce guide détaille la configuration de la réinitialisation de mot de passe en utilisant Supabase Auth directement, ce qui simplifie grandement l'implémentation et améliore la sécurité.

## ✅ Avantages de Supabase Auth

- **Sécurité native** : Gestion automatique des tokens et expirations
- **Email intégré** : Templates d'email personnalisables
- **Gestion d'erreurs** : Erreurs standardisées et sécurisées
- **Monitoring** : Logs et analytics intégrés
- **Maintenance réduite** : Pas de gestion manuelle des tokens

## 🔧 Configuration Supabase

### 1. Configuration des URLs de redirection

Dans votre dashboard Supabase :

1. **Authentication** → **URL Configuration**
2. **Site URL** : `https://zalamagn.com`
3. **Redirect URLs** : 
   - `https://zalamagn.com/reset-password`
   - `http://localhost:3000/reset-password` (développement)

### 2. Configuration des templates d'email

1. **Authentication** → **Email Templates**
2. **Password Reset** → **Customize**
3. **Configuration recommandée** :

```html
<!-- Template personnalisé pour ZaLaMa -->
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a1525 0%, #1a2332 100%); color: #ffffff; padding: 40px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #FF671E 0%, #FF8C5A 100%); border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
      <span style="font-size: 24px; font-weight: 800; color: white;">ZL</span>
    </div>
    <h1 style="color: white; margin: 0;">Réinitialisation de mot de passe</h1>
  </div>
  
  <p style="color: #b0b0b0; line-height: 1.6;">
    Bonjour,<br><br>
    Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte ZaLaMa.
  </p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{ .ConfirmationURL }}" style="background: linear-gradient(135deg, #FF671E 0%, #FF8C5A 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; display: inline-block;">
      🔐 Réinitialiser mon mot de passe
    </a>
  </div>
  
  <div style="background: rgba(255, 103, 30, 0.1); border: 1px solid rgba(255, 103, 30, 0.2); border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center;">
    <div style="color: #FF671E; font-size: 14px; font-weight: 500;">
      ⏰ Ce lien expire dans 1 heure pour des raisons de sécurité
    </div>
  </div>
  
  <p style="color: #909090; font-size: 14px;">
    Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
  </p>
  
  <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
    <p style="color: #808080; font-size: 12px;">
      ZaLaMa - Votre partenaire financier de confiance<br>
      © 2024 ZaLaMa. Tous droits réservés.
    </p>
  </div>
</div>
```

### 3. Configuration des variables d'environnement

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://zalamagn.com
```

## 🚀 Implémentation

### 1. API de demande de réinitialisation

```typescript
// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validation de l'email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    // URL de redirection pour la réinitialisation
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`;

    // Utiliser Supabase Auth
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error('❌ Erreur Supabase Auth:', error);
      
      // Gestion des erreurs spécifiques
      switch (error.message) {
        case 'User not found':
          // Pour des raisons de sécurité, on ne révèle pas si l'email existe
          return NextResponse.json({
            message: 'Si un compte est associé à cette adresse, un lien de réinitialisation vous a été envoyé.'
          });
        case 'Invalid email':
          return NextResponse.json(
            { error: 'Format d\'email invalide' },
            { status: 400 }
          );
        case 'Too many requests':
          return NextResponse.json(
            { error: 'Trop de tentatives. Veuillez réessayer plus tard.' },
            { status: 429 }
          );
        default:
          return NextResponse.json(
            { error: 'Erreur lors de l\'envoi de l\'email' },
            { status: 500 }
          );
      }
    }

    return NextResponse.json({
      message: 'Si un compte est associé à cette adresse, un lien de réinitialisation vous a été envoyé.',
      success: true
    });

  } catch (error) {
    console.error('❌ Erreur API forgot-password:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
```

### 2. Page de réinitialisation

```typescript
// src/app/reset-password/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Vérifier les paramètres de l'URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');

    if (accessToken && type === 'recovery') {
      setIsValidToken(true);
      setMessage('Veuillez entrer votre nouveau mot de passe.');
    } else {
      setMessage('Lien de réinitialisation invalide ou expiré.');
      setIsValidToken(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 8) {
      setMessage('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setMessage('Erreur lors de la réinitialisation du mot de passe.');
      } else {
        setMessage('Mot de passe réinitialisé avec succès !');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (error) {
      setMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        {/* Contenu du formulaire */}
        {isValidToken ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champs de mot de passe */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              minLength={8}
            />
            
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              minLength={8}
            />
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-medium"
            >
              {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-white mb-6">Lien de réinitialisation invalide.</p>
            <button
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg"
            >
              Retour à la connexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

## 🧪 Tests

### 1. Test de l'API

```bash
# Test de la demande de réinitialisation
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### 2. Test de la page

1. **Demander une réinitialisation** via l'interface
2. **Vérifier l'email** reçu
3. **Cliquer sur le lien** dans l'email
4. **Tester la réinitialisation** sur la page

## 📊 Monitoring

### Logs Supabase :

```sql
-- Voir les tentatives de réinitialisation
SELECT * FROM auth.users 
WHERE email_confirmed_at IS NOT NULL 
ORDER BY created_at DESC;

-- Voir les sessions actives
SELECT * FROM auth.sessions 
WHERE user_id = 'user-uuid';
```

### Dashboard Supabase :

- **Authentication** → **Users** : Voir les utilisateurs
- **Authentication** → **Logs** : Voir les tentatives de connexion
- **Authentication** → **Settings** : Configuration générale

## 🛡️ Sécurité

### Mesures automatiques de Supabase :

1. **Rate limiting** : Limitation des tentatives
2. **Token expiration** : Expiration automatique des liens
3. **Email validation** : Validation des adresses email
4. **Session management** : Gestion automatique des sessions
5. **Audit logs** : Logs complets des actions

### Bonnes pratiques :

1. **Ne jamais révéler** si un email existe ou non
2. **Utiliser HTTPS** en production
3. **Configurer les domaines** correctement
4. **Monitorer les tentatives** d'abus
5. **Tester régulièrement** la fonctionnalité

## 🚨 Dépannage

### Problèmes courants :

1. **Email non reçu** :
   - Vérifier le dossier spam
   - Vérifier la configuration SMTP dans Supabase
   - Vérifier les logs Supabase

2. **Lien invalide** :
   - Vérifier les URLs de redirection dans Supabase
   - Vérifier que le domaine est correctement configuré
   - Vérifier l'expiration du token

3. **Erreur de réinitialisation** :
   - Vérifier les paramètres de l'URL
   - Vérifier la session utilisateur
   - Vérifier les logs d'erreur

### Commandes de débogage :

```bash
# Vérifier la configuration Supabase
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Tester l'API
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Vérifier les logs
tail -f logs/application.log | grep "password"
```

## ✅ Checklist de validation

- [ ] URLs de redirection configurées dans Supabase
- [ ] Template d'email personnalisé configuré
- [ ] Variables d'environnement définies
- [ ] API `/api/auth/forgot-password` fonctionnelle
- [ ] Page `/reset-password` créée et fonctionnelle
- [ ] Tests de bout en bout validés
- [ ] Monitoring et logs activés
- [ ] Documentation mise à jour

## 🎉 Résultat final

Une solution de réinitialisation de mot de passe complète et sécurisée avec :
- ✅ Utilisation de Supabase Auth native
- ✅ Gestion automatique des tokens et expirations
- ✅ Templates d'email personnalisés
- ✅ Page de réinitialisation moderne
- ✅ Monitoring et logs complets
- ✅ Configuration optimisée pour la production

**La solution Supabase Auth est prête pour la production !** 🚀 