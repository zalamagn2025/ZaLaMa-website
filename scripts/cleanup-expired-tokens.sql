-- Script de nettoyage automatique des tokens expirés et utilisés
-- À exécuter régulièrement (cron job recommandé)

-- Fonction de nettoyage des tokens expirés
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS TABLE(deleted_count INTEGER, message TEXT) AS $$
DECLARE
    expired_count INTEGER;
    used_count INTEGER;
    total_deleted INTEGER;
BEGIN
    -- Compter les tokens expirés
    SELECT COUNT(*) INTO expired_count
    FROM password_reset_tokens
    WHERE expires_at < NOW();
    
    -- Compter les tokens utilisés
    SELECT COUNT(*) INTO used_count
    FROM password_reset_tokens
    WHERE used = TRUE;
    
    -- Supprimer les tokens expirés et utilisés
    DELETE FROM password_reset_tokens 
    WHERE expires_at < NOW() OR used = TRUE;
    
    GET DIAGNOSTICS total_deleted = ROW_COUNT;
    
    -- Retourner les statistiques
    RETURN QUERY SELECT 
        total_deleted,
        format('Nettoyage terminé: %s tokens supprimés (%s expirés, %s utilisés)', 
               total_deleted, expired_count, used_count)::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les statistiques des tokens
CREATE OR REPLACE FUNCTION get_token_statistics()
RETURNS TABLE(
    total_tokens INTEGER,
    active_tokens INTEGER,
    expired_tokens INTEGER,
    used_tokens INTEGER,
    oldest_token TIMESTAMP WITH TIME ZONE,
    newest_token TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY SELECT
        COUNT(*)::INTEGER as total_tokens,
        COUNT(*) FILTER (WHERE expires_at > NOW() AND used = FALSE)::INTEGER as active_tokens,
        COUNT(*) FILTER (WHERE expires_at < NOW())::INTEGER as expired_tokens,
        COUNT(*) FILTER (WHERE used = TRUE)::INTEGER as used_tokens,
        MIN(created_at) as oldest_token,
        MAX(created_at) as newest_token
    FROM password_reset_tokens;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour nettoyer les tokens d'un utilisateur spécifique
CREATE OR REPLACE FUNCTION cleanup_user_tokens(user_email TEXT)
RETURNS TABLE(deleted_count INTEGER, message TEXT) AS $$
DECLARE
    user_id UUID;
    deleted_count INTEGER;
BEGIN
    -- Récupérer l'ID de l'utilisateur
    SELECT id INTO user_id
    FROM employees
    WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RETURN QUERY SELECT 0, format('Utilisateur non trouvé: %s', user_email)::TEXT;
        RETURN;
    END IF;
    
    -- Supprimer tous les tokens de l'utilisateur
    DELETE FROM password_reset_tokens
    WHERE user_id = user_id;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN QUERY SELECT 
        deleted_count,
        format('Tokens supprimés pour %s: %s', user_email, deleted_count)::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Exécution du nettoyage initial
SELECT * FROM cleanup_expired_tokens();

-- Affichage des statistiques
SELECT * FROM get_token_statistics();

-- Commentaires pour la documentation
COMMENT ON FUNCTION cleanup_expired_tokens() IS 'Nettoie automatiquement les tokens expirés et utilisés';
COMMENT ON FUNCTION get_token_statistics() IS 'Retourne les statistiques des tokens de réinitialisation';
COMMENT ON FUNCTION cleanup_user_tokens(TEXT) IS 'Nettoie tous les tokens d''un utilisateur spécifique';

-- Exemple d'utilisation:
-- SELECT * FROM cleanup_expired_tokens(); -- Nettoyage général
-- SELECT * FROM get_token_statistics(); -- Voir les statistiques
-- SELECT * FROM cleanup_user_tokens('user@example.com'); -- Nettoyer un utilisateur spécifique 