-- Script pour résoudre le conflit de fonction create_notification
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- ÉTAPE 1: DIAGNOSTIC DES FONCTIONS EXISTANTES
-- =====================================================
SELECT 'DIAGNOSTIC DES FONCTIONS CREATE_NOTIFICATION:' as info;

-- Lister toutes les fonctions create_notification
SELECT 
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  pg_get_function_result(p.oid) as return_type,
  p.oid as function_oid
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'create_notification'
  AND n.nspname = 'public'
ORDER BY p.oid;

-- =====================================================
-- ÉTAPE 2: SUPPRESSION DES FONCTIONS DUPLIQUÉES
-- =====================================================
SELECT 'SUPPRESSION DES FONCTIONS DUPLIQUÉES...' as info;

-- Supprimer toutes les fonctions create_notification existantes
DROP FUNCTION IF EXISTS create_notification(UUID, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_notification(UUID, TEXT, TEXT, UUID);
DROP FUNCTION IF EXISTS create_notification(UUID, TEXT, TEXT, INTEGER);
DROP FUNCTION IF EXISTS create_notification(UUID, TEXT, TEXT, JSONB);
DROP FUNCTION IF EXISTS create_notification(UUID, TEXT, TEXT, ANYELEMENT);

-- =====================================================
-- ÉTAPE 3: CRÉATION D'UNE FONCTION UNIQUE ET ROBUSTE
-- =====================================================
SELECT 'CRÉATION D\'UNE FONCTION UNIQUE...' as info;

-- Créer une fonction create_notification unique avec des types spécifiques
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_titre TEXT,
  p_message TEXT,
  p_type notification_type DEFAULT 'Information'
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  -- Validation des paramètres
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'user_id ne peut pas être NULL';
  END IF;
  
  IF p_titre IS NULL OR LENGTH(TRIM(p_titre)) = 0 THEN
    RAISE EXCEPTION 'titre ne peut pas être vide';
  END IF;
  
  IF p_message IS NULL OR LENGTH(TRIM(p_message)) = 0 THEN
    RAISE EXCEPTION 'message ne peut pas être vide';
  END IF;
  
  -- Insérer la notification
  INSERT INTO notifications (
    user_id,
    titre,
    message,
    type,
    date_creation
  ) VALUES (
    p_user_id,
    p_titre,
    p_message,
    p_type,
    NOW()
  )
  RETURNING id INTO notification_id;
  
  -- Log de la création
  RAISE NOTICE 'Notification créée avec succès: %', notification_id;
  
  RETURN notification_id;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erreur lors de la création de la notification: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ÉTAPE 4: CRÉATION D'UNE FONCTION OVERLOAD POUR LES PARTENAIRES
-- =====================================================
SELECT 'CRÉATION D\'UNE FONCTION OVERLOAD POUR LES PARTENAIRES...' as info;

-- Fonction pour créer une notification pour un partenaire
CREATE OR REPLACE FUNCTION create_notification_for_partner(
  p_partner_id UUID,
  p_titre TEXT,
  p_message TEXT,
  p_type notification_type DEFAULT 'Information'
)
RETURNS SETOF UUID AS $$
DECLARE
  notification_id UUID;
  employee_record RECORD;
BEGIN
  -- Validation des paramètres
  IF p_partner_id IS NULL THEN
    RAISE EXCEPTION 'partner_id ne peut pas être NULL';
  END IF;
  
  IF p_titre IS NULL OR LENGTH(TRIM(p_titre)) = 0 THEN
    RAISE EXCEPTION 'titre ne peut pas être vide';
  END IF;
  
  IF p_message IS NULL OR LENGTH(TRIM(p_message)) = 0 THEN
    RAISE EXCEPTION 'message ne peut pas être vide';
  END IF;
  
  -- Créer une notification pour chaque employé du partenaire
  FOR employee_record IN 
    SELECT DISTINCT e.user_id 
    FROM employees e 
    WHERE e.partner_id = p_partner_id 
      AND e.actif = true
      AND e.user_id IS NOT NULL
  LOOP
    INSERT INTO notifications (
      user_id,
      titre,
      message,
      type,
      date_creation
    ) VALUES (
      employee_record.user_id,
      p_titre,
      p_message,
      p_type,
      NOW()
    )
    RETURNING id INTO notification_id;
    
    RETURN NEXT notification_id;
  END LOOP;
  
  -- Si aucun employé trouvé, créer une notification pour le partenaire lui-même
  IF NOT FOUND THEN
    INSERT INTO notifications (
      user_id,
      titre,
      message,
      type,
      date_creation
    ) VALUES (
      p_partner_id, -- Utiliser le partner_id comme user_id temporaire
      p_titre,
      p_message,
      p_type,
      NOW()
    )
    RETURNING id INTO notification_id;
    
    RETURN NEXT notification_id;
  END IF;
  
  RETURN;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erreur lors de la création des notifications pour le partenaire: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ÉTAPE 5: CRÉATION D'UNE FONCTION POUR LES NOTIFICATIONS SYSTÈME
-- =====================================================
SELECT 'CRÉATION D\'UNE FONCTION POUR LES NOTIFICATIONS SYSTÈME...' as info;

-- Fonction pour créer une notification système (pour tous les utilisateurs)
CREATE OR REPLACE FUNCTION create_system_notification(
  p_titre TEXT,
  p_message TEXT,
  p_type notification_type DEFAULT 'Information'
)
RETURNS SETOF UUID AS $$
DECLARE
  notification_id UUID;
  user_record RECORD;
BEGIN
  -- Validation des paramètres
  IF p_titre IS NULL OR LENGTH(TRIM(p_titre)) = 0 THEN
    RAISE EXCEPTION 'titre ne peut pas être vide';
  END IF;
  
  IF p_message IS NULL OR LENGTH(TRIM(p_message)) = 0 THEN
    RAISE EXCEPTION 'message ne peut pas être vide';
  END IF;
  
  -- Créer une notification pour tous les utilisateurs actifs
  FOR user_record IN 
    SELECT id 
    FROM users 
    WHERE actif = true
  LOOP
    INSERT INTO notifications (
      user_id,
      titre,
      message,
      type,
      date_creation
    ) VALUES (
      user_record.id,
      p_titre,
      p_message,
      p_type,
      NOW()
    )
    RETURNING id INTO notification_id;
    
    RETURN NEXT notification_id;
  END LOOP;
  
  RETURN;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erreur lors de la création des notifications système: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ÉTAPE 6: VÉRIFICATION FINALE
-- =====================================================
SELECT 'VÉRIFICATION FINALE DES FONCTIONS:' as info;

-- Lister toutes les fonctions create_notification après nettoyage
SELECT 
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  pg_get_function_result(p.oid) as return_type,
  p.oid as function_oid
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname IN ('create_notification', 'create_notification_for_partner', 'create_system_notification')
  AND n.nspname = 'public'
ORDER BY p.proname, p.oid;

-- =====================================================
-- ÉTAPE 7: TEST DE LA FONCTION PRINCIPALE
-- =====================================================
SELECT 'TEST DE LA FONCTION CREATE_NOTIFICATION...' as info;

-- Test avec un utilisateur existant
DO $$
DECLARE
  test_user_id UUID;
  test_notification_id UUID;
BEGIN
  -- Récupérer un utilisateur de test
  SELECT id INTO test_user_id FROM users LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    -- Créer une notification de test
    SELECT create_notification(
      test_user_id,
      'Test de notification',
      'Ceci est un test de la fonction create_notification après résolution du conflit.',
      'Information'
    ) INTO test_notification_id;
    
    RAISE NOTICE 'Test réussi: notification créée avec ID %', test_notification_id;
  ELSE
    RAISE NOTICE 'Aucun utilisateur trouvé pour le test';
  END IF;
END $$;

-- =====================================================
-- ÉTAPE 8: NETTOYAGE DES NOTIFICATIONS DE TEST
-- =====================================================
SELECT 'NETTOYAGE DES NOTIFICATIONS DE TEST...' as info;

-- Supprimer les notifications de test créées dans les 5 dernières minutes
DELETE FROM notifications 
WHERE titre = 'Test de notification' 
  AND date_creation > NOW() - INTERVAL '5 minutes';

SELECT '✅ Conflit de fonction create_notification résolu avec succès!' as result; 