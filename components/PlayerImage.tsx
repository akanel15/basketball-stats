import { theme } from "@/theme";
import { StyleSheet, Text, View } from "react-native";
import { BaskitballImage } from "./BaskitballImage";
import { PlayerType } from "@/types/player";

type Props = {
  player?: PlayerType;
  size?: number;
};

export function PlayerImage({ player, size = 80 }: Props) {
  const fontSize = size * 0.52; // Scale font size proportionally

  return player?.imageUri ? (
    <BaskitballImage size={size} imageUri={player.imageUri} />
  ) : (
    <View style={[styles.borderContainer, { width: size, height: size }]}>
      <View
        style={[styles.defaultImage, { width: size - 6, height: size - 6 }]}
      >
        <Text style={[styles.defaultImageText, { fontSize }]}>
          {player?.number || 0}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  borderContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorOrangePeel,
    borderRadius: 50,
  },
  defaultImage: {
    backgroundColor: theme.colorOnyx,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultImageText: {
    fontWeight: "bold",
    color: theme.colorWhite,
  },
});
