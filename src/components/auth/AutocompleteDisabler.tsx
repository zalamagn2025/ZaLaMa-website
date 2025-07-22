'use client';

import { useDisableAutocomplete } from '@/hooks/use-disable-autocomplete';

export function AutocompleteDisabler() {
  useDisableAutocomplete();
  
  // Ce composant ne rend rien visuellement, il applique juste la désactivation
  return null;
} 