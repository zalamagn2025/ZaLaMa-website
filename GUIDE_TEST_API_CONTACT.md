# 📧 Guide de Test - API Contact ZaLaMa

## 🎯 Objectif

Tester l'envoi d'emails via l'API de contact avec validation du rate limiting (3 messages/heure par IP) et envoi vers `support@zalamagn.com`.

## 📋 Prérequis

### 1. Configuration Email

- ✅ Configurer `support@zalamagn.com` (en attente de Mory)
- ✅ Vérifier que `RESEND_API_KEY` est configuré dans `.env.local`
- ✅ Domaine `zalamagn.com` vérifié dans Resend

### 2. Base de Données

- ✅ Exécuter le script SQL pour créer la table `contacts`

```sql
-- Exécuter dans Supabase Dashboard > SQL Editor
-- Le fichier setup-contacts-table.sql contient le script complet
```

### 3. Serveur

- ✅ Serveur Next.js démarré : `npm run dev`

## 🚀 Exécution des Tests

### Étape 1 : Créer la table contacts

```bash
# Exécuter le script SQL dans Supabase Dashboard
# Fichier : setup-contacts-table.sql
```

### Étape 2 : Lancer les tests

```bash
# Depuis la racine du projet
node test-contact-api.js
```

## 📊 Tests Inclus

### 1. Test Principal

- ✅ **4 messages de test** avec données valides
- ✅ **Validation des champs** requis
- ✅ **Formats d'email** variés (gmail, outlook, yahoo)
- ✅ **Mesure du temps de réponse**

### 2. Test Rate Limiting

- ✅ **5 messages rapides** pour déclencher la limite
- ✅ **Vérification du blocage** après 3 messages
- ✅ **Messages d'erreur** appropriés

### 3. Vérifications de Sécurité

- ✅ **Anti-spam** : détection de mots-clés suspects
- ✅ **Longueur des messages** : min 10, max 2000 caractères
- ✅ **Domaines bloqués** : emails temporaires interdits
- ✅ **Rate limiting par IP** : max 3 messages/heure

## 📈 Résultats Attendus

### ✅ Succès Attendu

```
🧪 DÉBUT DES TESTS DE L'API CONTACT
============================================================
📡 URL de test : http://localhost:3000/api/contact
⏰ Test du rate limiting : 3 messages/heure par IP
📧 Destination : support@zalamagn.com

📨 Test 1/4 : Test 1 - Demande d'information
   ✅ Succès (200) - 1250ms
   📧 Email envoyé vers : support@zalamagn.com
   🆔 Message ID : re_abc123...

📨 Test 2/4 : Test 2 - Question tarifs
   ✅ Succès (200) - 890ms
   📧 Email envoyé vers : support@zalamagn.com
   🆔 Message ID : re_def456...

📨 Test 3/4 : Test 3 - Partenariat
   ✅ Succès (200) - 950ms
   📧 Email envoyé vers : support@zalamagn.com
   🆔 Message ID : re_ghi789...

📨 Test 4/4 : Test 4 - Rate Limiting
   ❌ Échec (429) - 120ms
   🚫 Erreur : Trop de messages envoyés. Réessayez dans 58 minutes
   ⏱️  Rate limiting activé ! IP bloquée temporairement

📊 RÉSUMÉ DES TESTS
========================================
✅ Succès : 3/4
❌ Échecs : 1/4
⚠️  Note : Les échecs peuvent être dus au rate limiting (normal après 3 messages)
```

### 🚫 Rate Limiting Test

```
🚫 TEST SPÉCIFIQUE DU RATE LIMITING
==================================================
Envoi de 5 messages rapides pour déclencher le rate limiting...

🚀 Requête rapide 1/5...
   ✅ Accepté (1/3 messages autorisés)
🚀 Requête rapide 2/5...
   ✅ Accepté (2/3 messages autorisés)
🚀 Requête rapide 3/5...
   ✅ Accepté (3/3 messages autorisés)
🚀 Requête rapide 4/5...
   🛑 Rate limiting déclenché ! (attendu après 3 messages)
   📝 Message : Trop de messages envoyés. Réessayez dans 59 minutes
```

## 🔍 Vérifications Post-Test

### 1. Base de Données Supabase

```sql
-- Vérifier les entrées dans la table contacts
SELECT
  id,
  nom,
  prenom,
  email,
  sujet,
  LEFT(message, 50) as message_preview,
  ip_address,
  statut,
  date_creation
FROM contacts
ORDER BY date_creation DESC
LIMIT 10;
```

### 2. Email support@zalamagn.com

- ✅ **3 emails reçus** avec les messages de test
- ✅ **Format HTML** correct avec toutes les informations
- ✅ **Reply-To** configuré sur l'email de l'expéditeur
- ✅ **ID Contact** inclus dans l'email

### 3. Logs Serveur

```
📧 Nouveau message de contact...
🌐 IP du client: ::1
✅ Validation réussie pour: jean.dupont@gmail.com
💾 Stockage du message dans Supabase...
✅ Message stocké dans Supabase avec ID: abc123...
📤 Envoi de l'email...
✅ Email envoyé avec succès, ID: re_def456...
```

## 🐛 Dépannage

### Erreur : Serveur non accessible

```bash
# Vérifier que le serveur Next.js est démarré
npm run dev
```

### Erreur : RESEND_API_KEY manquant

```bash
echo $RESEND_API_KEY  # Vérifier la variable d'environnement
```

### Erreur : Table contacts n'existe pas

```sql
-- Exécuter le script setup-contacts-table.sql dans Supabase
```

### Rate Limiting permanent

```bash
# Attendre 1 heure ou redémarrer le serveur pour reset le cache en mémoire
```

## 📝 Notes Importantes

1. **Email de Destination** : `support@zalamagn.com` doit être configuré avant les tests
2. **Rate Limiting** : Cache en mémoire, se remet à zéro au redémarrage du serveur
3. **Sécurité** : Domaines temporaires bloqués, anti-spam basique actif
4. **Performance** : Temps de réponse mesuré pour chaque requête
5. **Logs** : Tous les détails sont loggés côté serveur

## ✅ Checklist de Validation

- [ ] Table `contacts` créée dans Supabase
- [ ] Email `support@zalamagn.com` configuré
- [ ] Variable `RESEND_API_KEY` définie
- [ ] Serveur Next.js démarré
- [ ] Script de test exécuté avec succès
- [ ] 3 premiers messages envoyés (200)
- [ ] 4ème message bloqué (429 - Rate Limiting)
- [ ] Emails reçus sur support@zalamagn.com
- [ ] Données enregistrées dans Supabase
- [ ] Rate limiting fonctionnel

## 🎉 Succès

Si tous les tests passent, l'API de contact est opérationnelle et prête pour la production !
