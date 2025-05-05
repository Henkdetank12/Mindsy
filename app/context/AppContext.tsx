import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Types
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface TheoryBlock {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'interactive';
  videoUrl?: string;
  completed: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  theoryBlocks: TheoryBlock[];
  quiz: QuizQuestion[];
  requiredScore: number;
  order: number;
}

export interface Realm {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  progress: number;
  lessons: Lesson[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface AppContextType {
  realms: Realm[];
  achievements: Achievement[];
  currentStreak: number;
  totalTimeSpent: number;
  unlockAchievement: (id: string) => void;
  updateRealmProgress: (realmId: string, progress: number) => void;
  completeLesson: (realmId: string, lessonId: string) => void;
  addTimeSpent: (minutes: number) => void;
  completeQuiz: (realmId: string, lessonId: string, score: number) => void;
  resetProgress: () => void;
  resetRealm: (realmId: string) => void;
}

// Initial Data
const initialRealms: Realm[] = [
  {
    id: 'math',
    name: 'Mathematics',
    description: 'Master the fundamentals of mathematics',
    icon: 'calculator',
    color: '#6B46C1',
    progress: 0,
    lessons: [
      {
        id: 'algebra-basics',
        title: 'Algebra Basics',
        description: 'Learn the fundamentals of algebraic expressions',
        completed: false,
        order: 1,
        requiredScore: 80,
        theoryBlocks: [
          {
            id: 'tb1',
            title: 'Introduction to Variables',
            content: 'Variables are symbols (usually letters) that represent unknown values in mathematical expressions. They allow us to write general rules and solve problems with unknown quantities.',
            type: 'text',
            completed: false
          },
          {
            id: 'tb2',
            title: 'Basic Operations with Variables',
            content: 'Learn how to perform addition, subtraction, multiplication, and division with variables. These operations follow the same rules as with numbers, but we need to be careful with like terms.',
            type: 'text',
            completed: false
          },
          {
            id: 'tb3',
            title: 'Solving Simple Equations',
            content: 'An equation is a statement that two expressions are equal. To solve an equation, we need to find the value of the variable that makes the equation true.',
            type: 'text',
            completed: false
          }
        ],
        quiz: [
          {
            id: 'q1',
            question: 'What is the value of x in the equation: 2x + 5 = 13?',
            options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
            correctAnswer: 1,
            explanation: 'To solve 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4'
          },
          {
            id: 'q2',
            question: 'Which of the following is a linear equation?',
            options: ['x² + 2x + 1 = 0', '2x + 3 = 7', 'x³ = 8', '√x = 4'],
            correctAnswer: 1,
            explanation: 'A linear equation has the form ax + b = c, where a, b, and c are constants and x is the variable. 2x + 3 = 7 is the only option that fits this form.'
          }
        ]
      },
      {
        id: 'quadratic-equations',
        title: 'Quadratic Equations',
        description: 'Master solving quadratic equations and their applications',
        completed: false,
        order: 2,
        requiredScore: 80,
        theoryBlocks: [
          {
            id: 'tb1',
            title: 'What are Quadratic Equations?',
            content: 'A quadratic equation is an equation of the form ax² + bx + c = 0, where a, b, and c are constants and a ≠ 0. These equations are fundamental in algebra and have wide applications in physics, engineering, and other fields.',
            type: 'text',
            completed: false
          },
          {
            id: 'tb2',
            title: 'The Quadratic Formula',
            content: 'The quadratic formula is a powerful tool for solving any quadratic equation. It is derived from completing the square and provides a direct way to find the solutions.',
            type: 'text',
            completed: false
          },
          {
            id: 'tb3',
            title: 'Understanding the Discriminant',
            content: 'The discriminant (b² - 4ac) tells us about the nature of the solutions. If it\'s positive, we have two real solutions; if zero, one real solution; if negative, two complex solutions.',
            type: 'text',
            completed: false
          }
        ],
        quiz: [
          {
            id: 'q1',
            question: 'What is the quadratic formula?',
            options: [
              'x = (-b ± √(b² - 4ac)) / 2a',
              'x = (-b ± √(b² + 4ac)) / 2a',
              'x = (b ± √(b² - 4ac)) / 2a',
              'x = (-b ± √(b² - 4ac)) / a'
            ],
            correctAnswer: 0,
            explanation: 'The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a, where a, b, and c are the coefficients of the quadratic equation ax² + bx + c = 0.'
          }
        ]
      },
      {
        id: 'polynomials',
        title: 'Polynomials',
        description: 'Learn about polynomial expressions and their properties',
        content: 'Polynomials are expressions consisting of variables and coefficients, involving only the operations of addition, subtraction, multiplication, and non-negative integer exponents. They are fundamental in algebra and have applications in many areas of mathematics and science.',
        completed: false,
        quiz: [
          {
            id: 'q1',
            question: 'What is the degree of the polynomial 3x⁴ + 2x² - 5x + 1?',
            options: ['2', '3', '4', '5'],
            correctAnswer: 2,
            explanation: 'The degree of a polynomial is the highest power of the variable. In this case, the highest power is 4 (from the term 3x⁴).'
          },
          {
            id: 'q2',
            question: 'What is the result of (x + 2)(x - 2)?',
            options: ['x² - 4', 'x² + 4', 'x² - 2', 'x² + 2'],
            correctAnswer: 0,
            explanation: 'This is a difference of squares: (x + 2)(x - 2) = x² - 4. The middle terms cancel out.'
          },
          {
            id: 'q3',
            question: 'What is the remainder when x³ - 2x² + 3x - 4 is divided by (x - 1)?',
            options: ['-2', '-1', '0', '1'],
            correctAnswer: 1,
            explanation: 'Using the Remainder Theorem, we substitute x = 1 into the polynomial: 1³ - 2(1)² + 3(1) - 4 = 1 - 2 + 3 - 4 = -2'
          }
        ]
      },
      {
        id: 'geometry-intro',
        title: 'Introduction to Geometry',
        description: 'Explore the world of shapes and spaces',
        content: 'Geometry is a branch of mathematics concerned with questions of shape, size, relative position of figures, and the properties of space. It is one of the oldest branches of mathematics.',
        completed: false,
        quiz: [
          {
            id: 'q1',
            question: 'What is the sum of the interior angles of a triangle?',
            options: ['90 degrees', '180 degrees', '270 degrees', '360 degrees'],
            correctAnswer: 1,
            explanation: 'The sum of the interior angles of any triangle is always 180 degrees. This is a fundamental property of triangles in Euclidean geometry.'
          },
          {
            id: 'q2',
            question: 'Which of the following is not a quadrilateral?',
            options: ['Square', 'Rectangle', 'Triangle', 'Rhombus'],
            correctAnswer: 2,
            explanation: 'A quadrilateral is a polygon with four sides. A triangle has three sides, so it cannot be a quadrilateral.'
          },
          {
            id: 'q3',
            question: 'What is the formula for the area of a circle?',
            options: ['2πr', 'πr²', '2πr²', 'πr'],
            correctAnswer: 1,
            explanation: 'The area of a circle is calculated using the formula A = πr², where r is the radius of the circle.'
          }
        ]
      },
      {
        id: 'functions-graphs',
        title: 'Functions and Graphs',
        description: 'Learn about mathematical functions and their graphical representations',
        content: 'Functions are mathematical relationships between inputs and outputs. They can be represented graphically, showing how the output changes with different inputs. Understanding functions and their graphs is essential for advanced mathematics and many real-world applications.',
        completed: false,
        quiz: [
          {
            id: 'q1',
            question: 'What is the general form of a linear function?',
            options: [
              'y = mx + b',
              'y = ax² + bx + c',
              'y = sin(x)',
              'y = log(x)'
            ],
            correctAnswer: 0,
            explanation: 'A linear function has the form y = mx + b, where m is the slope and b is the y-intercept. This creates a straight line when graphed.'
          },
          {
            id: 'q2',
            question: 'What is the domain of the function f(x) = √x?',
            options: [
              'All real numbers',
              'x ≥ 0',
              'x > 0',
              'x ≤ 0'
            ],
            correctAnswer: 1,
            explanation: 'The domain of √x is x ≥ 0 because you cannot take the square root of a negative number in real numbers.'
          },
          {
            id: 'q3',
            question: 'What type of function is f(x) = x²?',
            options: [
              'Linear',
              'Quadratic',
              'Exponential',
              'Logarithmic'
            ],
            correctAnswer: 1,
            explanation: 'f(x) = x² is a quadratic function because it has the form f(x) = ax² + bx + c, where a = 1, b = 0, and c = 0.'
          },
          {
            id: 'q4',
            question: 'What is the range of the function f(x) = x²?',
            options: [
              'All real numbers',
              'y ≥ 0',
              'y > 0',
              'y ≤ 0'
            ],
            correctAnswer: 1,
            explanation: 'The range of f(x) = x² is y ≥ 0 because squaring any real number always gives a non-negative result.'
          }
        ]
      }
    ]
  },
  {
    id: 'physics',
    name: 'Physics',
    description: 'Discover the laws that govern our universe',
    icon: 'flash',
    color: '#4299E1',
    progress: 0,
    lessons: [
      {
        id: 'mechanics',
        title: 'Classical Mechanics',
        description: 'Learn about motion, forces, and energy',
        content: 'Classical mechanics is the study of the motion of objects and the forces that cause them to move. It is based on Newton\'s laws of motion and forms the foundation of physics.',
        completed: false,
        quiz: [
          {
            id: 'q1',
            question: 'What is Newton\'s First Law also known as?',
            options: ['Law of Acceleration', 'Law of Inertia', 'Law of Action-Reaction', 'Law of Universal Gravitation'],
            correctAnswer: 1,
            explanation: 'Newton\'s First Law is also known as the Law of Inertia. It states that an object will remain at rest or in uniform motion unless acted upon by an external force.'
          },
          {
            id: 'q2',
            question: 'What is the SI unit of force?',
            options: ['Joule', 'Watt', 'Newton', 'Pascal'],
            correctAnswer: 2,
            explanation: 'The Newton (N) is the SI unit of force. It is defined as the force needed to accelerate one kilogram of mass at the rate of one meter per second squared.'
          },
          {
            id: 'q3',
            question: 'What is the formula for kinetic energy?',
            options: ['mgh', '½mv²', 'Fd', 'ma'],
            correctAnswer: 1,
            explanation: 'The formula for kinetic energy is KE = ½mv², where m is mass and v is velocity.'
          }
        ]
      },
      {
        id: 'thermodynamics',
        title: 'Thermodynamics',
        description: 'Understand heat, energy, and entropy',
        content: 'Thermodynamics is the branch of physics that deals with the relationships between heat, work, temperature, and energy. It is fundamental to understanding how energy is transferred and transformed.',
        completed: false,
        quiz: [
          {
            id: 'q1',
            question: 'What is the First Law of Thermodynamics?',
            options: [
              'Energy cannot be created or destroyed',
              'Entropy always increases',
              'Heat flows from cold to hot',
              'Pressure and volume are inversely proportional'
            ],
            correctAnswer: 0,
            explanation: 'The First Law of Thermodynamics states that energy cannot be created or destroyed, only transformed from one form to another.'
          },
          {
            id: 'q2',
            question: 'What is the SI unit of temperature?',
            options: ['Fahrenheit', 'Celsius', 'Kelvin', 'Rankine'],
            correctAnswer: 2,
            explanation: 'The Kelvin (K) is the SI unit of temperature. It is an absolute temperature scale where 0 K represents absolute zero.'
          },
          {
            id: 'q3',
            question: 'Which of the following is a state function?',
            options: ['Work', 'Heat', 'Internal Energy', 'Power'],
            correctAnswer: 2,
            explanation: 'Internal energy is a state function, meaning its value depends only on the current state of the system, not on how the system reached that state.'
          }
        ]
      }
    ]
  },
  {
    id: 'programming',
    name: 'Programming',
    description: 'Learn to code and build applications',
    icon: 'code',
    color: '#48BB78',
    progress: 0,
    lessons: [
      {
        id: 'python-basics',
        title: 'Python Fundamentals',
        description: 'Start your programming journey with Python',
        content: 'Python is a high-level, interpreted programming language known for its simplicity and readability. It\'s widely used in web development, data science, artificial intelligence, and more.',
        completed: false,
        quiz: [
          {
            id: 'q1',
            question: 'What is the correct way to create a variable in Python?',
            options: ['var x = 5', 'x := 5', 'x = 5', 'let x = 5'],
            correctAnswer: 2,
            explanation: 'In Python, variables are created by simply assigning a value using the = operator. No special keyword is needed.'
          },
          {
            id: 'q2',
            question: 'Which of the following is a valid Python data type?',
            options: ['Array', 'Vector', 'List', 'Set'],
            correctAnswer: 2,
            explanation: 'List is a built-in data type in Python. It is an ordered, mutable sequence of elements.'
          },
          {
            id: 'q3',
            question: 'What is the output of print(type(5))?',
            options: ['<class \'number\'>', '<class \'int\'>', '<class \'integer\'>', '<class \'float\'>'],
            correctAnswer: 1,
            explanation: 'In Python, the type() function returns the class of an object. For the integer 5, it returns <class \'int\'>.'
          }
        ]
      },
      {
        id: 'web-dev',
        title: 'Web Development',
        description: 'Build modern web applications',
        content: 'Web development involves creating websites and web applications using various technologies like HTML, CSS, and JavaScript. It\'s a fundamental skill for modern software development.',
        completed: false,
        quiz: [
          {
            id: 'q1',
            question: 'What does HTML stand for?',
            options: [
              'Hyper Text Markup Language',
              'High Tech Modern Language',
              'Hyper Transfer Markup Language',
              'Hyper Text Modern Language'
            ],
            correctAnswer: 0,
            explanation: 'HTML stands for Hyper Text Markup Language. It is the standard markup language for creating web pages.'
          },
          {
            id: 'q2',
            question: 'Which of the following is a CSS selector?',
            options: ['#id', '@media', 'function()', 'import'],
            correctAnswer: 0,
            explanation: '#id is a CSS selector that targets elements with a specific ID. The # symbol is used to select elements by their ID attribute.'
          },
          {
            id: 'q3',
            question: 'What is the correct way to declare a JavaScript variable?',
            options: ['variable x = 5', 'v x = 5', 'let x = 5', 'x = 5'],
            correctAnswer: 2,
            explanation: 'In modern JavaScript, variables are typically declared using the let keyword. This provides block scope and prevents redeclaration.'
          }
        ]
      },
      {
        id: 'Test',
        title: 'Test',
        description: 'Test',
        content: 'Web development involves creating websites and web applications using various technologies like HTML, CSS, and JavaScript. It\'s a fundamental skill for modern software development.',
        completed: false,
        quiz: [
          {
            id: 'q1',
            question: 'What does HTML stand for?',
            options: [
              'Hyper Text Markup Language',
              'High Tech Modern Language',
              'Hyper Transfer Markup Language',
              'Hyper Text Modern Language'
            ],
            correctAnswer: 0,
            explanation: 'HTML stands for Hyper Text Markup Language. It is the standard markup language for creating web pages.'
          },
          {
            id: 'q2',
            question: 'Which of the following is a CSS selector?',
            options: ['#id', '@media', 'function()', 'import'],
            correctAnswer: 0,
            explanation: '#id is a CSS selector that targets elements with a specific ID. The # symbol is used to select elements by their ID attribute.'
          },
          {
            id: 'q3',
            question: 'What is the correct way to declare a JavaScript variable?',
            options: ['variable x = 5', 'v x = 5', 'let x = 5', 'x = 5'],
            correctAnswer: 2,
            explanation: 'In modern JavaScript, variables are typically declared using the let keyword. This provides block scope and prevents redeclaration.'
          }
        ]
      }
    ]
  }
];

const initialAchievements: Achievement[] = [
  {
    id: 'first-lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: 'star',
    color: '#F6AD55',
    unlocked: false
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: 'flame',
    color: '#F56565',
    unlocked: false
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Get 100% on any quiz',
    icon: 'trophy',
    color: '#48BB78',
    unlocked: false
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [realms, setRealms] = useState<Realm[]>(initialRealms);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  // Load saved data
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedRealms = await AsyncStorage.getItem('realms');
      const savedAchievements = await AsyncStorage.getItem('achievements');
      const savedStreak = await AsyncStorage.getItem('currentStreak');
      const savedTime = await AsyncStorage.getItem('totalTimeSpent');

      if (savedRealms) {
        // Merge saved realms with initial realms to ensure new lessons are included
        const parsedSavedRealms = JSON.parse(savedRealms);
        const mergedRealms = initialRealms.map(initialRealm => {
          const savedRealm = parsedSavedRealms.find((r: Realm) => r.id === initialRealm.id);
          if (savedRealm) {
            // Merge lessons, keeping new ones from initialRealm
            const mergedLessons = initialRealm.lessons.map(initialLesson => {
              const savedLesson = savedRealm.lessons.find((l: Lesson) => l.id === initialLesson.id);
              return savedLesson || initialLesson;
            });
            return {
              ...savedRealm,
              lessons: mergedLessons
            };
          }
          return initialRealm;
        });
        setRealms(mergedRealms);
      } else {
        setRealms(initialRealms);
      }

      if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
      if (savedStreak) setCurrentStreak(parseInt(savedStreak));
      if (savedTime) setTotalTimeSpent(parseInt(savedTime));
    } catch (error) {
      console.error('Error loading saved data:', error);
      // If there's an error, fall back to initial data
      setRealms(initialRealms);
      setAchievements(initialAchievements);
      setCurrentStreak(0);
      setTotalTimeSpent(0);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('realms', JSON.stringify(realms));
      await AsyncStorage.setItem('achievements', JSON.stringify(achievements));
      await AsyncStorage.setItem('currentStreak', currentStreak.toString());
      await AsyncStorage.setItem('totalTimeSpent', totalTimeSpent.toString());
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === id 
          ? { ...achievement, unlocked: true, unlockedAt: new Date() }
          : achievement
      )
    );
    saveData();
  };

  const updateRealmProgress = (realmId: string, progress: number) => {
    setRealms(prev =>
      prev.map(realm =>
        realm.id === realmId
          ? { ...realm, progress }
          : realm
      )
    );
    saveData();
  };

  const completeLesson = (realmId: string, lessonId: string) => {
    setRealms(prev =>
      prev.map(realm =>
        realm.id === realmId
          ? {
              ...realm,
              lessons: realm.lessons.map(lesson =>
                lesson.id === lessonId
                  ? { ...lesson, completed: true }
                  : lesson
              )
            }
          : realm
      )
    );

    // Update realm progress after completing a lesson
    const realm = realms.find(r => r.id === realmId);
    if (realm) {
      const totalLessons = realm.lessons.length;
      const completedLessons = realm.lessons.filter(l => l.completed).length + 1; // +1 for the newly completed lesson
      const newProgress = Math.round((completedLessons / totalLessons) * 100);
      updateRealmProgress(realmId, newProgress);
    }

    saveData();
  };

  const completeQuiz = (realmId: string, lessonId: string, score: number) => {
    // Update lesson completion if quiz score is 100%
    if (score === 100) {
      completeLesson(realmId, lessonId);
      unlockAchievement('quiz-master');
    }
    
    // Update realm progress based on completed lessons
    const realm = realms.find(r => r.id === realmId);
    if (realm) {
      const totalLessons = realm.lessons.length;
      const completedLessons = realm.lessons.filter(l => l.completed).length;
      const newProgress = Math.round((completedLessons / totalLessons) * 100);
      updateRealmProgress(realmId, newProgress);
    }
  };

  const addTimeSpent = (minutes: number) => {
    setTotalTimeSpent(prev => prev + minutes);
    saveData();
  };

  const resetProgress = async () => {
    setRealms(initialRealms);
    setAchievements(initialAchievements);
    setCurrentStreak(0);
    setTotalTimeSpent(0);
    await saveData();
  };

  const resetRealm = async (realmId: string) => {
    // Find the initial state of the realm
    const initialRealm = initialRealms.find(r => r.id === realmId);
    if (!initialRealm) return;

    setRealms(prev =>
      prev.map(realm =>
        realm.id === realmId
          ? {
              ...initialRealm, // Use the initial realm data
              progress: 0,
              lessons: initialRealm.lessons.map(lesson => ({
                ...lesson,
                completed: false
              }))
            }
          : realm
      )
    );
    await saveData();
  };

  return (
    <AppContext.Provider
      value={{
        realms,
        achievements,
        currentStreak,
        totalTimeSpent,
        unlockAchievement,
        updateRealmProgress,
        completeLesson,
        addTimeSpent,
        completeQuiz,
        resetProgress,
        resetRealm
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 