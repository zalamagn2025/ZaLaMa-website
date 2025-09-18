# Guide de Dépannage Rapide - Paramètres du Profil

## 🚨 Problème : Les modifications ne fonctionnent pas

### Étape 1 : Diagnostic automatique
Ouvrez la console du navigateur (F12) et exécutez :

```javascript
// Copier-coller ce script dans la console
window.profileDebug.runDiagnostic();
```

### Étape 2 : Vérifications manuelles

#### 2.1 Vérifier l'authentification
```javascript
// Dans la console
const token = localStorage.getItem('access_token') || localStorage.getItem('employee_access_token');
/*console.log('Token présent:', !!token)*/
```

#### 2.2 Vérifier les données utilisateur
```javascript
// Dans la console
/*console.log('Données employé:', window.employeeData)*/
```

#### 2.3 Tester l'API de mise à jour
```javascript
// Dans la console
const testData = { nom: 'Test_' + Date.now() };
fetch('/api/auth/update-profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
}).then(r => r.json()).then(console.log);
```

### Étape 3 : Solutions rapides

#### 3.1 Si l'authentification échoue
```javascript
// Vider le cache et se reconnecter
localStorage.clear();
sessionStorage.clear();
location.reload();
```

#### 3.2 Si les données utilisateur sont manquantes
```javascript
// Forcer le rafraîchissement du contexte
if (window.refreshProfile) {
  window.refreshProfile();
}
```

#### 3.3 Si l'API ne répond pas
```javascript
// Vérifier la configuration
/*console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)*/
```

### Étape 4 : Test de l'upload de photo

#### 4.1 Tester l'upload manuellement
```javascript
// Dans la console
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

### Étape 5 : Vérifications d'interface

#### 5.1 Vérifier que les champs sont contrôlés
```javascript
// Dans la console, vérifier que les champs utilisent 'value' et non 'defaultValue'
document.querySelectorAll('input[type="text"], input[type="tel"], textarea').forEach(input => {
  /*console.log('Champ:', input.name || input.placeholder, 'Contrôlé:', input.hasAttribute('value')*/);
});
```

#### 5.2 Vérifier les événements
```javascript
// Dans la console, vérifier que les boutons ont des événements
document.querySelectorAll('button').forEach(button => {
  if (button.textContent.includes('Enregistrer')) {
    /*console.log('Bouton Enregistrer trouvé:', button)*/
  }
});
```

## 🔧 Solutions spécifiques

### Problème : Les champs ne se mettent pas à jour
**Solution :** Vérifier que les champs utilisent `value` et non `defaultValue`

### Problème : L'upload de photo ne fonctionne pas
**Solution :** Vérifier le token d'authentification et les permissions

### Problème : Les modifications ne se sauvegardent pas
**Solution :** Vérifier que l'API route fonctionne correctement

### Problème : Pas de message de confirmation
**Solution :** Vérifier que les toasts sont bien configurés

## 📞 Support

Si les problèmes persistent :

1. **Exécuter le diagnostic complet** : `window.profileDebug.runDiagnostic()`
2. **Vérifier les logs de la console** pour des erreurs spécifiques
3. **Tester avec un autre navigateur** pour exclure les problèmes de cache
4. **Vérifier la connexion réseau** et les pare-feu

## 🎯 Commandes rapides

```javascript
// Diagnostic complet
window.profileDebug.runDiagnostic();

// Vérifier l'authentification
window.profileDebug.checkAuth();

// Tester l'API de mise à jour
window.profileDebug.testUpdateAPI();

// Tester l'upload de photo
window.profileDebug.testPhotoUpload();
```

---

**Note :** Ce guide est conçu pour un diagnostic rapide. Pour des problèmes complexes, consultez le guide complet de dépannage.

