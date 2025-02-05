import { theme } from "@/theme";
import { StyleSheet, Text, Pressable, Platform } from "react-native";
import * as Haptics from "expo-haptics";

type Props = {
  title: string;
  onPress: () => void;
  opponent?: boolean;
};

export function GameButton({ title, onPress, opponent }: Props) {
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
        return [
          {
            backgroundColor: opponent ? theme.colorOnyx : theme.colorLightGrey,
          },
          styles.button,
        ];
      }}
    >
      <Text
        style={[
          styles.text,
          { color: opponent ? theme.colorWhite : theme.colorBlack },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    textAlign: "center",
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colorOrangePeel,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
    maxHeight: 80,
    minWidth: 120,
    maxWidth: 120,
  },
  buttonPressed: {
    backgroundColor: theme.colorOrangePeel,
  },
});
