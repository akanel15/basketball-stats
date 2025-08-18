import { StyleSheet, Text, View } from "react-native";
import { GameType, Team } from "@/types/game";
import { initialBaseStats, Stat, StatsType } from "@/types/stats";
import PeriodScoreTile from "./PeriodScoreTile";
import { theme } from "@/theme";
import { getPlayerDisplayName } from "@/utils/displayHelpers";

type ShareableBoxScoreProps = {
  game: GameType;
  players: Record<string, any>;
};

export default function ShareableBoxScore({
  game,
  players,
}: ShareableBoxScoreProps) {
  const headings = [
    "PTS",
    "REB",
    "AST",
    "STL",
    "BLK",
    "FGM",
    "FGA",
    "FG%",
    "2PM",
    "2PA",
    "2P%",
    "3PM",
    "3PA",
    "3P%",
    "FTM",
    "FTA",
    "FT%",
    "OREB",
    "DREB",
    "TOV",
    "PF",
    "FD",
    "DEF",
    "EFF",
    "+/-",
  ];

  const formatStats = (stats: StatsType): string[] => {
    const safeDivide = (num: number, den: number) =>
      den === 0 ? "-" : Math.round((num / den) * 100).toString() + "%";

    return [
      stats[Stat.Points].toString(),
      (
        stats[Stat.DefensiveRebounds] + stats[Stat.OffensiveRebounds]
      ).toString(),
      stats[Stat.Assists].toString(),
      stats[Stat.Steals].toString(),
      stats[Stat.Blocks].toString(),
      (stats[Stat.TwoPointMakes] + stats[Stat.ThreePointMakes]).toString(),
      (
        stats[Stat.TwoPointAttempts] + stats[Stat.ThreePointAttempts]
      ).toString(),
      safeDivide(
        stats[Stat.TwoPointMakes] + stats[Stat.ThreePointMakes],
        stats[Stat.TwoPointAttempts] + stats[Stat.ThreePointAttempts],
      ),
      stats[Stat.TwoPointMakes].toString(),
      stats[Stat.TwoPointAttempts].toString(),
      safeDivide(stats[Stat.TwoPointMakes], stats[Stat.TwoPointAttempts]),
      stats[Stat.ThreePointMakes].toString(),
      stats[Stat.ThreePointAttempts].toString(),
      safeDivide(stats[Stat.ThreePointMakes], stats[Stat.ThreePointAttempts]),
      stats[Stat.FreeThrowsMade].toString(),
      stats[Stat.FreeThrowsAttempted].toString(),
      safeDivide(stats[Stat.FreeThrowsMade], stats[Stat.FreeThrowsAttempted]),
      stats[Stat.OffensiveRebounds].toString(),
      stats[Stat.DefensiveRebounds].toString(),
      stats[Stat.Turnovers].toString(),
      stats[Stat.FoulsCommitted].toString(),
      stats[Stat.FoulsDrawn].toString(),
      stats[Stat.Deflections].toString(),
      (
        stats[Stat.Points] +
        stats[Stat.Assists] +
        stats[Stat.OffensiveRebounds] +
        stats[Stat.DefensiveRebounds] +
        stats[Stat.Steals] +
        stats[Stat.Blocks] +
        stats[Stat.TwoPointMakes] +
        stats[Stat.ThreePointMakes] -
        (stats[Stat.TwoPointAttempts] +
          stats[Stat.ThreePointAttempts] +
          stats[Stat.Turnovers])
      ).toString(),
      stats[Stat.PlusMinus].toString(),
    ];
  };

  // Build box score list
  const allPlayerIds = [...game.gamePlayedList];
  const playerBoxScoreEntries = allPlayerIds.map((playerId) => {
    const player = players[playerId];
    return {
      id: playerId,
      name: player ? player.name : getPlayerDisplayName(playerId),
      stats: formatStats(game.boxScore[playerId] ?? { ...initialBaseStats }),
    };
  });

  const boxScoreList = [
    ...playerBoxScoreEntries,
    { id: "Us", name: "Total", stats: formatStats(game.statTotals[Team.Us]) },
    {
      id: "Opponent",
      name: game.opposingTeamName,
      stats: formatStats(game.statTotals[Team.Opponent]),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Score Summary */}
      <View style={styles.scoreSection}>
        <PeriodScoreTile game={game} />
      </View>

      {/* Full Box Score Table - No Scrolling */}
      <View style={styles.tableContainer}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={[styles.playerHeaderCell, styles.headerText]}>
            Player
          </Text>
          {headings.map((heading, index) => (
            <Text
              key={index}
              style={[styles.statHeaderCell, styles.headerText]}
            >
              {heading}
            </Text>
          ))}
        </View>

        {/* Player Rows */}
        {boxScoreList.map((item) => (
          <View key={item.id} style={styles.dataRow}>
            <Text
              style={[
                styles.playerCell,
                item.id === "Us" || item.id === "Opponent"
                  ? styles.totalText
                  : null,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>
            {item.stats.map((stat, index) => (
              <Text
                key={index}
                style={[
                  styles.statCell,
                  item.id === "Us" || item.id === "Opponent"
                    ? styles.totalText
                    : null,
                ]}
              >
                {stat}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    minWidth: 1200, // Ensure enough width for all stats
  },
  scoreSection: {
    marginBottom: 24,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: theme.colorLightGrey,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: theme.colorLightGrey,
    borderBottomWidth: 2,
    borderBottomColor: theme.colorOnyx,
  },
  dataRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: theme.colorLightGrey,
    minHeight: 32,
    alignItems: "center",
  },
  playerHeaderCell: {
    width: 120,
    padding: 8,
    fontWeight: "bold",
    fontSize: 12,
    textTransform: "uppercase",
    borderRightWidth: 1,
    borderRightColor: theme.colorLightGrey,
  },
  statHeaderCell: {
    width: 40,
    padding: 4,
    fontWeight: "bold",
    fontSize: 10,
    textTransform: "uppercase",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: theme.colorLightGrey,
  },
  playerCell: {
    width: 120,
    padding: 8,
    fontSize: 11,
    fontWeight: "500",
    borderRightWidth: 1,
    borderRightColor: theme.colorLightGrey,
  },
  statCell: {
    width: 40,
    padding: 4,
    fontSize: 10,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: theme.colorLightGrey,
  },
  headerText: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  totalText: {
    fontWeight: "bold",
    color: theme.colorOnyx,
  },
});
