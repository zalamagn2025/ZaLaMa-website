import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: '#FF671E',
    paddingBottom: 15,
    backgroundColor: '#010D3E',
    padding: 20,
    borderRadius: 8,
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subHeader: {
    fontSize: 12,
    color: '#FF8E53',
    marginTop: 5,
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#010D3E',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#FF671E',
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    width: '40%',
    fontWeight: 'medium',
  },
  value: {
    fontSize: 12,
    color: '#111827',
    width: '60%',
    fontWeight: 'bold',
  },
  status: {
    fontSize: 12,
    padding: 8,
    borderRadius: 6,
    textAlign: 'center',
    width: 120,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 10,
    color: '#6B7280',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
});

interface TransactionPDFProps {
  montant: string;
  statut: 'En attente' | 'Approuvée' | 'Rejetée';
  date: string;
  typeMotif: string;
  fraisService?: string;
  dateValidation?: string;
  motifRejet?: string;
}

const formatMotifType = (type: string): string => {
  const motifs: Record<string, string> = {
    "TRANSPORT": "Transport",
    "SANTE": "Santé",
    "EDUCATION": "Éducation",
    "LOGEMENT": "Logement",
    "ALIMENTATION": "Alimentation",
    "URGENCE_FAMILIALE": "Urgence familiale",
    "FRAIS_MEDICAUX": "Frais médicaux",
    "FRAIS_SCOLAIRES": "Frais scolaires",
    "REPARATION_VEHICULE": "Réparation véhicule",
    "FRAIS_DEUIL": "Frais deuil",
    "AUTRE": "Autre"
  };
  return motifs[type] || type;
};

export const TransactionPDF = ({
  montant,
  statut,
  date,
  typeMotif,
  fraisService = '',
  dateValidation = '',
  motifRejet = ''
}: TransactionPDFProps) => {
  // Formatage des dates avec barres
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    
    try {
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return dateStr;
      
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();
      const hours = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return dateStr;
    }
  };

  // Formatage des montants sans barres
  const formatMontant = (amount: string): string => {
    if (!amount) return '0 FG';
    
    // Nettoyage strict
    const numericValue = parseInt(amount.replace(/\D/g, ''), 10) || 0;
    
    // Formatage avec espaces uniquement
    const formatted = new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericValue);
    
    return `${formatted} FG`;
  };

  // Calcul du montant reçu
  const cleanMontant = parseInt(montant.replace(/\D/g, ''), 10) || 0;
  const cleanFrais = parseInt(fraisService.replace(/\D/g, ''), 10) || 0;
  const montantRecu = statut === 'Validé' ? cleanMontant - cleanFrais : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src="/images/zalama-logo.svg" />
          <View>
            <Text style={styles.headerText}>Reçu d'Avance sur Salaire - ZaLaMa</Text>
            <Text style={styles.subHeader}>
              Généré le {new Date().toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Détails de la Demande</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Date de création :</Text>
            <Text style={styles.value}>{formatDate(date)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Montant demandé :</Text>
            <Text style={styles.value}>{formatMontant(montant)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Type de motif :</Text>
            <Text style={styles.value}>{formatMotifType(typeMotif)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Statut :</Text>
            <View style={[
              styles.status, 
              {
                backgroundColor: statut === 'Validé' ? '#E6FFEE' :
                                statut === 'En attente' ? '#FFF5E6' :
                                statut === 'Rejeté' ? '#FFE6E6' : '#E5E7EB',
                color: statut === 'Validé' ? '#00A651' :
                       statut === 'En attente' ? '#FF9900' :
                       statut === 'Rejeté' ? '#FF0000' : '#6B7280'
              }
            ]}>
              <Text>{statut}</Text>
            </View>
          </View>
          
          {statut === 'Rejeté' && motifRejet && (
            <View style={styles.row}>
              <Text style={styles.label}>Motif de rejet :</Text>
              <Text style={styles.value}>{motifRejet}</Text>
            </View>
          )}
          
          {statut === 'Validé' && (
            <>
              {fraisService && (
                <View style={styles.row}>
                  <Text style={styles.label}>Frais de service :</Text>
                  <Text style={[styles.value, { color: '#FF0000' }]}>
                    - {formatMontant(fraisService)}
                  </Text>
                </View>
              )}
              
              <View style={styles.row}>
                <Text style={styles.label}>Montant reçu :</Text>
                <Text style={styles.value}>
                  {formatMontant(montantRecu.toString())}
                </Text>
              </View>
              
              {dateValidation && (
                <View style={styles.row}>
                  <Text style={styles.label}>Date de validation :</Text>
                  <Text style={styles.value}>{formatDate(dateValidation)}</Text>
                </View>
              )}
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Text>ZaLaMa - Plateforme de gestion d'avances sur salaire | Contact : support@zalama.com</Text>
        </View>
      </Page>
    </Document>
  );
};