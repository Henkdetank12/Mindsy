import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Quiz from '../components/Quiz';
import { useApp } from '../context/AppContext';

export default function RealmDetailScreen() {
  const { id } = useLocalSearchParams();
  const { realms, completeLesson, addTimeSpent, completeQuiz, resetRealm } = useApp();
  const router = useRouter();
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [currentTheoryBlock, setCurrentTheoryBlock] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const realm = realms.find(r => r.id === id);

  useEffect(() => {
    if (!realm) {
      router.back();
    }
  }, [realm]);

  if (!realm) return null;

  const startLesson = (lessonId: string) => {
    setCurrentLesson(lessonId);
    setCurrentTheoryBlock(null);
    setShowContent(true);
  };

  const startTheoryBlock = (blockId: string) => {
    setCurrentTheoryBlock(blockId);
  };

  const handleTheoryBlockComplete = () => {
    if (!currentLesson || !currentTheoryBlock) return;
    
    const lesson = realm.lessons.find(l => l.id === currentLesson);
    if (!lesson) return;

    // Mark theory block as completed
    const updatedTheoryBlocks = lesson.theoryBlocks.map(block =>
      block.id === currentTheoryBlock ? { ...block, completed: true } : block
    );

    // Move to next theory block
    const currentIndex = updatedTheoryBlocks.findIndex(block => block.id === currentTheoryBlock);
    const nextBlock = updatedTheoryBlocks[currentIndex + 1];
    
    if (nextBlock) {
      setCurrentTheoryBlock(nextBlock.id);
    } else {
      // If this was the last block, close the content view
      setShowContent(false);
      setCurrentTheoryBlock(null);
    }
  };

  const startQuiz = () => {
    if (currentLesson) {
      setSelectedLesson(currentLesson);
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = (score: number) => {
    if (selectedLesson) {
      completeQuiz(realm.id, selectedLesson, score);
      addTimeSpent(15);
    }
    resetLessonStates();
  };

  const resetLessonStates = () => {
    setShowQuiz(false);
    setSelectedLesson(null);
    setCurrentLesson(null);
    setCurrentTheoryBlock(null);
    setShowContent(false);
  };

  const handleReset = async () => {
    await resetRealm(realm.id);
    setShowResetConfirm(false);
    setShowQuiz(false);
    setSelectedLesson(null);
    setCurrentLesson(null);
    setCurrentTheoryBlock(null);
    setShowContent(false);
  };

  const renderTheoryBlock = () => {
    if (!currentLesson || !currentTheoryBlock) return null;
    
    const lesson = realm.lessons.find(l => l.id === currentLesson);
    if (!lesson) return null;

    const block = lesson.theoryBlocks.find(b => b.id === currentTheoryBlock);
    if (!block) return null;

    const isLastBlock = lesson.theoryBlocks[lesson.theoryBlocks.length - 1].id === currentTheoryBlock;

    return (
      <View style={styles.contentOverlay}>
        <View style={styles.contentContainer}>
          <View style={styles.contentHeader}>
            <Text style={styles.contentTitle}>{block.title}</Text>
            <TouchableOpacity onPress={resetLessonStates}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.contentScroll}>
            <Text style={styles.contentText}>{block.content}</Text>
          </ScrollView>
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleTheoryBlockComplete}
          >
            <Text style={styles.nextButtonText}>
              {isLastBlock ? 'Complete Theory' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[realm.color, `${realm.color}80`]}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Ionicons name={realm.icon as any} size={48} color="white" />
        <Text style={styles.title}>{realm.name}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${realm.progress}%`, backgroundColor: 'white' }
              ]} 
            />
          </View>
          <Text style={styles.progress}>{realm.progress}% Complete</Text>
        </View>
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={() => setShowResetConfirm(true)}
        >
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.resetButtonText}>Reset Progress</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Learning Path</Text>
        {realm.lessons.sort((a, b) => a.order - b.order).map((lesson) => (
          <View key={lesson.id} style={styles.lessonContainer}>
            <TouchableOpacity
              style={[
                styles.lessonCard,
                lesson.completed && styles.lessonCompleted,
                currentLesson === lesson.id && styles.lessonActive
              ]}
              onPress={() => startLesson(lesson.id)}
              disabled={currentLesson !== null && currentLesson !== lesson.id}
            >
              <View style={styles.lessonContent}>
                <View style={styles.lessonIcon}>
                  {lesson.completed ? (
                    <Ionicons name="checkmark-circle" size={24} color="#48BB78" />
                  ) : currentLesson === lesson.id ? (
                    <Ionicons name="book" size={24} color={realm.color} />
                  ) : (
                    <Ionicons name="book-outline" size={24} color={realm.color} />
                  )}
                </View>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonDescription}>{lesson.description}</Text>
                  {lesson.completed && (
                    <Text style={styles.retakeText}>Tap to retake</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>

            {currentLesson === lesson.id && (
              <View style={styles.theoryBlocksContainer}>
                {lesson.theoryBlocks.map((block, index) => (
                  <TouchableOpacity
                    key={block.id}
                    style={[
                      styles.theoryBlock,
                      block.completed && styles.theoryBlockCompleted,
                      currentTheoryBlock === block.id && styles.theoryBlockActive
                    ]}
                    onPress={() => startTheoryBlock(block.id)}
                  >
                    <View style={styles.theoryBlockContent}>
                      <Text style={styles.theoryBlockTitle}>{block.title}</Text>
                      {block.completed && (
                        <Ionicons name="checkmark-circle" size={20} color="#48BB78" />
                      )}
                    </View>
                    {index < lesson.theoryBlocks.length - 1 && (
                      <View style={styles.theoryBlockConnector} />
                    )}
                  </TouchableOpacity>
                ))}
                {lesson.theoryBlocks.every(block => block.completed) && !showContent && (
                  <TouchableOpacity
                    style={styles.quizButton}
                    onPress={startQuiz}
                  >
                    <Ionicons name="help-circle" size={24} color="white" />
                    <Text style={styles.quizButtonText}>Take Quiz</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ))}

        {realm.progress === 100 && (
          <View style={styles.completionCelebration}>
            <Ionicons name="trophy" size={48} color="#F6AD55" />
            <Text style={styles.completionTitle}>Realm Mastered! 🎉</Text>
            <Text style={styles.completionText}>
              Congratulations! You've completed all lessons in this realm. 
              Feel free to retake any lesson to reinforce your knowledge.
            </Text>
            <View style={styles.completionStats}>
              <View style={styles.statItem}>
                <Ionicons name="time" size={24} color={realm.color} />
                <Text style={styles.statText}>Time Spent: {Math.round(realm.lessons.length * 15)} min</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="star" size={24} color={realm.color} />
                <Text style={styles.statText}>Lessons Completed: {realm.lessons.length}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {showContent && renderTheoryBlock()}

      {showQuiz && selectedLesson && (
        <View style={styles.quizOverlay}>
          <Quiz
            questions={realm.lessons.find(l => l.id === selectedLesson)?.quiz || []}
            onComplete={handleQuizComplete}
            onClose={resetLessonStates}
          />
        </View>
      )}

      {showResetConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset Progress</Text>
            <Text style={styles.modalText}>
              Are you sure you want to reset all progress for this realm? This cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowResetConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleReset}
              >
                <Text style={styles.confirmButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progress: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  lessonCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
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
  lessonCompleted: {
    opacity: 0.7,
  },
  lessonActive: {
    borderWidth: 2,
    borderColor: '#6B46C1',
  },
  lessonContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  lessonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  lessonDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  contentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  contentScroll: {
    flex: 1,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  lessonContainer: {
    marginBottom: 24,
  },
  theoryBlocksContainer: {
    marginTop: 12,
    marginLeft: 48,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#E2E8F0',
  },
  theoryBlock: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  theoryBlockCompleted: {
    backgroundColor: '#F0FFF4',
  },
  theoryBlockActive: {
    borderWidth: 2,
    borderColor: '#6B46C1',
  },
  theoryBlockContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  theoryBlockTitle: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  theoryBlockConnector: {
    position: 'absolute',
    left: -16,
    top: 24,
    width: 16,
    height: 2,
    backgroundColor: '#E2E8F0',
  },
  nextButton: {
    backgroundColor: '#6B46C1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  resetButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E2E8F0',
  },
  confirmButton: {
    backgroundColor: '#6B46C1',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#4A5568',
  },
  confirmButtonText: {
    color: 'white',
  },
  retakeText: {
    fontSize: 12,
    color: '#48BB78',
    marginTop: 4,
    fontStyle: 'italic',
  },
  completionCelebration: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  completionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  completionStats: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  quizButton: {
    backgroundColor: '#6B46C1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  quizButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 