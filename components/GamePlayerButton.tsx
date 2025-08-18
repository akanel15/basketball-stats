import { theme } from "@/theme";
import { StyleSheet, Text, Pressable, Platform, View } from "react-native";
import * as Haptics from "expo-haptics";
import { PlayerType } from "@/types/player";
import { getPlayerDisplayName } from "@/utils/displayHelpers";

type Props = {
  player?: PlayerType;
  playerId?: string; // Add playerId as optional prop for fallback lookup
  onPress: () => void;
  opponentName?: string;
};

export function GamePlayerButton({
  player,
  playerId,
  onPress,
  opponentName,
}: Props) {
  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: opponentName
            ? theme.colorOnyx
            : theme.colorLightGrey,
        },
        pressed && styles.buttonPressed,
      ]}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.text,
            { color: opponentName ? theme.colorWhite : theme.colorBlack },
          ]}
        >
          {opponentName
            ? "Opponent"
            : player?.name ||
              (playerId ? getPlayerDisplayName(playerId) : "Unknown Player")}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    flexShrink: 1,
    flexWrap: "wrap",
    textAlign: "center",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colorOrangePeel,
    justifyContent: "center",
    height: 80,
    width: 120,
    marginVertical: 4,
    backgroundColor: theme.colorLightGrey,
  },
  buttonPressed: {
    backgroundColor: theme.colorOrangePeel,
  },
  content: {
    width: "100%",
  },
});
