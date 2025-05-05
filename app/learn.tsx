import { StyleSheet, Text, View } from "react-native";

export default function Learn() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Learning Screen</Text>
      <Text style={styles.subtext}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: "#666",
  },
}); 