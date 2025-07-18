# 🌙☀️ Guide d'utilisation du système de thème ZaLaMa

## Vue d'ensemble

Le système de thème ZaLaMa permet aux utilisateurs de basculer entre trois modes :
- **Mode clair** : Interface claire avec fond blanc/gris clair
- **Mode sombre** : Interface sombre avec fond bleu foncé (par défaut)
- **Mode système** : Suit automatiquement les préférences du système d'exploitation

## 🎯 Fonctionnalités implémentées

### ✅ Système de gestion du thème
- **next-themes** pour la gestion robuste des thèmes
- Persistance dans `localStorage` avec la clé `zalama-theme`
- Détection automatique du thème système
- Transitions fluides entre les thèmes

### ✅ Composant ThemeToggle
- **3 variantes** : `button`, `switch`, `dropdown`
- **3 tailles** : `sm`, `md`, `lg`
- **Icônes dynamiques** : 🌞 (clair), 🌙 (sombre), 🖥️ (système)
- **Animations** avec Framer Motion
- **Tooltips informatifs**

### ✅ Styles CSS adaptatifs
- Variables CSS pour les couleurs ZaLaMa
- Classes conditionnelles `dark:` pour Tailwind
- Transitions fluides (0.3s)
- Styles spécifiques pour le mode clair

### ✅ Intégration dans l'interface
- **Header** : Bouton de thème dans la navigation
- **ProfileSettings** : Switch dans la section Apparence
- **Menu mobile** : Toggle accessible sur mobile

## 🚀 Utilisation

### Pour les utilisateurs

1. **Dans le header** : Cliquer sur le bouton thème (icône soleil/lune)
2. **Dans les paramètres** : Aller dans Paramètres > Apparence > Thème
3. **Cycle des thèmes** : Clair → Sombre → Système → Clair

### Pour les développeurs

```tsx
// Import du composant
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Utilisation basique
<ThemeToggle />

// Avec options
<ThemeToggle 
  variant="switch" 
  size="md" 
  className="custom-class" 
/>
```

## 🎨 Styles et couleurs

### Mode sombre (par défaut)
- **Fond principal** : `#0a1525` (bleu très sombre)
- **Cartes** : `#0c1a2e` (bleu sombre)
- **Texte** : `#e5e7ef` (blanc cassé)
- **Bordures** : `#1e3a70` (bleu)

### Mode clair
- **Fond principal** : `#f5f7fa` (gris très clair)
- **Cartes** : `#ffffff` (blanc)
- **Texte** : `#1e293b` (gris foncé)
- **Bordures** : `#cbd5e1` (gris clair)

## 🔧 Configuration technique

### Provider (src/components/providers.tsx)
```tsx
<NextThemesProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem
  disableTransitionOnChange={false}
  storageKey="zalama-theme"
>
```

### Variables CSS (src/app/globals.css)
```css
:root {
  --zalama-orange: #FF671E;
  --zalama-bg-dark: #0a1525;
  --zalama-text: #e5e7ef;
  /* ... */
}

[data-theme="light"] {
  --zalama-bg-dark: #f5f7fa;
  --zalama-text: #1e293b;
  /* ... */
}
```

## 🧪 Tests

### Script de test
```bash
node test-theme-implementation.js
```

### Checklist de vérification
- [ ] Le thème change sans rechargement
- [ ] Le choix est sauvegardé dans localStorage
- [ ] Les transitions sont fluides
- [ ] L'interface s'adapte correctement
- [ ] Le thème système est détecté
- [ ] Les icônes changent dynamiquement

## 🐛 Dépannage

### Problèmes courants

1. **Le thème ne change pas**
   - Vérifier que `next-themes` est installé
   - Vérifier que le provider entoure l'app

2. **Styles incohérents**
   - Vérifier les classes `dark:` dans les composants
   - Vérifier les variables CSS

3. **Pas de persistance**
   - Vérifier la clé `storageKey` dans le provider
   - Vérifier les permissions localStorage

### Debug
```javascript
// Vérifier le thème actuel
console.log(localStorage.getItem('zalama-theme'));

// Vérifier la classe dark
console.log(document.documentElement.classList.contains('dark'));

// Vérifier les variables CSS
console.log(getComputedStyle(document.documentElement).getPropertyValue('--zalama-bg-dark'));
```

## 📈 Améliorations futures

- [ ] Thème personnalisé par utilisateur (Supabase)
- [ ] Animations plus sophistiquées
- [ ] Thème saisonnier (Noël, etc.)
- [ ] Mode haute contraste
- [ ] Thème automatique selon l'heure

## 🎉 Résultat

✅ **Système de thème complet et fonctionnel**
✅ **Interface cohérente en mode clair et sombre**
✅ **Expérience utilisateur fluide**
✅ **Code maintenable et extensible** 