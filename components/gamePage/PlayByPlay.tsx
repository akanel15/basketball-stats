import { useGameStore } from "@/store/gameStore";
import { FlatList, Text, View } from "react-native";
import PlayByPlayTile from "./PlayByPlayTile";
import { PlayByPlayType } from "@/types/game";
import { Stat } from "@/types/stats";

type PlayByPlayProps = {
  gameId: string;
  period: number;
};

export default function PlayByPlay({ gameId, period }: PlayByPlayProps) {
  // Function to determine points from action
  const getPointsForAction = (action: Stat): number => {
    switch (action) {
      case Stat.ThreePointMakes:
        return 3;
      case Stat.TwoPointMakes:
        return 2;
      case Stat.FreeThrowsMade:
        return 1;
      default:
        return 0;
    }
  };

  const game = useGameStore((state) => state.games[gameId]);

  if (!game || !game.periods || !game.periods[period]) {
    return (
      <View>
        <Text>No plays recorded for this period</Text>
      </View>
    );
  }

  return (
    <View>
      {game.periods[period].playByPlay.length !== 0 ? (
        <FlatList
          data={game.periods[period].playByPlay}
          renderItem={({ item, index }) => {
            // Compute the score up to the current play
            const { teamScore, opponentScore } = game.periods[period].playByPlay
              .slice(index, game.periods[period].playByPlay.length) // Only consider plays up to this point
              .reduce(
                (acc, play: PlayByPlayType) => {
                  const points = getPointsForAction(play.action);
                  if (play.playerId === "Opponent") {
                    acc.opponentScore += points;
                  } else {
                    acc.teamScore += points;
                  }
                  return acc;
                },
                { teamScore: 0, opponentScore: 0 },
              );

            const isMadeShot = item.action.includes("made");
            if (isMadeShot) {
              return (
                <PlayByPlayTile
                  play={item}
                  teamScore={teamScore}
                  opponentScore={opponentScore}
                />
              );
            } else {
              return <PlayByPlayTile play={item} />;
            }
          }}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ flex: 1 }}
        />
      ) : (
        <Text>No plays recorded for this period</Text>
      )}
    </View>
  );
}
