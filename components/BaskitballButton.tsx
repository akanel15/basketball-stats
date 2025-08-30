import { theme } from "@/theme";
import { StyleSheet, Text, Pressable, Platform } from "react-native";
import * as Haptics from "expo-haptics";

type Props = {
  title: string;
  onPress: () => void;
  color?: string;
};

export function BaskitballButton({ title, onPress, color }: Props) {
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
        return [styles.button, { backgroundColor: color ? color : theme.colorOrangePeel }];
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
    paddingHorizontal: 2,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: theme.colorOrangePeel,
  },
  buttonPressed: {
    backgroundColor: theme.colorBlack,
  },
});
