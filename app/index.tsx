import { Link } from "expo-router";
import { useEffect } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function Index() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.1),
      withSpring(1)
    );
    opacity.value = withDelay(300, withSpring(1));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Text style={styles.logo}>🧠</Text>
        <Text style={styles.title}>Mindsy</Text>
      </Animated.View>

      <Animated.View style={[styles.contentContainer, contentStyle]}>
        <Text style={styles.subtitle}>Welcome to Mindsy!</Text>
        <Text style={styles.description}>
          Your personal platform to learn ANYTHING.
        </Text>

        <Link href="/learn" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Start Learning</Text>
          </Pressable>
        </Link>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#58CC02",
    letterSpacing: 1,
  },
  contentContainer: {
    alignItems: "center",
    width: "100%",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#58CC02",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: width * 0.8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
