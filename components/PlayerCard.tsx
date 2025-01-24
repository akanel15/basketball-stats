import { StyleSheet, View, Text, Pressable } from "react-native";
import { theme } from "@/theme";
import { PlayerType } from "@/store/playerStore";
import { Link } from "expo-router";
import { PlayerImage } from "./PlayerImage";

export function PlayerCard({ player }: { player: PlayerType }) {
  return (
    <Link href={`/players/${player.id}`} asChild>
      <Pressable style={styles.playerCard}>
        <PlayerImage player={player} size={80}></PlayerImage>
        <View style={styles.details}>
          <Text numberOfLines={1} style={styles.playerName}>
            {player.name}
          </Text>
          <Text style={styles.subtitle}>Click to see more</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  playerCard: {
    flexDirection: "row",
    shadowColor: theme.colorOnyx,
    backgroundColor: theme.colorWhite,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  details: {
    padding: 14,
    justifyContent: "center",
  },
  playerName: {
    fontSize: 18,
    marginBottom: 4,
    marginLeft: 8,
  },
  subtitle: {
    color: theme.colorGrey,
    marginLeft: 8,
  },
});
