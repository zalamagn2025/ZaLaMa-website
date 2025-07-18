# Guide de Test - Demandes d'Avances sur Salaire

## 📋 Vue d'ensemble

Ce guide explique comment utiliser le script de test `test-salary-advance-requests.js` pour tester complètement le système de demandes d'avances sur salaire de Zalama.

## 🎯 Objectifs du Test

Le script teste les aspects suivants :

1. **Connexion Supabase** - Vérification de la connectivité
2. **Création de données de test** - Partenaire et employé
3. **Authentification** - Test de connexion utilisateur
4. **API de demandes d'avance** - Tests POST et GET
5. **Règles de validation** - Limites, mot de passe, données requises
6. **Requêtes de base de données** - Vérification des données
7. **Demandes multiples** - Tests de plusieurs demandes
8. **Gestion d'erreurs** - Cas d'erreur et rejets

## 🚀 Installation et Configuration

### Prérequis

```bash
# Installer les dépendances
npm install @supabase/supabase-js dotenv

# Vérifier les variables d'environnement
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Optionnel
```

### Structure des Variables d'Environnement

```env
# Supabase (requis)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Application (optionnel, pour tests API)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🧪 Exécution des Tests

### Test Complet

```bash
# Exécuter tous les tests
node test-salary-advance-requests.js
```

### Test avec Nettoyage

```bash
# Exécuter et nettoyer automatiquement
node test-salary-advance-requests.js --cleanup
```

## 📊 Interprétation des Résultats

### Logs de Succès

```
✅ [2024-01-15T10:30:00.000Z] Connexion Supabase réussie
✅ [2024-01-15T10:30:01.000Z] Partenaire créé: 123e4567-e89b-12d3-a456-426614174000
✅ [2024-01-15T10:30:02.000Z] Employé créé: 987fcdeb-51a2-43d1-b789-123456789abc
✅ [2024-01-15T10:30:03.000Z] Authentification réussie
✅ [2024-01-15T10:30:04.000Z] Demande valide créée avec succès
```

### Logs d'Erreur

```
❌ [2024-01-15T10:30:05.000Z] Erreur de connexion: Invalid API key
⚠️ [2024-01-15T10:30:06.000Z] Demande 4 rejetée: Cette demande dépasse votre limite mensuelle
🔍 [2024-01-15T10:30:07.000Z] Détails erreur: { message: "Données employé introuvables" }
```

### Logs de Debug

```
🔍 [2024-01-15T10:30:08.000Z] ID de la demande: 456def78-9abc-4def-8ghi-jklmnopqrstu
🔍 [2024-01-15T10:30:09.000Z] Salaire net: 1500000 GNF
🔍 [2024-01-15T10:30:10.000Z] 3 demandes d'avance trouvées
```

## 🔧 Configuration des Tests

### Données de Test

Le script utilise les données de test suivantes :

```javascript
const TEST_CONFIG = {
  testEmployee: {
    email: 'test.employee@example.com',
    password: 'TestPassword123!',
    nom: 'Test',
    prenom: 'Employee',
    telephone: '+224123456789',
    salaire_net: 1500000, // 1.5M GNF
  },
  
  testPartner: {
    nom_entreprise: 'Entreprise Test SARL',
    email_rh: 'rh@test-entreprise.com',
    telephone_rh: '+224987654321',
    email_representant: 'representant@test-entreprise.com',
    telephone_representant: '+224111222333'
  },
  
  testAdvanceRequests: [
    {
      montantDemande: 500000, // 500K GNF
      typeMotif: 'transport',
      motif: 'Achat de carburant pour déplacements professionnels'
    },
    // ... autres demandes
  ]
}
```

### Personnalisation

Pour modifier les données de test :

1. **Changer les emails** : Modifiez `testEmployee.email` et `testPartner.*`
2. **Ajuster les montants** : Modifiez `salaire_net` et `montantDemande`
3. **Ajouter des demandes** : Étendez `testAdvanceRequests`
4. **Changer les types** : Utilisez les valeurs de `REQUEST_TYPES`

## 📋 Tests Spécifiques

### 1. Test de Connexion

```javascript
await testSupabaseConnection()
```

**Vérifie :**
- Connectivité à Supabase
- Accès aux tables
- Configuration des variables d'environnement

### 2. Test de Création de Données

```javascript
const partnerId = await createTestPartner()
const employee = await createTestEmployee(partnerId)
```

**Vérifie :**
- Création de partenaires
- Création d'employés
- Liaison employé-partenaire
- Authentification Supabase

### 3. Test d'API

```javascript
await testSalaryAdvanceAPI(employee, partnerId)
```

**Vérifie :**
- Demande valide (500K GNF)
- Demande rejetée (2M GNF - dépasse limite)
- Récupération des demandes (GET)

### 4. Test de Validation

```javascript
await testValidationRules(employee, partnerId)
```

**Vérifie :**
- Mot de passe incorrect
- Données manquantes
- Montants négatifs
- Limites mensuelles

### 5. Test de Demandes Multiples

```javascript
await testMultipleRequests(employee, partnerId)
```

**Vérifie :**
- 4 demandes différentes
- Types de motifs variés
- Calculs de frais de service
- Gestion des limites

## 🐛 Dépannage

### Erreurs Courantes

#### 1. Variables d'Environnement Manquantes

```
❌ Variables d'environnement Supabase manquantes
```

**Solution :**
```bash
# Vérifier le fichier .env
cat .env

# Ou définir directement
export NEXT_PUBLIC_SUPABASE_URL=your_url
export NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

#### 2. Erreur de Connexion Supabase

```
❌ Erreur de connexion: Invalid API key
```

**Solution :**
- Vérifier la clé API dans Supabase
- S'assurer que la clé anon est correcte
- Vérifier les permissions RLS

#### 3. Erreur d'Authentification

```
❌ Erreur création utilisateur auth: User already registered
```

**Solution :**
- L'utilisateur existe déjà
- Le script réutilisera l'utilisateur existant
- Ou supprimer manuellement dans Supabase

#### 4. Erreur API

```
❌ Erreur API: connect ECONNREFUSED
```

**Solution :**
- Vérifier que l'app Next.js est démarrée
- Vérifier `NEXT_PUBLIC_APP_URL`
- Tester l'URL manuellement

### Vérifications Manuelles

#### 1. Vérifier les Tables Supabase

```sql
-- Vérifier les employés
SELECT * FROM employees WHERE email = 'test.employee@example.com';

-- Vérifier les partenaires
SELECT * FROM partners WHERE nom_entreprise = 'Entreprise Test SARL';

-- Vérifier les demandes d'avance
SELECT * FROM salary_advance_requests ORDER BY date_creation DESC;

-- Vérifier les transactions
SELECT * FROM financial_transactions ORDER BY date_transaction DESC;
```

#### 2. Vérifier les Logs de l'Application

```bash
# Dans le terminal de l'app Next.js
npm run dev

# Observer les logs lors de l'exécution du test
```

#### 3. Vérifier les Permissions RLS

```sql
-- Vérifier les politiques RLS
SELECT * FROM pg_policies WHERE tablename = 'salary_advance_requests';
```

## 📈 Métriques de Performance

### Temps d'Exécution Typiques

- **Test complet** : 30-60 secondes
- **Test de connexion** : 2-5 secondes
- **Création de données** : 10-20 secondes
- **Tests API** : 15-30 secondes
- **Tests de validation** : 10-15 secondes

### Indicateurs de Succès

- ✅ Tous les tests passent
- ✅ Aucune erreur critique
- ✅ Données créées correctement
- ✅ API répond comme attendu
- ✅ Validations fonctionnent

## 🔄 Maintenance

### Nettoyage Régulier

```bash
# Nettoyer manuellement dans Supabase
DELETE FROM salary_advance_requests WHERE employe_id IN (
  SELECT id FROM employees WHERE email = 'test.employee@example.com'
);

DELETE FROM financial_transactions WHERE utilisateur_id IN (
  SELECT id FROM employees WHERE email = 'test.employee@example.com'
);

DELETE FROM employees WHERE email = 'test.employee@example.com';
DELETE FROM partners WHERE nom_entreprise = 'Entreprise Test SARL';
```

### Mise à Jour des Tests

1. **Ajouter de nouveaux cas de test**
2. **Modifier les données de test**
3. **Ajouter de nouvelles validations**
4. **Mettre à jour les types TypeScript**

## 📞 Support

### En Cas de Problème

1. **Vérifier les logs** - Tous les détails sont affichés
2. **Tester manuellement** - Utiliser l'interface Supabase
3. **Vérifier la configuration** - Variables d'environnement
4. **Consulter la documentation** - API et base de données

### Logs Détaillés

Le script génère des logs détaillés pour :
- Chaque étape du test
- Les erreurs avec contexte
- Les données créées
- Les réponses API
- Les validations

## 🎯 Prochaines Étapes

Après avoir exécuté les tests :

1. **Analyser les résultats** - Vérifier tous les ✅
2. **Corriger les erreurs** - Si des ❌ apparaissent
3. **Optimiser les performances** - Si nécessaire
4. **Ajouter de nouveaux tests** - Pour de nouvelles fonctionnalités
5. **Documenter les changements** - Mettre à jour ce guide

---

**Note :** Ce script est conçu pour tester l'environnement de développement. Pour les tests de production, utilisez des données de test appropriées et des environnements isolés. 