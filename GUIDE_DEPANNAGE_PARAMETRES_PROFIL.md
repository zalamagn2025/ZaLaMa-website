# Guide de Dépannage - Paramètres du Profil Utilisateur

## Problèmes identifiés et solutions

### 🔧 Problème 1: Les modifications ne sont pas sauvegardées

**Symptômes:**
- Les champs de saisie ne conservent pas les modifications
- Les boutons "Enregistrer" ne fonctionnent pas
- Aucun message de confirmation

**Solutions:**
1. **Vérifier l'authentification:**
   ```javascript
   // Dans la console du navigateur
   console.log('Token:', localStorage.getItem('access_token') || localStorage.getItem('employee_access_token'));
   ```

2. **Vérifier les données utilisateur:**
   ```javascript
   // Dans la console du navigateur
   console.log('Données employé:', window.employeeData);
   ```

3. **Tester l'API de mise à jour:**
   ```javascript
   // Exécuter le test automatique
   window.testProfileSettings();
   ```

### 🔧 Problème 2: L'upload de photo ne fonctionne pas

**Symptômes:**
- La modal d'upload s'ouvre mais l'image ne se téléverse pas
- Erreur "Token d'authentification manquant"
- L'aperçu ne se met pas à jour

**Solutions:**
1. **Vérifier le token d'accès:**
   ```javascript
   const token = localStorage.getItem('access_token') || localStorage.getItem('employee_access_token');
   if (!token) {
     console.error('Token manquant - reconnectez-vous');
   }
   ```

2. **Vérifier le format et la taille du fichier:**
   - Formats acceptés: JPG, PNG, WebP
   - Taille maximale: 5MB

3. **Tester l'upload manuellement:**
   ```javascript
   // Créer un fichier de test
   const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
   const formData = new FormData();
   formData.append('photo', testFile);
   
   fetch('/api/auth/upload-photo', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
     },
     body: formData,
   }).then(r => r.json()).then(console.log);
   ```

### 🔧 Problème 3: Les données ne se synchronisent pas

**Symptômes:**
- Les modifications ne s'affichent pas immédiatement
- Il faut recharger la page pour voir les changements
- Les données affichées sont obsolètes

**Solutions:**
1. **Forcer le rafraîchissement du contexte:**
   ```javascript
   // Dans la console du navigateur
   if (window.refreshProfile) {
     window.refreshProfile();
   }
   ```

2. **Vérifier la mise à jour du contexte:**
   ```javascript
   // Vérifier que le contexte EmployeeAuthContext est bien mis à jour
   console.log('Contexte employé:', window.employeeContext);
   ```

### 🔧 Problème 4: Erreurs de CORS ou de réseau

**Symptômes:**
- Erreurs CORS dans la console
- "Failed to fetch" ou erreurs réseau
- Timeout des requêtes

**Solutions:**
1. **Vérifier la configuration CORS:**
   ```javascript
   // Vérifier que les headers CORS sont bien configurés
   fetch('/api/auth/getme', {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
     },
   }).then(r => {
     console.log('Headers CORS:', r.headers);
     return r.json();
   }).then(console.log);
   ```

2. **Vérifier les variables d'environnement:**
   ```javascript
   // Vérifier que NEXT_PUBLIC_SUPABASE_URL est défini
   console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
   ```

### 🔧 Problème 5: Problèmes d'affichage des données

**Symptômes:**
- Les champs sont vides même si l'utilisateur a des données
- Affichage "Utilisateur" au lieu du vrai nom
- Photo de profil ne s'affiche pas

**Solutions:**
1. **Vérifier la structure des données:**
   ```javascript
   // Afficher la structure complète des données utilisateur
   console.log('Structure des données:', {
     employee: window.employeeData,
     userData: window.userData,
     currentUserData: window.currentUserData
   });
   ```

2. **Vérifier les propriétés utilisées:**
   ```javascript
   // Vérifier les propriétés spécifiques
   const user = window.employeeData || window.userData;
   console.log('Propriétés utilisateur:', {
     nom: user?.nom,
     prenom: user?.prenom,
     photo_url: user?.photo_url,
     photoURL: user?.photoURL
   });
   ```

## Tests de diagnostic

### Test automatique complet
```javascript
// Exécuter tous les tests
window.testProfileSettings();
```

### Test manuel étape par étape
```javascript
// 1. Test d'authentification
const token = localStorage.getItem('access_token') || localStorage.getItem('employee_access_token');
console.log('Token présent:', !!token);

// 2. Test de récupération du profil
fetch('/api/auth/getme', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log);

// 3. Test de mise à jour du profil
fetch('/api/auth/update-profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ nom: 'Test' })
}).then(r => r.json()).then(console.log);
```

## Logs de débogage

### Activer les logs détaillés
```javascript
// Dans la console du navigateur
localStorage.setItem('debug', 'true');
console.log('Logs de débogage activés');
```

### Vérifier les logs du serveur
```bash
# Dans le terminal
npm run dev
# Regarder les logs pour les erreurs API
```

## Solutions rapides

### Réinitialiser l'état
```javascript
// Vider le cache et les tokens
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Forcer la mise à jour
```javascript
// Forcer la mise à jour du contexte
if (window.refreshProfile) {
  window.refreshProfile();
}
```

### Vérifier la configuration
```javascript
// Vérifier toutes les variables d'environnement
console.log('Configuration:', {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Défini' : 'Manquant'
});
```

## Contact et support

Si les problèmes persistent après avoir essayé ces solutions :

1. **Vérifier les logs de la console** pour des erreurs spécifiques
2. **Tester avec un autre navigateur** pour exclure les problèmes de cache
3. **Vérifier la connexion réseau** et les pare-feu
4. **Contacter l'équipe technique** avec les logs d'erreur complets

---

**Note:** Ce guide est mis à jour régulièrement. Vérifiez la version la plus récente pour les dernières solutions.

