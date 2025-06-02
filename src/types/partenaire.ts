export interface Partenaire {
  id: string
  actif: boolean
  adresse: string
  dateCreation: any // Firestore Timestamp
  datePartenariat: string
  description: string
  email: string
  infoLegales: {
    nif: string
    rccm: string
  }
  logo: string
  nom: string
  representant: {
    email: string
    id: string
    nom: string
    phoneNumber: string
    telephone: string
  }
  rh: {
    email: string
    id: string
    nom: string
    phoneNumber: string
    telephone: string
  }
  secteur: string
  siteWeb: string
  telephone: string
  type: string
  updatedAt: any // Firestore Timestamp
} 