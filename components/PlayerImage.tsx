import { theme } from "@/theme";
import { StyleSheet, Text, View } from "react-native";
import { BaskitballImage } from "./BaskitballImage";
import { PlayerType } from "@/types/player";
type Props = {
  player?: PlayerType;
  size?: number;
  imageUri?: string;
};

export function PlayerImage({ player, size }: Props) {
  return player?.imageUri ? (
    <BaskitballImage size={size} imageUri={player.imageUri} />
  ) : (
    <View style={styles.borderContainer}>
      <View style={styles.defaultImage}>
        <Text style={styles.defaultImageText}>{player?.number || 0}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  borderContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorOrangePeel,
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  defaultImage: {
    backgroundColor: theme.colorOnyx,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 74,
    height: 74,
  },
  defaultImageText: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colorWhite,
  },
});
