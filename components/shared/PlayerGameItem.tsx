import { theme } from "@/theme";
import { StyleSheet, Text, View } from "react-native";
import { Result } from "@/types/player";

type PlayerGameItemProps = {
  opponent: string;
  score: string;
  result: Result;
  playerStats?: {
    points: number;
    assists?: number;
    rebounds?: number;
  };
};

export function PlayerGameItem({
  opponent,
  score,
  result,
  playerStats,
}: PlayerGameItemProps) {
  return (
    <View style={styles.gameItem}>
      <View style={styles.gameInfo}>
        <Text style={styles.gameOpponent}>{opponent}</Text>
        {playerStats && (
          <Text style={styles.playerStats}>
            {playerStats.points}pts
            {playerStats.assists !== undefined && `, ${playerStats.assists}ast`}
            {playerStats.rebounds !== undefined &&
              `, ${playerStats.rebounds}reb`}
          </Text>
        )}
      </View>
      <View style={styles.gameScore}>
        <Text style={styles.score}>{score}</Text>
        <View
          style={[
            styles.result,
            result === Result.Win
              ? styles.win
              : result === Result.Loss
                ? styles.loss
                : styles.draw,
          ]}
        >
          <Text
            style={[
              styles.resultText,
              result === Result.Win
                ? styles.winText
                : result === Result.Loss
                  ? styles.lossText
                  : styles.drawText,
            ]}
          >
            {result === Result.Win ? "W" : result === Result.Loss ? "L" : "D"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gameItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorLightGrey,
  },
  gameInfo: {
    flex: 1,
  },
  gameOpponent: {
    fontWeight: "600",
    fontSize: 16,
    color: theme.colorOnyx,
    marginBottom: 2,
  },
  playerStats: {
    fontSize: 12,
    color: theme.colorGrey,
    fontWeight: "500",
  },
  gameScore: {
    alignItems: "flex-end",
  },
  score: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 2,
    color: theme.colorOnyx,
  },
  result: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  win: {
    backgroundColor: theme.colorLightGreen,
  },
  loss: {
    backgroundColor: theme.colorLightRed,
  },
  draw: {
    backgroundColor: theme.colorLightGrey,
  },
  resultText: {
    fontSize: 12,
    fontWeight: "600",
  },
  winText: {
    color: theme.colorGreen,
  },
  lossText: {
    color: theme.colorRed,
  },
  drawText: {
    color: theme.colorGrey,
  },
});
