import { useEffect } from 'react';

export function useDisableAutocomplete() {
  useEffect(() => {
    // Fonction pour désactiver l'auto-complétion sur tous les champs sensibles
    const disableAutocomplete = () => {
      // Désactiver l'auto-complétion sur tous les champs de mot de passe
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      passwordInputs.forEach(input => {
        input.setAttribute('autocomplete', 'new-password');
        input.setAttribute('data-lpignore', 'true');
        input.setAttribute('data-form-type', 'other');
        input.setAttribute('data-1p-ignore', 'true');
        input.setAttribute('data-bwignore', 'true');
      });

      // Désactiver l'auto-complétion sur tous les formulaires
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        form.setAttribute('autocomplete', 'off');
        form.setAttribute('data-form-type', 'other');
        form.setAttribute('data-lpignore', 'true');
      });

      // Désactiver l'auto-complétion sur tous les champs de téléphone
      const phoneInputs = document.querySelectorAll('input[type="tel"]');
      phoneInputs.forEach(input => {
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('data-lpignore', 'true');
        input.setAttribute('data-form-type', 'other');
        input.setAttribute('data-1p-ignore', 'true');
        input.setAttribute('data-bwignore', 'true');
      });

      // Désactiver l'auto-complétion sur tous les champs d'email
      const emailInputs = document.querySelectorAll('input[type="email"]');
      emailInputs.forEach(input => {
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('data-lpignore', 'true');
        input.setAttribute('data-form-type', 'other');
        input.setAttribute('data-1p-ignore', 'true');
        input.setAttribute('data-bwignore', 'true');
      });

      // Désactiver l'auto-complétion sur tous les champs de texte
      const textInputs = document.querySelectorAll('input[type="text"]');
      textInputs.forEach(input => {
        // Ne pas désactiver pour tous les champs texte, seulement ceux sensibles
        const sensitiveNames = ['password', 'pass', 'pwd', 'secret', 'key', 'token', 'auth'];
        const inputName = input.getAttribute('name') || input.getAttribute('id') || '';
        const isSensitive = sensitiveNames.some(name => 
          inputName.toLowerCase().includes(name)
        );
        
        if (isSensitive) {
          input.setAttribute('autocomplete', 'off');
          input.setAttribute('data-lpignore', 'true');
          input.setAttribute('data-form-type', 'other');
          input.setAttribute('data-1p-ignore', 'true');
          input.setAttribute('data-bwignore', 'true');
        }
      });
    };

    // Exécuter immédiatement
    disableAutocomplete();

    // Observer les changements dans le DOM pour les nouveaux éléments
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // Vérifier si le nouvel élément contient des champs sensibles
              const hasPasswordInputs = element.querySelectorAll('input[type="password"]').length > 0;
              const hasForms = element.querySelectorAll('form').length > 0;
              const hasPhoneInputs = element.querySelectorAll('input[type="tel"]').length > 0;
              
              if (hasPasswordInputs || hasForms || hasPhoneInputs) {
                disableAutocomplete();
              }
            }
          });
        }
      });
    });

    // Observer tout le document
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Nettoyer l'observer
    return () => {
      observer.disconnect();
    };
  }, []);
} 