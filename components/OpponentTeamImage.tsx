import { theme } from "@/theme";
import { StyleSheet, Text, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

type ShieldProps = {
  teamName?: string;
  size?: number;
};

export function OpponentShield({ teamName, size = 80 }: ShieldProps) {
  const firstLetter = teamName ? teamName.charAt(0).toUpperCase() : "?";

  return (
    <View style={[styles.shieldContainer, { width: size, height: size }]}>
      {/* Shield Icon */}
      <FontAwesome6 name="shield" size={size} color={theme.colorLightGrey} />

      {/* Centered Text */}
      <Text style={[styles.shieldText, { fontSize: size / 2.5 }]}>
        {firstLetter}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shieldContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  shieldText: {
    position: "absolute",
    color: theme.colorOnyx,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
