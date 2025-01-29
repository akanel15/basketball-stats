import { BaskitballButton } from "@/components/BaskitballButton";
import { useGameStore } from "@/store/gameStore";
import { usePlayerStore } from "@/store/playerStore";
import { useTeamStore } from "@/store/teamStore";
import { Team } from "@/types/game";
import { Stat } from "@/types/stats";
import { useRoute } from "@react-navigation/core";
import { Text, View } from "react-native";

export default function GamePage() {
  const { gameId } = useRoute().params as { gameId: string }; // Access playerId from route params

  //Player Selection
  //const playerList
  const game = useGameStore((state) => state.games[gameId]);
  const players = usePlayerStore((state) => state.players);
  const teamId = useTeamStore((state) => state.currentTeamId);
  const teamPlayers = players.filter((player) => player.teamId === teamId);

  const handleStatUpdate = useGameStore((state) => state.handleStatUpdate);

  const handlePress = () => {
    handleStatUpdate(gameId, teamPlayers[0].id, Stat.Points, 3);
    handleStatUpdate(gameId, teamPlayers[0].id, Stat.ThreePointAttempts, 3);
    handleStatUpdate(gameId, teamPlayers[0].id, Stat.ThreePointMakes, 3);
  };
  //playerList[0]

  return (
    <View>
      <Text>
        {game.statTotals[Team.Us][Stat.Points]}
        {game.statTotals[Team.Us][Stat.OffensiveRebounds]}
      </Text>
      <BaskitballButton onPress={handlePress} title="test"></BaskitballButton>
    </View>
  );
}

// const styles = StyleSheet.create({
// });
