import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function OverviewScreen() {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#6B46C1', '#38B2AC']}
        style={styles.header}
      >
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your learning journey</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color="#6B46C1" />
            <Text style={styles.statValue}>12h 30m</Text>
            <Text style={styles.statLabel}>Time Spent</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color="#6B46C1" />
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="book" size={24} color="#6B46C1" />
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Realms</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <Ionicons name="star" size={24} color="#F6AD55" />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Math Master</Text>
              <Text style={styles.achievementDesc}>Completed 10 math exercises</Text>
            </View>
          </View>
          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <Ionicons name="flame" size={24} color="#F56565" />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Streak Master</Text>
              <Text style={styles.achievementDesc}>7 days learning streak</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Streak</Text>
          <View style={styles.streakContainer}>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <View key={day} style={styles.streakDay}>
                <View style={[styles.streakDot, day <= 5 && styles.streakActive]} />
                <Text style={styles.streakLabel}>Day {day}</Text>
              </View>
            ))}
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
  title: {
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F6AD5510',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  streakDay: {
    alignItems: 'center',
  },
  streakDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
    marginBottom: 8,
  },
  streakActive: {
    backgroundColor: '#6B46C1',
  },
  streakLabel: {
    fontSize: 12,
    color: '#666',
  },
}); 