# 🚀 Configuration Rapide - Table Partnership Requests

## ❌ **Problème actuel**
L'erreur 500 indique que la table `partnership_requests` n'existe pas dans votre base de données Supabase.

## ✅ **Solution : Créer la table**

### **Option 1 : Via Dashboard Supabase (Recommandé - 2 minutes)**

1. **Connectez-vous à votre dashboard Supabase**
2. **Allez dans SQL Editor** (dans le menu de gauche)
3. **Copiez tout le contenu du fichier `database/partnership_requests.sql`**
4. **Collez dans l'éditeur SQL**
5. **Cliquez sur "Run"**

### **Option 2 : Via script automatique**

```bash
node scripts/create-partnership-table.js
```

## 📋 **Contenu du script SQL à copier :**

```sql
-- Création de la table partnership_requests
CREATE TABLE IF NOT EXISTS partnership_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Informations de l'entreprise (Étape 1)
    company_name VARCHAR(255) NOT NULL,
    legal_status VARCHAR(100) NOT NULL,
    rccm VARCHAR(100) NOT NULL,
    nif VARCHAR(100) NOT NULL,
    activity_domain VARCHAR(100) NOT NULL,
    headquarters_address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    employees_count INTEGER NOT NULL,
    payroll VARCHAR(255) NOT NULL,
    cdi_count INTEGER NOT NULL,
    cdd_count INTEGER NOT NULL,
    payment_date DATE NOT NULL,
    
    -- Informations du représentant (Étape 2)
    rep_full_name VARCHAR(255) NOT NULL,
    rep_position VARCHAR(255) NOT NULL,
    rep_email VARCHAR(255) NOT NULL,
    rep_phone VARCHAR(20) NOT NULL,
    
    -- Informations du responsable RH (Étape 3)
    hr_full_name VARCHAR(255) NOT NULL,
    hr_email VARCHAR(255) NOT NULL,
    hr_phone VARCHAR(20) NOT NULL,
    agreement BOOLEAN NOT NULL DEFAULT false,
    
    -- Statut et métadonnées
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_review')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contraintes de validation
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_rep_email CHECK (rep_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_hr_email CHECK (hr_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (LENGTH(phone) <= 20),
    CONSTRAINT valid_rep_phone CHECK (LENGTH(rep_phone) <= 20),
    CONSTRAINT valid_hr_phone CHECK (LENGTH(hr_phone) <= 20),
    CONSTRAINT valid_employees_count CHECK (employees_count > 0),
    CONSTRAINT valid_cdi_count CHECK (cdi_count >= 0),
    CONSTRAINT valid_cdd_count CHECK (cdd_count >= 0),
    CONSTRAINT unique_emails CHECK (email != rep_email AND email != hr_email AND rep_email != hr_email)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_partnership_requests_status ON partnership_requests(status);
CREATE INDEX IF NOT EXISTS idx_partnership_requests_created_at ON partnership_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_partnership_requests_company_name ON partnership_requests(company_name);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_partnership_requests_updated_at 
    BEFORE UPDATE ON partnership_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Activation de RLS (Row Level Security)
ALTER TABLE partnership_requests ENABLE ROW LEVEL SECURITY;

-- Politique RLS : permettre l'insertion pour tous (formulaire public)
CREATE POLICY "Allow public insert" ON partnership_requests
    FOR INSERT WITH CHECK (true);

-- Politique RLS : permettre la lecture pour les admins uniquement
CREATE POLICY "Allow admin read" ON partnership_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN (
                'admin@zalamagn.com',
                'contact@zalamagn.com'
            )
        )
    );

-- Politique RLS : permettre la mise à jour pour les admins uniquement
CREATE POLICY "Allow admin update" ON partnership_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN (
                'admin@zalamagn.com',
                'contact@zalamagn.com'

            )
        )
    );

-- Données de test
INSERT INTO partnership_requests (
    company_name,
    legal_status,
    rccm,
    nif,
    activity_domain,
    headquarters_address,
    phone,
    email,
    employees_count,
    payroll,
    cdi_count,
    cdd_count,
    payment_date,
    rep_full_name,
    rep_position,
    rep_email,
    rep_phone,
    hr_full_name,
    hr_email,
    hr_phone,
    agreement,
    status
) VALUES 
(
    'Tech Solutions Guinée',
    'SARL',
    'GN-2023-B-12345',
    '123456789',
    'Informatique',
    '123 Avenue de la République, Conakry',
    '+224 623 456 789',
    'contact@techsolutionsgn.com',
    150,
    '750 000 000 GNF',
    120,
    30,
    '2024-01-15',
    'Mamadou Diallo',
    'Directeur Général',
    'mamadou.diallo@techsolutionsgn.com',
    '+224 623 456 790',
    'Fatou Camara',
    'rh@techsolutionsgn.com',
    '+224 623 456 791',
    true,
    'pending'
),
(
    'Agro Business Plus',
    'SAS',
    'GN-2023-B-67890',
    '987654321',
    'Agriculture',
    '456 Route de Donka, Conakry',
    '+224 624 123 456',
    'info@agrobusinessplus.com',
    85,
    '450 000 000 GNF',
    70,
    15,
    '2024-01-20',
    'Aissatou Bah',
    'Présidente',
    'aissatou.bah@agrobusinessplus.com',
    '+224 624 123 457',
    'Ousmane Barry',
    'rh@agrobusinessplus.com',
    '+224 624 123 458',
    true,
    'in_review'
),
(
    'Mining Corporation Guinée',
    'SA',
    'GN-2023-B-11111',
    '111222333',
    'Energie',
    '789 Boulevard du Commerce, Conakry',
    '+224 625 789 012',
    'contact@miningcorpgn.com',
    300,
    '1 500 000 000 GNF',
    250,
    50,
    '2024-01-25',
    'Ibrahima Sow',
    'Directeur Exécutif',
    'ibrahima.sow@miningcorpgn.com',
    '+224 625 789 013',
    'Mariama Keita',
    'rh@miningcorpgn.com',
    '+224 625 789 014',
    true,
    'approved'
);
```

## ✅ **Après avoir créé la table :**

1. **Testez l'API :**
   ```bash
   node scripts/test-partnership-api.js
   ```

2. **Testez le formulaire :**
   - Allez sur `/partnership/formulaire`
   - Remplissez le formulaire
   - Soumettez

3. **Vérifiez dans Supabase :**
   - Table Editor → `partnership_requests`
   - Vous devriez voir vos nouvelles demandes

## 🎯 **Résultat attendu :**
- ✅ Plus d'erreur 500
- ✅ Formulaire fonctionnel
- ✅ Données sauvegardées dans Supabase
- ✅ 3 demandes de test visibles

---

**⏱️ Temps estimé : 2-3 minutes** 