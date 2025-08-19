import { useState, useCallback, useEffect } from 'react';
import { validateEmployeeForm, EmployeeFormData, FormValidationErrors } from '@/utils/formValidation';

export interface FormValidationState {
  isValid: boolean;
  errors: FormValidationErrors;
  touched: { [key: string]: boolean };
  isSubmitting: boolean;
}

export function useEmployeeFormValidation(initialData: EmployeeFormData) {
  const [formData, setFormData] = useState<EmployeeFormData>(initialData);
  const [validationState, setValidationState] = useState<FormValidationState>({
    isValid: false,
    errors: {},
    touched: {},
    isSubmitting: false
  });

  // Validation en temps réel
  const validateForm = useCallback(() => {
    const { isValid, errors, formattedData } = validateEmployeeForm(formData);
    
    setValidationState(prev => ({
      ...prev,
      isValid,
      errors
    }));

    // Mettre à jour les données formatées
    setFormData(formattedData);

    return { isValid, errors, formattedData };
  }, [formData]);

  // Validation d'un champ spécifique
  const validateField = useCallback((fieldName: keyof EmployeeFormData, value: any) => {
    const updatedData = { ...formData, [fieldName]: value };
    const { errors } = validateEmployeeForm(updatedData);
    
    setValidationState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [fieldName]: errors[fieldName] || ''
      }
    }));

    return !errors[fieldName];
  }, [formData]);

  // Mise à jour d'un champ
  const updateField = useCallback((fieldName: keyof EmployeeFormData, value: any) => {
    setFormData(prev => {
      const updatedData = { ...prev, [fieldName]: value };
      
      // Si le type de contrat change et n'est plus CDD, réinitialiser la date d'expiration
      if (fieldName === 'type_contrat' && value !== 'CDD') {
        updatedData.date_expiration = '';
      }
      
      return updatedData;
    });
    
    // Marquer le champ comme touché
    setValidationState(prev => ({
      ...prev,
      touched: { ...prev.touched, [fieldName]: true }
    }));

    // Valider le champ
    validateField(fieldName, value);
  }, [validateField]);

  // Validation complète du formulaire
  const validateAndSubmit = useCallback(async (onSubmit: (data: EmployeeFormData) => Promise<void>) => {
    setValidationState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const { isValid, errors, formattedData } = validateForm();

      if (!isValid) {
        setValidationState(prev => ({
          ...prev,
          errors,
          isSubmitting: false
        }));
        return false;
      }

      await onSubmit(formattedData);
      
      setValidationState(prev => ({ ...prev, isSubmitting: false }));
      return true;
    } catch (error) {
      setValidationState(prev => ({ ...prev, isSubmitting: false }));
      throw error;
    }
  }, [validateForm]);

  // Réinitialiser le formulaire
  const resetForm = useCallback((newData?: EmployeeFormData) => {
    setFormData(newData || initialData);
    setValidationState({
      isValid: false,
      errors: {},
      touched: {},
      isSubmitting: false
    });
  }, [initialData]);

  // Vérifier si un champ a une erreur
  const hasError = useCallback((fieldName: keyof EmployeeFormData) => {
    return validationState.touched[fieldName] && !!validationState.errors[fieldName];
  }, [validationState]);

  // Obtenir l'erreur d'un champ
  const getFieldError = useCallback((fieldName: keyof EmployeeFormData) => {
    return validationState.touched[fieldName] ? validationState.errors[fieldName] : '';
  }, [validationState]);

  // Validation automatique quand les données changent
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateForm();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [formData, validateForm]);

  return {
    formData,
    validationState,
    updateField,
    validateField,
    validateAndSubmit,
    resetForm,
    hasError,
    getFieldError,
    validateForm
  };
}
