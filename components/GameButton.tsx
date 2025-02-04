import { theme } from "@/theme";
import { StyleSheet, Text, Pressable, Platform } from "react-native";
import * as Haptics from "expo-haptics";

type Props = {
  title: string;
  onPress: () => void;
};

export function GameButton({ title, onPress }: Props) {
  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => {
        if (pressed) {
          return [styles.button, styles.buttonPressed];
        }
        return styles.button;
      }}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    color: theme.colorWhite,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: theme.colorOrangePeel,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 70,
  },
  buttonPressed: {
    backgroundColor: theme.colorBlack,
  },
});
