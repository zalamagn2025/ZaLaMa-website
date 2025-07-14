interface NimbaSMSError {
  message?: string;
  statusCode?: number;
  response?: {
    data?: any;
    status?: number;
    statusText?: string;
  };
  code?: string;
  details?: any;
  [key: string]: any;
}

/**
 * Formate une erreur SMS de manière lisible et utile pour le debugging
 */
export function formatSmsError(error: any, context: string = 'SMS'): string {
  try {
    // Si c'est déjà une string, on la retourne
    if (typeof error === 'string') {
      return error;
    }

    // Si c'est un objet Error standard
    if (error instanceof Error) {
      return `${context}: ${error.message}`;
    }

    // Si c'est un objet avec une propriété message
    if (error && typeof error === 'object' && error.message) {
      return `${context}: ${error.message}`;
    }

    // Si c'est un objet avec des propriétés de réponse HTTP
    if (error && typeof error === 'object') {
      const errorInfo: string[] = [];

      // Informations de base
      if (error.message) errorInfo.push(`Message: ${error.message}`);
      if (error.statusCode) errorInfo.push(`Status: ${error.statusCode}`);
      if (error.code) errorInfo.push(`Code: ${error.code}`);

      // Informations de réponse HTTP
      if (error.response) {
        if (error.response.status) errorInfo.push(`HTTP Status: ${error.response.status}`);
        if (error.response.statusText) errorInfo.push(`HTTP Status Text: ${error.response.statusText}`);
        if (error.response.data) {
          const responseData = typeof error.response.data === 'string' 
            ? error.response.data 
            : JSON.stringify(error.response.data);
          errorInfo.push(`Response Data: ${responseData}`);
        }
      }

      // Informations supplémentaires
      if (error.details) {
        const details = typeof error.details === 'string' 
          ? error.details 
          : JSON.stringify(error.details);
        errorInfo.push(`Details: ${details}`);
      }

      // Si on a des informations, on les retourne
      if (errorInfo.length > 0) {
        return `${context}: ${errorInfo.join(' | ')}`;
      }

      // Sinon, on essaie de stringifier l'objet complet
      const stringified = JSON.stringify(error, null, 2);
      if (stringified !== '{}' && stringified !== 'null') {
        return `${context}: ${stringified}`;
      }
    }

    // Fallback pour les cas inconnus
    return `${context}: Erreur inconnue (${typeof error})`;

  } catch (formatError) {
    // En cas d'erreur dans le formatage, on retourne une version basique
    return `${context}: Erreur de formatage - ${String(error)}`;
  }
}

/**
 * Extrait les informations pertinentes d'une erreur NimbaSMS
 */
export function extractNimbaSMSErrorInfo(error: any): {
  message: string;
  statusCode?: number;
  code?: string;
  details?: string;
  isAuthError: boolean;
  isNetworkError: boolean;
  isQuotaError: boolean;
} {
  const formattedError = formatSmsError(error, 'NimbaSMS');
  const errorString = formattedError.toLowerCase();

  return {
    message: formattedError,
    statusCode: error?.statusCode || error?.response?.status,
    code: error?.code,
    details: error?.details ? JSON.stringify(error.details) : undefined,
    isAuthError: errorString.includes('unauthorized') || errorString.includes('invalid_credentials') || errorString.includes('auth'),
    isNetworkError: errorString.includes('network') || errorString.includes('timeout') || errorString.includes('connection'),
    isQuotaError: errorString.includes('quota') || errorString.includes('limit') || errorString.includes('exceeded')
  };
}

/**
 * Log une erreur SMS de manière structurée
 */
export function logSmsError(error: any, context: string, additionalData?: any): void {
  const errorInfo = extractNimbaSMSErrorInfo(error);
  
  console.error('🚨 SMS Error:', {
    context,
    timestamp: new Date().toISOString(),
    error: errorInfo.message,
    statusCode: errorInfo.statusCode,
    code: errorInfo.code,
    details: errorInfo.details,
    isAuthError: errorInfo.isAuthError,
    isNetworkError: errorInfo.isNetworkError,
    isQuotaError: errorInfo.isQuotaError,
    additionalData
  });

  // Log supplémentaire pour les erreurs critiques
  if (errorInfo.isAuthError) {
    console.error('🔐 Erreur d\'authentification NimbaSMS - Vérifiez vos credentials');
  }
  if (errorInfo.isQuotaError) {
    console.error('📊 Quota SMS dépassé - Vérifiez votre compte NimbaSMS');
  }
  if (errorInfo.isNetworkError) {
    console.error('🌐 Erreur réseau - Vérifiez votre connexion internet');
  }
} 