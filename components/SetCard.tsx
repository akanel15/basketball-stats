import { StyleSheet, View, Text, Pressable } from "react-native";
import { theme } from "@/theme";
import { Link } from "expo-router";
import { Stat } from "@/types/stats";
import { SetType } from "@/types/set";
//<PlayerImage game={game} size={80}></PlayerImage>

export function SetCard({ set }: { set: SetType }) {
  const pointsPerRun =
    set.runCount > 0 ? set.stats[Stat.Points] / set.runCount : 0;

  return (
    <Link href={`/sets/${set.id}`} asChild>
      <Pressable style={styles.playerCard}>
        <View style={styles.details}>
          <Text numberOfLines={1} style={styles.playerName}>
            {set.name}
          </Text>
          <Text style={styles.subtitle}>Points Per Set: {pointsPerRun}</Text>
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
