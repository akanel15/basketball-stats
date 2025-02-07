import { useGameStore } from "@/store/gameStore";
import { usePlayerStore } from "@/store/playerStore";
import { PlayByPlayType } from "@/types/game";
import { FlatList, Text, View } from "react-native";

type playByPlayProps = {
  gameId: string;
  period: number;
};

export default function PlayByPlay({ gameId, period }: playByPlayProps) {
  const game = useGameStore((state) => state.games[gameId]);
  const players = usePlayerStore((state) => state.players);

  const formatPlayByPlay = (play: PlayByPlayType) => {
    if (play.playerId === "Opponent") {
      return (
        <View>
          <Text>Opponent {play.action}</Text>
        </View>
      );
    }

    const player = players[play.playerId];
    if (!player) {
      return <Text>Unknown Player {play.action}</Text>;
    }

    return (
      <Text>
        {player.name}(#{player.number}) {play.action}
      </Text>
    );
  };

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
          renderItem={({ item }) => formatPlayByPlay(item)}
        />
      ) : (
        <Text>No plays recorded for this period</Text>
      )}
    </View>
  );
}
