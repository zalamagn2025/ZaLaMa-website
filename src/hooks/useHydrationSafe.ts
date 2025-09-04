import { useState, useEffect } from 'react';

export function useHydrationSafe() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  return isClient;
}

export function useHydrationSafeProps<T extends Record<string, any>>(props: T): T {
  const isClient = useHydrationSafe();
  if (!isClient) {
    const safeProps = { ...props };
    const problematicAttrs = [
      'autoComplete',
      'data-lpignore',
      'data-form-type',
      'data-1p-ignore',
      'data-bwignore'
    ];
    problematicAttrs.forEach(attr => { delete (safeProps as any)[attr]; });
    return safeProps;
  }
  return props;
}

// Nouvelle approche : composant wrapper qui gère l'hydratation
export function useSuppressHydrationWarning() {
  const [suppress, setSuppress] = useState(false);
  
  useEffect(() => {
    setSuppress(true);
  }, []);
  
  return suppress;
}
