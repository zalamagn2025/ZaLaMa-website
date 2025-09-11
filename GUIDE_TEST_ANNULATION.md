# Guide de Test de la Fonctionnalité d'Annulation

## Vue d'ensemble

Ce guide explique comment tester la fonctionnalité d'annulation des demandes d'avance sur salaire.

## Prérequis

### 1. Token d'authentification valide
Pour tester l'API, vous devez disposer d'un token JWT valide d'un employé connecté.

#### Comment obtenir un token valide :
1. **Via l'interface web** :
   - Connectez-vous à l'application
   - Ouvrez les outils de développement (F12)
   - Allez dans l'onglet "Application" ou "Storage"
   - Récupérez le token depuis `localStorage` ou `sessionStorage`
   - Clé : `employee_access_token`

2. **Via l'API de connexion** :
   ```bash
   curl -X POST "https://mspmrzlqhwpdkkburjiw.supabase.co/auth/v1/token?grant_type=password" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "votre-email@exemple.com",
       "password": "votre-mot-de-passe"
     }'
   ```

### 2. ID de demande valide
Vous devez disposer de l'ID d'une demande d'avance en statut "En attente" ou "En attente d'approbation RH".

#### Comment obtenir un ID de demande :
1. **Via l'interface web** :
   - Connectez-vous en tant qu'employé
   - Allez dans la section "Demandes d'avance"
   - Créez une nouvelle demande ou trouvez une demande en attente
   - L'ID est visible dans l'URL ou les données de la demande

2. **Via l'API de liste** :
   ```bash
   curl -X GET "https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/employee-demands/list" \
     -H "Authorization: Bearer VOTRE_TOKEN"
   ```

## Tests manuels

### 1. Test via l'interface web

#### Étapes :
1. **Connexion** : Connectez-vous en tant qu'employé
2. **Navigation** : Allez dans "Mes demandes d'avance"
3. **Identification** : Trouvez une demande avec le statut "En attente"
4. **Annulation** : Cliquez sur le bouton "Annuler" (rouge)
5. **Confirmation** : Remplissez le motif (optionnel) et confirmez
6. **Vérification** : Vérifiez que le statut a changé à "Annulée"

#### Résultats attendus :
- ✅ Le bouton "Annuler" n'apparaît que pour les demandes en attente
- ✅ La modal de confirmation s'ouvre correctement
- ✅ L'annulation fonctionne avec ou sans motif
- ✅ La liste se met à jour automatiquement
- ✅ Un message de succès s'affiche

### 2. Test via l'API REST

#### Test d'annulation avec motif :
```bash
curl -X POST "https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/employee-demands/cancel" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "ID_DE_VOTRE_DEMANDE",
    "reason": "Changement de situation personnelle"
  }'
```

#### Test d'annulation sans motif :
```bash
curl -X POST "https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/employee-demands/cancel" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "ID_DE_VOTRE_DEMANDE"
  }'
```

#### Réponses attendues :

**Succès (200)** :
```json
{
  "success": true,
  "message": "Demande annulée avec succès",
  "data": {
    "id": "ID_DE_LA_DEMANDE",
    "statut": "ANNULEE",
    "date_annulation": "2024-01-15T10:30:00Z",
    "motif_annulation": "Changement de situation personnelle"
  }
}
```

**Erreur - Token invalide (401)** :
```json
{
  "success": false,
  "error": "Token invalide ou employé non trouvé"
}
```

**Erreur - Demande non trouvée (404)** :
```json
{
  "success": false,
  "error": "Demande non trouvée"
}
```

**Erreur - Demande non annulable (400)** :
```json
{
  "success": false,
  "error": "Cette demande ne peut pas être annulée"
}
```

## Tests automatisés

### 1. Mise à jour du fichier de test

Modifiez le fichier `test-cancel-demand.js` avec vos valeurs :

```javascript
// Remplacez par votre token valide
const AUTH_TOKEN = 'VOTRE_TOKEN_ICI';

// Remplacez par l'ID d'une demande en attente
const DEMAND_ID = 'VOTRE_ID_DE_DEMANDE_ICI';
```

### 2. Exécution des tests

```bash
node test-cancel-demand.js
```

### 3. Tests avec différents outils

#### Avec Postman :
1. Importez la collection de tests fournie
2. Configurez les variables d'environnement
3. Exécutez les tests

#### Avec Thunder Client (VS Code) :
1. Ouvrez le fichier `test-verify-api-key.http`
2. Modifiez les variables
3. Exécutez les requêtes

## Cas de test à vérifier

### ✅ Cas de succès
- [ ] Annulation avec motif valide
- [ ] Annulation sans motif
- [ ] Annulation d'une demande en attente
- [ ] Annulation d'une demande en attente d'approbation RH

### ❌ Cas d'erreur
- [ ] Annulation sans token d'authentification
- [ ] Annulation avec token invalide/expiré
- [ ] Annulation avec ID de demande invalide
- [ ] Annulation d'une demande déjà validée
- [ ] Annulation d'une demande déjà rejetée
- [ ] Annulation d'une demande d'un autre employé

### 🔒 Cas de sécurité
- [ ] Un employé ne peut annuler que ses propres demandes
- [ ] Seules les demandes en attente peuvent être annulées
- [ ] L'authentification est requise pour toutes les opérations

## Dépannage

### Problèmes courants

#### 1. Erreur 401 - Token invalide
**Cause** : Token expiré ou invalide
**Solution** : Obtenir un nouveau token via la connexion

#### 2. Erreur 404 - Demande non trouvée
**Cause** : ID de demande incorrect ou demande supprimée
**Solution** : Vérifier l'ID et s'assurer que la demande existe

#### 3. Erreur 400 - Demande non annulable
**Cause** : Demande déjà traitée (validée/rejetée)
**Solution** : Utiliser une demande en statut "En attente"

#### 4. Bouton "Annuler" non visible
**Cause** : Demande pas en statut "En attente"
**Solution** : Vérifier le statut de la demande

### Logs utiles

#### Côté client (navigateur) :
```javascript
// Ouvrir la console (F12) et vérifier :
console.log('Token:', localStorage.getItem('employee_access_token'));
console.log('Demandes:', /* données des demandes */);
```

#### Côté serveur (Edge Function) :
- Vérifier les logs dans la console Supabase
- Surveiller les erreurs d'authentification
- Vérifier les requêtes à la base de données

## Validation finale

### Checklist de validation

- [ ] **Interface utilisateur** : Bouton d'annulation visible uniquement pour les demandes éligibles
- [ ] **Modal de confirmation** : S'ouvre correctement avec tous les éléments
- [ ] **Saisie du motif** : Champ optionnel fonctionnel
- [ ] **Confirmation d'annulation** : Traitement correct de l'action
- [ ] **Mise à jour de l'interface** : Liste rafraîchie après annulation
- [ ] **Notifications** : Messages de succès/erreur appropriés
- [ ] **Sécurité** : Seul le créateur peut annuler sa demande
- [ ] **Performance** : Temps de réponse acceptable
- [ ] **Responsive** : Fonctionne sur mobile et desktop
- [ ] **Accessibilité** : Navigation clavier et screen readers

### Tests de régression

Après chaque modification, vérifier que :
- [ ] La création de nouvelles demandes fonctionne toujours
- [ ] L'affichage des demandes existantes n'est pas cassé
- [ ] Les autres fonctionnalités ne sont pas affectées
- [ ] Les performances globales sont maintenues

## Support

En cas de problème :
1. Vérifier les logs de la console
2. Tester avec un token frais
3. Vérifier la connectivité réseau
4. Contacter l'équipe de développement avec les détails de l'erreur

