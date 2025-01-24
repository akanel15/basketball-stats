import { StyleSheet, View, Text, Pressable } from "react-native";
import { theme } from "@/theme";
import { PlayerType } from "@/store/playerStore";
import { BaskitballImage } from "./BaskitballImage";
import { Link } from "expo-router";

export function PlayerCard({ player }: { player: PlayerType }) {
  return (
    <Link href={`/players/${player.id}`} asChild>
      <Pressable style={styles.playerCard}>
        {player.imageUri ? (
          <BaskitballImage size={80} imageUri={player.imageUri} />
        ) : (
          <View style={styles.borderContainer}>
            <View style={styles.defaultImage}>
              <Text style={styles.defaultImageText}>{player.number}</Text>
            </View>
          </View>
        )}

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
