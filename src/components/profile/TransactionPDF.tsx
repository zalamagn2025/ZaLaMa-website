// TransactionPDF.tsx
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Interface pour les données du PDF, alignée avec SalaryAdvanceRequest
interface SalaryAdvancePDFProps {
  id: string;
  montant: string;
  statut: 'En attente' | 'Validé' | 'Rejeté';
  date: string;
  telephone: string;
  reference: string;
  nomEmploye?: string;
  nomPartenaire?: string;
  motif?: string;
  fraisService?: string;
  dateValidation?: string | null;
  motifRejet?: string | null;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#010D3E',
  },
  subHeader: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#010D3E',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FF671E',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    color: '#6B7280',
    width: '40%',
  },
  value: {
    fontSize: 12,
    color: '#111827',
    width: '60%',
    fontWeight: 'normal',
  },
  status: {
    fontSize: 11,
    padding: 6,
    borderRadius: 4,
    textAlign: 'center',
    width: 100,
    alignSelf: 'flex-start',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#6B7280',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
});

export const TransactionPDF = ({ 
  id, 
  montant, 
  statut, 
  date, 
  telephone, 
  reference, 
  nomEmploye = 'N/A', 
  nomPartenaire = 'N/A', 
  motif = 'N/A', 
  fraisService = 'N/A', 
  dateValidation = 'N/A', 
  motifRejet = 'N/A' 
}: SalaryAdvancePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* En-tête */}
      <View style={styles.header}>
        {/* Placeholder pour le logo (remplacez par une URL d'image réelle si disponible) */}
        <Image 
          style={styles.logo} 
          src="https://via.placeholder.com/60?text=ZaLaMa" 
        />
        <View>
          <Text style={styles.headerText}>Reçu d'Avance sur Salaire - ZaLaMa</Text>
          <Text style={styles.subHeader}>Généré le {new Date().toLocaleDateString('fr-FR')}</Text>
        </View>
      </View>

      {/* Section Détails de la Demande */}
      <View style={styles.section}>
        <Text style={styles.title}>Détails de la Demande</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Référence :</Text>
          <Text style={styles.value}>{reference}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date de création :</Text>
          <Text style={styles.value}>{date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Montant demandé :</Text>
          <Text style={styles.value}>{montant}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Frais de service :</Text>
          <Text style={styles.value}>{fraisService}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Motif :</Text>
          <Text style={styles.value}>{motif}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Statut :</Text>
          <View style={[styles.status, { 
            backgroundColor: statut === 'Validé' ? '#E6FFEE' : 
                            statut === 'En attente' ? '#FFF5E6' : '#FFE6E6',
            color: statut === 'Validé' ? '#00A651' : 
                   statut === 'En attente' ? '#FF9900' : '#FF0000'
          }]}>
            <Text>{statut}</Text>
          </View>
        </View>
        {statut === 'Rejeté' && (
          <View style={styles.row}>
            <Text style={styles.label}>Motif de rejet :</Text>
            <Text style={styles.value}>{motifRejet}</Text>
          </View>
        )}
        {statut === 'Validé' && (
          <View style={styles.row}>
            <Text style={styles.label}>Date de validation :</Text>
            <Text style={styles.value}>{dateValidation}</Text>
          </View>
        )}
      </View>

      {/* Section Informations de l'Employé */}
      <View style={styles.section}>
        <Text style={styles.title}>Informations de l'Employé</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nom :</Text>
          <Text style={styles.value}>{nomEmploye}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Téléphone :</Text>
          <Text style={styles.value}>{telephone}</Text>
        </View>
      </View>

      {/* Section Informations du Partenaire */}
      <View style={styles.section}>
        <Text style={styles.title}>Informations du Partenaire</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nom :</Text>
          <Text style={styles.value}>{nomPartenaire}</Text>
        </View>
      </View>

      {/* Pied de page */}
      <Text style={styles.footer}>
        ZaLaMa - Plateforme de gestion d'avances sur salaire | Contact : support@zalama.com
      </Text>
    </Page>
  </Document>
);