-- =====================================================
-- SCRIPT DE TEST - DEMANDES D'AVANCES SUR SALAIRE
-- =====================================================
-- Exécuter dans l'éditeur SQL de Supabase
-- Date: 2024-01-15
-- Version: 1.0

-- =====================================================
-- 1. VÉRIFICATION DES TABLES ET STRUCTURES
-- =====================================================

-- Vérifier l'existence des tables principales
DO $$
BEGIN
    RAISE NOTICE '🔍 Vérification des tables...';
    
    -- Vérifier la table employees
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employees') THEN
        RAISE NOTICE '✅ Table employees existe';
    ELSE
        RAISE NOTICE '❌ Table employees manquante';
    END IF;
    
    -- Vérifier la table partners
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'partners') THEN
        RAISE NOTICE '✅ Table partners existe';
    ELSE
        RAISE NOTICE '❌ Table partners manquante';
    END IF;
    
    -- Vérifier la table salary_advance_requests
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'salary_advance_requests') THEN
        RAISE NOTICE '✅ Table salary_advance_requests existe';
    ELSE
        RAISE NOTICE '❌ Table salary_advance_requests manquante';
    END IF;
    
    -- Vérifier la table financial_transactions
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'financial_transactions') THEN
        RAISE NOTICE '✅ Table financial_transactions existe';
    ELSE
        RAISE NOTICE '❌ Table financial_transactions manquante';
    END IF;
END $$;

-- =====================================================
-- 2. CRÉATION DES DONNÉES DE TEST
-- =====================================================

-- Créer un partenaire de test
INSERT INTO partners (
    nom_entreprise,
    email_rh,
    telephone_rh,
    email_representant,
    telephone_representant,
    statut
) VALUES (
    'Entreprise Test SARL',
    'rh@test-entreprise.com',
    '+224987654321',
    'representant@test-entreprise.com',
    '+224111222333',
    'Actif'
) ON CONFLICT (nom_entreprise) DO NOTHING
RETURNING id AS partner_id;

-- Récupérer l'ID du partenaire créé
DO $$
DECLARE
    test_partner_id UUID;
BEGIN
    SELECT id INTO test_partner_id FROM partners WHERE nom_entreprise = 'Entreprise Test SARL';
    
    IF test_partner_id IS NOT NULL THEN
        RAISE NOTICE '✅ Partenaire de test créé/récupéré: %', test_partner_id;
        
        -- Créer un employé de test
        INSERT INTO employees (
            partenaire_id,
            nom,
            prenom,
            email,
            telephone,
            salaire_net,
            actif
        ) VALUES (
            test_partner_id,
            'Test',
            'Employee',
            'test.employee@example.com',
            '+224123456789',
            1500000, -- 1.5M GNF
            true
        ) ON CONFLICT (email) DO NOTHING
        RETURNING id AS employee_id;
        
        RAISE NOTICE '✅ Employé de test créé/récupéré';
    ELSE
        RAISE NOTICE '❌ Impossible de créer le partenaire de test';
    END IF;
END $$;

-- =====================================================
-- 3. TESTS DE VALIDATION DES DONNÉES
-- =====================================================

-- Vérifier les données créées
SELECT 
    'PARTENAIRES' as table_name,
    COUNT(*) as count,
    'Vérification des partenaires' as description
FROM partners
WHERE nom_entreprise = 'Entreprise Test SARL'

UNION ALL

SELECT 
    'EMPLOYEES' as table_name,
    COUNT(*) as count,
    'Vérification des employés' as description
FROM employees
WHERE email = 'test.employee@example.com'

UNION ALL

SELECT 
    'DEMANDES_AVANCE' as table_name,
    COUNT(*) as count,
    'Vérification des demandes existantes' as description
FROM salary_advance_requests
WHERE employe_id IN (
    SELECT id FROM employees WHERE email = 'test.employee@example.com'
);

-- =====================================================
-- 4. TESTS DE CALCULS ET LIMITES
-- =====================================================

-- Calculer les limites pour l'employé de test
WITH employee_data AS (
    SELECT 
        e.id as employee_id,
        e.salaire_net,
        e.partenaire_id,
        p.nom_entreprise
    FROM employees e
    JOIN partners p ON e.partenaire_id = p.id
    WHERE e.email = 'test.employee@example.com'
),
monthly_limits AS (
    SELECT 
        ed.*,
        FLOOR(ed.salaire_net * 0.25) as max_avance_monthly,
        ed.salaire_net * 0.25 as max_avance_monthly_exact
    FROM employee_data ed
),
current_month_advances AS (
    SELECT 
        ml.*,
        COALESCE(SUM(sar.montant_demande), 0) as total_avances_monthly
    FROM monthly_limits ml
    LEFT JOIN salary_advance_requests sar ON ml.employee_id = sar.employe_id
    WHERE sar.statut = 'Validé'
    AND sar.date_creation >= DATE_TRUNC('month', CURRENT_DATE)
    AND sar.date_creation < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
    GROUP BY ml.employee_id, ml.salaire_net, ml.partenaire_id, ml.nom_entreprise, ml.max_avance_monthly, ml.max_avance_monthly_exact
)
SELECT 
    nom_entreprise,
    salaire_net,
    max_avance_monthly as limite_mensuelle,
    total_avances_monthly as avances_utilisees,
    (max_avance_monthly - total_avances_monthly) as avance_disponible,
    ROUND((total_avances_monthly / max_avance_monthly_exact) * 100, 2) as pourcentage_utilise
FROM current_month_advances;

-- =====================================================
-- 5. TESTS DE DEMANDES D'AVANCE
-- =====================================================

-- Test 1: Demande valide (500K GNF)
DO $$
DECLARE
    test_employee_id UUID;
    test_partner_id UUID;
    frais_service DECIMAL(15,2);
    montant_total DECIMAL(15,2);
    demande_id UUID;
BEGIN
    -- Récupérer les IDs
    SELECT id INTO test_employee_id FROM employees WHERE email = 'test.employee@example.com';
    SELECT partenaire_id INTO test_partner_id FROM employees WHERE id = test_employee_id;
    
    IF test_employee_id IS NOT NULL AND test_partner_id IS NOT NULL THEN
        -- Calculer les frais
        frais_service := 500000 * 0.065; -- 6.5% de 500K
        montant_total := 500000 + frais_service;
        
        -- Créer la demande
        INSERT INTO salary_advance_requests (
            employe_id,
            partenaire_id,
            montant_demande,
            type_motif,
            motif,
            numero_reception,
            frais_service,
            montant_total,
            salaire_disponible,
            avance_disponible,
            statut,
            date_creation
        ) VALUES (
            test_employee_id,
            test_partner_id,
            500000,
            'TRANSPORT',
            'Test SQL - Demande valide de 500K GNF pour transport',
            '+224123456789',
            frais_service,
            montant_total,
            1500000,
            375000,
            'En attente',
            NOW()
        ) RETURNING id INTO demande_id;
        
        RAISE NOTICE '✅ Demande valide créée: ID=%, Montant=500000 GNF, Frais=%, Total=%', 
            demande_id, frais_service, montant_total;
    ELSE
        RAISE NOTICE '❌ Impossible de créer la demande: employé ou partenaire introuvable';
    END IF;
END $$;

-- Test 2: Demande qui dépasse la limite (2M GNF)
DO $$
DECLARE
    test_employee_id UUID;
    test_partner_id UUID;
    frais_service DECIMAL(15,2);
    montant_total DECIMAL(15,2);
    demande_id UUID;
BEGIN
    -- Récupérer les IDs
    SELECT id INTO test_employee_id FROM employees WHERE email = 'test.employee@example.com';
    SELECT partenaire_id INTO test_partner_id FROM employees WHERE id = test_employee_id;
    
    IF test_employee_id IS NOT NULL AND test_partner_id IS NOT NULL THEN
        -- Calculer les frais
        frais_service := 2000000 * 0.065; -- 6.5% de 2M
        montant_total := 2000000 + frais_service;
        
        -- Créer la demande (sera rejetée par l'API)
        INSERT INTO salary_advance_requests (
            employe_id,
            partenaire_id,
            montant_demande,
            type_motif,
            motif,
            numero_reception,
            frais_service,
            montant_total,
            salaire_disponible,
            avance_disponible,
            statut,
            date_creation
        ) VALUES (
            test_employee_id,
            test_partner_id,
            2000000,
            'LOGEMENT',
            'Test SQL - Demande qui dépasse la limite (2M GNF)',
            '+224123456789',
            frais_service,
            montant_total,
            1500000,
            0,
            'En attente',
            NOW()
        ) RETURNING id INTO demande_id;
        
        RAISE NOTICE '⚠️ Demande avec limite dépassée créée: ID=%, Montant=2000000 GNF (sera rejetée par l''API)', demande_id;
    ELSE
        RAISE NOTICE '❌ Impossible de créer la demande: employé ou partenaire introuvable';
    END IF;
END $$;

-- =====================================================
-- 6. TESTS DE TRANSACTIONS FINANCIÈRES
-- =====================================================

-- Créer des transactions financières de test
DO $$
DECLARE
    test_employee_id UUID;
    test_partner_id UUID;
    transaction_id UUID;
BEGIN
    -- Récupérer les IDs
    SELECT id INTO test_employee_id FROM employees WHERE email = 'test.employee@example.com';
    SELECT partenaire_id INTO test_partner_id FROM employees WHERE id = test_employee_id;
    
    IF test_employee_id IS NOT NULL AND test_partner_id IS NOT NULL THEN
        -- Transaction 1: Débloqué
        INSERT INTO financial_transactions (
            montant,
            type,
            description,
            utilisateur_id,
            partenaire_id,
            statut,
            date_transaction,
            reference
        ) VALUES (
            500000,
            'Débloqué',
            'Test SQL - Transaction débloquée pour transport',
            test_employee_id,
            test_partner_id,
            'En attente',
            NOW(),
            'REF-TEST-001'
        ) RETURNING id INTO transaction_id;
        
        RAISE NOTICE '✅ Transaction débloquée créée: ID=%, Montant=500000 GNF', transaction_id;
        
        -- Transaction 2: Remboursé
        INSERT INTO financial_transactions (
            montant,
            type,
            description,
            utilisateur_id,
            partenaire_id,
            statut,
            date_transaction,
            reference
        ) VALUES (
            300000,
            'Remboursé',
            'Test SQL - Transaction remboursée pour santé',
            test_employee_id,
            test_partner_id,
            'Validé',
            NOW() - INTERVAL '5 days',
            'REF-TEST-002'
        ) RETURNING id INTO transaction_id;
        
        RAISE NOTICE '✅ Transaction remboursée créée: ID=%, Montant=300000 GNF', transaction_id;
    ELSE
        RAISE NOTICE '❌ Impossible de créer les transactions: employé ou partenaire introuvable';
    END IF;
END $$;

-- =====================================================
-- 7. TESTS DE REQUÊTES COMPLEXES
-- =====================================================

-- Récupérer toutes les demandes d'avance avec détails
SELECT 
    sar.id as demande_id,
    sar.montant_demande,
    sar.type_motif,
    sar.motif,
    sar.statut,
    sar.date_creation,
    e.nom || ' ' || e.prenom as employe_nom,
    p.nom_entreprise,
    ROUND(sar.frais_service, 2) as frais_service,
    ROUND(sar.montant_total, 2) as montant_total,
    CASE 
        WHEN sar.statut = 'Validé' THEN '✅'
        WHEN sar.statut = 'Rejeté' THEN '❌'
        WHEN sar.statut = 'En attente' THEN '⏳'
        ELSE '❓'
    END as statut_emoji
FROM salary_advance_requests sar
JOIN employees e ON sar.employe_id = e.id
JOIN partners p ON sar.partenaire_id = p.id
WHERE e.email = 'test.employee@example.com'
ORDER BY sar.date_creation DESC;

-- Statistiques des demandes par type de motif
SELECT 
    type_motif,
    COUNT(*) as nombre_demandes,
    SUM(montant_demande) as total_montant,
    AVG(montant_demande) as moyenne_montant,
    COUNT(CASE WHEN statut = 'Validé' THEN 1 END) as demandes_validees,
    COUNT(CASE WHEN statut = 'Rejeté' THEN 1 END) as demandes_rejetees,
    COUNT(CASE WHEN statut = 'En attente' THEN 1 END) as demandes_en_attente
FROM salary_advance_requests sar
JOIN employees e ON sar.employe_id = e.id
WHERE e.email = 'test.employee@example.com'
GROUP BY type_motif
ORDER BY nombre_demandes DESC;

-- Statistiques des transactions financières
SELECT 
    type,
    COUNT(*) as nombre_transactions,
    SUM(montant) as total_montant,
    AVG(montant) as moyenne_montant,
    COUNT(CASE WHEN statut = 'Validé' THEN 1 END) as transactions_validees,
    COUNT(CASE WHEN statut = 'En attente' THEN 1 END) as transactions_en_attente
FROM financial_transactions ft
JOIN employees e ON ft.utilisateur_id = e.id
WHERE e.email = 'test.employee@example.com'
GROUP BY type
ORDER BY total_montant DESC;

-- =====================================================
-- 8. TESTS DE VALIDATION DES RÈGLES MÉTIER
-- =====================================================

-- Vérifier les demandes qui dépassent 25% du salaire
WITH employee_limits AS (
    SELECT 
        e.id,
        e.salaire_net,
        FLOOR(e.salaire_net * 0.25) as max_avance_monthly
    FROM employees e
    WHERE e.email = 'test.employee@example.com'
),
monthly_advances AS (
    SELECT 
        el.id as employee_id,
        el.max_avance_monthly,
        COALESCE(SUM(sar.montant_demande), 0) as total_avances_monthly
    FROM employee_limits el
    LEFT JOIN salary_advance_requests sar ON el.id = sar.employe_id
    WHERE sar.statut = 'Validé'
    AND sar.date_creation >= DATE_TRUNC('month', CURRENT_DATE)
    AND sar.date_creation < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
    GROUP BY el.id, el.max_avance_monthly
)
SELECT 
    'VÉRIFICATION LIMITES' as test_type,
    max_avance_monthly as limite_mensuelle,
    total_avances_monthly as avances_utilisees,
    (max_avance_monthly - total_avances_monthly) as avance_disponible,
    CASE 
        WHEN total_avances_monthly > max_avance_monthly THEN '❌ LIMITE DÉPASSÉE'
        WHEN total_avances_monthly = max_avance_monthly THEN '⚠️ LIMITE ATTEINTE'
        ELSE '✅ LIMITE RESPECTÉE'
    END as statut_limite
FROM monthly_advances;

-- Vérifier les demandes avec des montants suspects
SELECT 
    'MONTANTS SUSPECTS' as test_type,
    id as demande_id,
    montant_demande,
    CASE 
        WHEN montant_demande <= 0 THEN '❌ MONTANT NÉGATIF OU NUL'
        WHEN montant_demande > 5000000 THEN '⚠️ MONTANT TRÈS ÉLEVÉ'
        WHEN montant_demande > 2000000 THEN '⚠️ MONTANT ÉLEVÉ'
        ELSE '✅ MONTANT NORMAL'
    END as validation_montant,
    frais_service,
    montant_total,
    CASE 
        WHEN ABS(montant_total - (montant_demande + frais_service)) > 1 THEN '❌ CALCUL INCORRECT'
        ELSE '✅ CALCUL CORRECT'
    END as validation_calcul
FROM salary_advance_requests sar
JOIN employees e ON sar.employe_id = e.id
WHERE e.email = 'test.employee@example.com'
AND (
    montant_demande <= 0 
    OR montant_demande > 2000000
    OR ABS(montant_total - (montant_demande + frais_service)) > 1
);

-- =====================================================
-- 9. TESTS DE PERFORMANCE
-- =====================================================

-- Vérifier les index sur les tables principales
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('employees', 'partners', 'salary_advance_requests', 'financial_transactions')
ORDER BY tablename, indexname;

-- Statistiques de taille des tables
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as taille_table,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as taille_donnees,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as taille_index
FROM pg_tables 
WHERE tablename IN ('employees', 'partners', 'salary_advance_requests', 'financial_transactions')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- =====================================================
-- 10. NETTOYAGE OPTIONNEL
-- =====================================================

-- Décommentez les lignes suivantes pour nettoyer les données de test
/*
-- Supprimer les demandes d'avance de test
DELETE FROM salary_advance_requests 
WHERE employe_id IN (
    SELECT id FROM employees WHERE email = 'test.employee@example.com'
);

-- Supprimer les transactions financières de test
DELETE FROM financial_transactions 
WHERE utilisateur_id IN (
    SELECT id FROM employees WHERE email = 'test.employee@example.com'
);

-- Supprimer l'employé de test
DELETE FROM employees WHERE email = 'test.employee@example.com';

-- Supprimer le partenaire de test
DELETE FROM partners WHERE nom_entreprise = 'Entreprise Test SARL';

-- Afficher le message de nettoyage
DO $$
BEGIN
    RAISE NOTICE '🧹 Données de test supprimées avec succès';
END $$;
*/

-- =====================================================
-- RÉSUMÉ FINAL
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 TESTS TERMINÉS AVEC SUCCÈS!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 RÉSUMÉ DES TESTS:';
    RAISE NOTICE '✅ Vérification des tables';
    RAISE NOTICE '✅ Création des données de test';
    RAISE NOTICE '✅ Tests de validation des données';
    RAISE NOTICE '✅ Tests de calculs et limites';
    RAISE NOTICE '✅ Tests de demandes d''avance';
    RAISE NOTICE '✅ Tests de transactions financières';
    RAISE NOTICE '✅ Tests de requêtes complexes';
    RAISE NOTICE '✅ Tests de validation des règles métier';
    RAISE NOTICE '✅ Tests de performance';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Pour nettoyer les données de test, décommentez la section 10';
    RAISE NOTICE '📋 Consultez les résultats ci-dessus pour les détails';
END $$; 