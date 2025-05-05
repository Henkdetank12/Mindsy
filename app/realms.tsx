import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from './context/AppContext';

export default function RealmsScreen() {
  const { realms } = useApp();
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Realms</Text>
        <Text style={styles.subtitle}>Choose your path to knowledge</Text>
      </View>

      <View style={styles.grid}>
        {realms.map((realm) => (
          <TouchableOpacity 
            key={realm.id} 
            style={styles.realmCard}
            onPress={() => router.push(`/realm/${realm.id}`)}
          >
            <LinearGradient
              colors={[realm.color, `${realm.color}80`]}
              style={styles.realmGradient}
            >
              <Ionicons name={realm.icon as any} size={32} color="white" />
              <Text style={styles.realmName}>{realm.name}</Text>
              <Text style={styles.realmProgress}>{realm.progress}% Complete</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  grid: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  realmCard: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  realmGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  realmName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  realmProgress: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
    opacity: 0.9,
  },
}); 