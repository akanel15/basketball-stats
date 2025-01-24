import { theme } from "@/theme";
import { StyleSheet, Text, View } from "react-native";

export default function Stats() {
  return (
    <View style={styles.container}>
      <Text>Stats section</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    alignItems: "center",
    justifyContent: "center",
  },
});
