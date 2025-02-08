import { BaskitballButton } from "@/components/BaskitballButton";
import { useGameStore } from "@/store/gameStore";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { GameType, Team } from "@/types/game";
import { usePlayerStore } from "@/store/playerStore";
import { initialBaseStats } from "@/types/stats";
import PeriodScoreTile from "./PeriodScoreTile";

type BoxScoreProps = {
  gameId: string;
  onClose: () => void;
};

export default function BoxScoreOverlay({ gameId, onClose }: BoxScoreProps) {
  const game: GameType = useGameStore((state) => state.games[gameId]);

  const players = usePlayerStore((state) => state.players);
  const playersList = Object.values(players);
  const teamPlayers = playersList.filter(
    (player) => player.teamId === game.teamId,
  );

  const boxScoreList = [
    ...teamPlayers.map((player) => ({
      id: player.id,
      name: player.name,
      stats: game.boxScore[player.id] ?? { ...initialBaseStats }, // Default to empty stats if none exist
    })),
    {
      id: "Opponent",
      name: game.opposingTeamName,
      stats: game.statTotals[Team.Opponent],
    },
  ];

  if (!game) return null;
  return (
    <View style={styles.container}>
      {/* Period-by-Period Score */}
      <PeriodScoreTile game={game} />

      {/* Scrollable Box Score */}
      <ScrollView horizontal>
        <FlatList
          data={boxScoreList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.playerName}>{item.name}</Text>
              {Object.values(item.stats).map((stat, index) => (
                <Text key={index} style={styles.statCell}>
                  {stat}
                </Text>
              ))}
            </View>
          )}
        />
      </ScrollView>
      <BaskitballButton onPress={onClose} title="Close" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 1,
  },
  playerName: {
    width: 120,
    fontWeight: "bold",
  },
  statCell: {
    width: 50,
    textAlign: "center",
  },
});
