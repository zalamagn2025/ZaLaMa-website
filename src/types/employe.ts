export interface Employe {
  id?: string; // ID du document Firestore
  adresse: string;
  dateCreation: Date | string; // Timestamp Firestore ou string
  dateEmbauche: string; // Format "YYYY-MM-DD"
  email: string;
  genre: 'Homme' | 'Femme';
  nom: string;
  nomComplet: string;
  partenaireId: string;
  poste: string;
  prenom: string;
  role: string; // "PG", "Manager", "Employe", etc.
  salaireNet: number;
  telephone: string; // Format "+224 XXX XXX XXX"
  typeContrat: 'CDI' | 'CDD' | 'Stage' | 'Freelance';
  userId: string;
  // Champs optionnels ajoutés par l'application
  lastLogin?: Date;
  dateModification?: Date;
}

export interface UserWithEmployeData {
  // Données Firebase Auth
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName?: string;
  photoURL?: string;
  // Données Employe
  employeId?: string;
  prenom?: string;
  nom?: string;
  nomComplet?: string;
  telephone?: string;
  poste?: string;
  role?: string;
  genre?: string;
  adresse?: string;
  salaireNet?: number;
  typeContrat?: string;
  dateEmbauche?: string;
  partenaireId?: string;
  userId?: string;
  entreprise?: {
    nom: string;
    // autres champs de l'entreprise si nécessaire
  };
} 