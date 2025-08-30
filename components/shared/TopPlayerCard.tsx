import { theme } from "@/theme";
import { PlayerType } from "@/types/player";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native";
import { PlayerImage } from "../PlayerImage";
import { getStatLabel, Stat } from "@/types/stats";

type TopPlayerCardProps = {
  player: PlayerType;
  primaryStat: { stat: Stat; value: number };
  secondaryStat: { stat: Stat; value: number };
};

export function TopPlayerCard({ player, primaryStat, secondaryStat }: TopPlayerCardProps) {
  return (
    <View style={styles.playerItem}>
      <View style={styles.playerInfo}>
        <View style={styles.playerAvatar}>
          <PlayerImage player={player} size={40} />
        </View>
        <View>
          <Text style={styles.playerName}>{player.name}</Text>
        </View>
      </View>
      <View style={styles.playerStats}>
        <Text style={styles.primaryStat}>
          {primaryStat.value.toFixed(1)} {getStatLabel(primaryStat.stat)}
        </Text>
        <Text style={styles.secondaryStat}>
          {secondaryStat.value.toFixed(1)} {getStatLabel(secondaryStat.stat)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  playerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorLightGrey,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    backgroundColor: theme.colorOrangePeel,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  playerName: {
    fontWeight: "600",
    fontSize: 16,
    color: theme.colorOnyx,
  },
  playerStats: {
    alignItems: "flex-end",
  },
  primaryStat: {
    fontWeight: "700",
    fontSize: 16,
    color: theme.colorOrangePeel,
  },
  secondaryStat: {
    fontSize: 12,
    color: theme.colorGrey,
  },
});
