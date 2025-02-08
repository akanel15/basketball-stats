import { BaskitballButton } from "@/components/BaskitballButton";
import { useGameStore } from "@/store/gameStore";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { GameType, Team } from "@/types/game";
import { usePlayerStore } from "@/store/playerStore";
import { initialBaseStats, Stat, StatsType } from "@/types/stats";
import PeriodScoreTile from "./PeriodScoreTile";
import { theme } from "@/theme";

type BoxScoreProps = {
  gameId: string;
  onClose: () => void;
};

export default function BoxScoreOverlay({ gameId, onClose }: BoxScoreProps) {
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
  ];

  const game: GameType = useGameStore((state) => state.games[gameId]);
  const players = usePlayerStore((state) => state.players);
  const teamPlayers = Object.values(players).filter(
    (player) => player.teamId === game.teamId,
  );

  if (!game) return null;

  const formatStats = (stats: StatsType): string[] => {
    const safeDivide = (num: number, den: number) =>
      den === 0 ? "0" : (num / den).toFixed(0);

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
        stats[Stat.OffensiveRebounds] +
        stats[Stat.DefensiveRebounds] +
        stats[Stat.Steals] +
        stats[Stat.Blocks] +
        stats[Stat.TwoPointMakes] +
        stats[Stat.ThreePointMakes] +
        stats[Stat.FreeThrowsMade] -
        (stats[Stat.TwoPointAttempts] +
          stats[Stat.ThreePointAttempts] +
          stats[Stat.FreeThrowsAttempted] +
          stats[Stat.Turnovers])
      ).toString(),
    ];
  };

  const boxScoreList = [
    { id: "Us", name: "Total", stats: formatStats(game.statTotals[Team.Us]) },
    ...teamPlayers.map((player) => ({
      id: player.id,
      name: player.name,
      stats: formatStats(game.boxScore[player.id] ?? { ...initialBaseStats }),
    })),
    {
      id: "Opponent",
      name: game.opposingTeamName,
      stats: formatStats(game.statTotals[Team.Opponent]),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Score Summary */}
      <View style={styles.largeSection}>
        <PeriodScoreTile game={game} />
      </View>

      {/* Fixed Header Row (Stat Headings) */}
      <ScrollView horizontal>
        <View>
          {/* Fixed Column (Player Names) & Scrollable Stats */}
          <View style={styles.headerRow}>
            <Text style={[styles.playerName, styles.headerText]}>Player</Text>
            {headings.map((stat, index) => (
              <Text key={index} style={[styles.statCell, styles.headerText]}>
                {stat}
              </Text>
            ))}
          </View>

          {/* Scrollable List */}
          <FlatList
            data={boxScoreList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.row}>
                {/* Fixed Player Name */}
                <Text
                  style={[
                    styles.playerName,
                    item.id === "Us" || item.id === "Opponent"
                      ? styles.boldText
                      : null,
                  ]}
                >
                  {item.name}
                </Text>

                {/* Scrollable Player Stats */}
                {item.stats.map((stat, index) => (
                  <Text key={index} style={styles.statCell}>
                    {stat}
                  </Text>
                ))}
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Close Button */}
      <View style={styles.closeButtonContainer}>
        <BaskitballButton onPress={onClose} title="Close" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "white", flex: 1 },
  largeSection: { marginBottom: 20 },
  closeButtonContainer: { marginBottom: 4 },

  // Table Row Styles
  row: { flexDirection: "row", paddingVertical: 4, borderTopWidth: 1 },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 6,
    backgroundColor: theme.colorLightGrey,
    borderBottomWidth: 2,
  },

  // Column Styles
  playerName: { width: 140, fontSize: 14, padding: 8, fontWeight: "500" },
  statCell: { width: 50, textAlign: "center", padding: 2, fontSize: 14 },
  headerText: { fontWeight: "bold", textTransform: "uppercase" },
  boldText: { fontWeight: "bold" },
});
