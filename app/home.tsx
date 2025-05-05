import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from './context/AppContext';

export default function HomeScreen() {
  const { realms, totalTimeSpent } = useApp();
  const router = useRouter();

  // Find the realm with the highest progress
  const currentRealm = realms.reduce((prev, current) => 
    (current.progress > prev.progress) ? current : prev
  );

  // Format time spent
  const hours = Math.floor(totalTimeSpent / 60);
  const minutes = totalTimeSpent % 60;
  const timeSpent = `${hours}h ${minutes}m`;

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#6B46C1', '#38B2AC']}
        style={styles.header}
      >
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.subtitle}>Continue your learning journey</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          {currentRealm && (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push(`/realm/${currentRealm.id}`)}
            >
              <View style={styles.cardContent}>
                <Ionicons name={currentRealm.icon as any} size={24} color={currentRealm.color} />
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{currentRealm.name}</Text>
                  <Text style={styles.cardSubtitle}>
                    {currentRealm.lessons.find(l => !l.completed)?.title || 'All lessons completed'} - {currentRealm.progress}% Complete
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Realms</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.realmsScroll}>
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
                  <Text style={styles.realmTitle}>{realm.name}</Text>
                  <Text style={styles.realmProgress}>{realm.progress}%</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Ionicons name="time" size={24} color="#6B46C1" />
              <Text style={styles.statValue}>{timeSpent}</Text>
              <Text style={styles.statLabel}>Time Spent</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="book" size={24} color="#6B46C1" />
              <Text style={styles.statValue}>{realms.length}</Text>
              <Text style={styles.statLabel}>Realms</Text>
            </View>
          </View>
        </View>
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
    paddingBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  realmsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  realmCard: {
    width: 160,
    height: 120,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  realmGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  realmTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  realmProgress: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
}); 