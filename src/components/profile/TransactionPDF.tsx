import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Définition du type Transaction
interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: string;
  description: string;
  status: 'Approuvé' | 'En attente' | 'Rejeté';
  paymentStatus: 'Remboursé' | 'En cours' | 'Échoué';
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#010D3E'
  },
  label: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5
  },
  value: {
    fontSize: 14,
    marginBottom: 10,
    color: '#010D3E'
  },
  status: {
    fontSize: 12,
    padding: 5,
    borderRadius: 3,
    marginBottom: 10,
    textAlign: 'center'
  }
});

interface TransactionPDFProps {
  transaction: Transaction;
}

export const TransactionPDF = ({ transaction }: TransactionPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Détails de la Transaction</Text>
        
        <Text style={styles.label}>ID Transaction:</Text>
        <Text style={styles.value}>{transaction.id}</Text>
        
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{transaction.date}</Text>
        
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{transaction.type}</Text>
        
        <Text style={styles.label}>Montant:</Text>
        <Text style={styles.value}>{transaction.amount}</Text>
        
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{transaction.description}</Text>
        
        <Text style={styles.label}>Statut:</Text>
        <View style={[styles.status, { 
          backgroundColor: transaction.status === 'Approuvé' ? '#E6FFEE' : 
                         transaction.status === 'En attente' ? '#FFF5E6' : '#FFE6E6',
          color: transaction.status === 'Approuvé' ? '#00A651' : 
                transaction.status === 'En attente' ? '#FF9900' : '#FF0000'
        }]}>
          <Text>{transaction.status}</Text>
        </View>
        
        <Text style={styles.label}>Statut de paiement:</Text>
        <View style={[styles.status, { 
          backgroundColor: transaction.paymentStatus === 'Remboursé' ? '#E6FFEE' : 
                         transaction.paymentStatus === 'En cours' ? '#E6F3FF' : '#FFE6E6',
          color: transaction.paymentStatus === 'Remboursé' ? '#00A651' : 
                transaction.paymentStatus === 'En cours' ? '#0066CC' : '#FF0000'
        }]}>
          <Text>{transaction.paymentStatus}</Text>
        </View>
      </View>
    </Page>
  </Document>
);