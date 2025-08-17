# 💰 Intégration des Demandes d'Avance de Salaire

## 🎯 **APIs créées**

- `/api/employee-demands/list` - Liste des demandes
- `/api/employee-demands/create` - Créer une demande  
- `/api/employee-demands/stats` - Statistiques

## 🔧 **Utilisation**

```typescript
import { useEmployeeDemands } from '@/hooks/useEmployeeDemands';

function MyComponent() {
  const { demands, stats, createDemand } = useEmployeeDemands();

  const handleCreate = async () => {
    await createDemand({
      montant_demande: 500000,
      type_motif: 'Urgence',
      motif: 'Test'
    });
  };
}
```

## 🧪 **Test**

```bash
node test-employee-demands.js
```

## ✅ **Avantages**

- Edge Functions plus rapides
- Authentification JWT robuste
- Cache automatique avec SWR
- Types TypeScript complets
