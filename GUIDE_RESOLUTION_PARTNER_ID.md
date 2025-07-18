# Guide de résolution : Partner ID manquant pour les demandes d'avance

## Problème identifié

L'erreur suivante indique que l'`entrepriseId` (qui correspond au `partner_id`) n'est pas disponible lors de la création d'une demande d'avance :

```json
{
    "success": false,
    "message": "Tous les champs sont requis, y compris l'identifiant de l'entreprise",
    "debug": {
        "employeId": true,
        "montantDemande": true,
        "motif": true,
        "password": true,
        "entrepriseId": false
    }
}
```

## Cause du problème

Le `partner_id` (UID du partenaire) est obligatoire pour créer une demande d'avance car :
1. Il identifie l'entreprise de l'employé
2. Il permet de valider que l'employé appartient bien à l'entreprise
3. Il est requis dans la table `salary_advance_requests` avec la contrainte `NOT NULL`

## Solutions

### 1. Vérifier les employés sans partner_id

Exécutez ce script SQL dans Supabase pour identifier les employés sans `partner_id` :

```sql
-- Vérifier les employés sans partner_id
SELECT 
  id,
  user_id,
  email,
  nom,
  prenom,
  partner_id,
  poste,
  actif,
  created_at
FROM employees 
WHERE partner_id IS NULL 
  AND actif = true
ORDER BY created_at DESC;
```

### 2. Voir les partenaires disponibles

```sql
-- Voir les partenaires disponibles
SELECT 
  id,
  nom,
  type,
  secteur,
  actif,
  created_at
FROM partners
WHERE actif = true
ORDER BY nom;
```

### 3. Assigner un partner_id aux employés

Si des employés n'ont pas de `partner_id`, assignez-leur un partenaire :

```sql
-- Remplacez 'PARTNER_ID_DEFAUT' par l'ID d'un partenaire existant
UPDATE employees 
SET partner_id = 'PARTNER_ID_DEFAUT'
WHERE partner_id IS NULL 
  AND actif = true;
```

### 4. Vérifier le résultat

```sql
-- Vérifier le résultat après mise à jour
SELECT 
  e.id,
  e.user_id,
  e.email,
  e.nom,
  e.prenom,
  e.partner_id,
  p.nom as nom_partenaire,
  e.poste,
  e.actif
FROM employees e
LEFT JOIN partners p ON e.partner_id = p.id
WHERE e.actif = true
ORDER BY e.created_at DESC;
```

### 5. Test avec le script Node.js

Exécutez le script de test pour vérifier que tout fonctionne :

```bash
node test-partner-id-validation.js
```

## Validation dans le code

### API /api/user/profile

L'API retourne bien le `partner_id` dans les données de l'employé :

```typescript
// Dans /api/user/profile/route.ts
return NextResponse.json({
  success: true,
  data: {
    user: { /* ... */ },
    employe: {
      ...employeData,
      partner_id: employeData.partner_id // ✅ Retourné
    }
  }
})
```

### Formulaire SalaryAdvanceForm

Le formulaire récupère l'`entrepriseId` depuis l'API :

```typescript
// Dans SalaryAdvanceForm.tsx
setFormData(prev => ({
  ...prev,
  employeId: employeData.id,
  entrepriseId: employeData.partner_id, // ✅ Récupéré depuis l'API
  // ...
}))
```

### API de demande d'avance

L'API valide que l'`entrepriseId` est présent :

```typescript
// Dans /api/salary-advance/request/route.ts
if (!employeId || !montantDemande || !motif || !password || !entrepriseId) {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Tous les champs sont requis, y compris l\'identifiant de l\'entreprise',
      debug: { 
        employeId: !!employeId, 
        montantDemande: !!montantDemande, 
        motif: !!motif, 
        password: !!password,
        entrepriseId: !!entrepriseId // ✅ Validation
      }
    },
    { status: 400 }
  )
}
```

## Contraintes de base de données

### Table salary_advance_requests

La table a été mise à jour pour rendre `partenaire_id` obligatoire :

```sql
CREATE TABLE salary_advance_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employe_id UUID REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  partenaire_id UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL, -- ✅ Obligatoire
  -- ...
);
```

### Table employees

La table `employees` doit avoir un `partner_id` pour chaque employé actif :

```sql
-- Vérifier qu'aucun employé actif n'a un partner_id NULL
SELECT COUNT(*) as employes_sans_partenaire
FROM employees 
WHERE partner_id IS NULL 
  AND actif = true;
-- Doit retourner 0
```

## Tests automatisés

### Script de test complet

Le script `test-partner-id-validation.js` vérifie :

1. ✅ Les employés sans `partner_id`
2. ✅ La récupération d'un employé de test
3. ✅ Les statistiques par partenaire
4. ✅ La simulation de création de demande d'avance

### Exécution du test

```bash
# Avec les variables d'environnement
NEXT_PUBLIC_SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key node test-partner-id-validation.js

# Ou depuis un fichier .env
node test-partner-id-validation.js
```

## Résolution finale

Une fois que tous les employés ont un `partner_id` valide :

1. ✅ L'API `/api/user/profile` retournera le `partner_id`
2. ✅ Le formulaire `SalaryAdvanceForm` récupérera l'`entrepriseId`
3. ✅ L'API de demande d'avance acceptera la requête
4. ✅ La demande sera créée avec le bon `partenaire_id`

## Monitoring

Pour éviter ce problème à l'avenir, ajoutez une validation dans le processus de création d'employé :

```sql
-- Trigger pour s'assurer qu'un employé a toujours un partner_id
CREATE OR REPLACE FUNCTION ensure_employee_has_partner()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.partner_id IS NULL THEN
    RAISE EXCEPTION 'Un employé doit avoir un partner_id défini';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_employee_has_partner
  BEFORE INSERT OR UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION ensure_employee_has_partner();
``` 