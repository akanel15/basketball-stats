import { useGameStore } from "@/store/gameStore";
import { PlayByPlayType } from "@/types/game";
import { View, Text, FlatList } from "react-native";
import PlayByPlayTile from "./PlayByPlayTile";
import { useState, useMemo } from "react";
import { getPointsForPlay } from "@/utils/basketball";

type PlayByPlayProps = {
  gameId: string;
  period: number;
  onDeletePlay?: (playIndex: number, period: number) => void;
};

export default function PlayByPlay({
  gameId,
  period,
  onDeletePlay,
}: PlayByPlayProps) {
  const [selectedPlayIndex, setSelectedPlayIndex] = useState<number | null>(
    null,
  );

  const game = useGameStore((state) => state.games[gameId]);

  // Pre-compute cumulative scores from all periods up to (but not including) current period
  const cumulativePeriodTotals = useMemo(() => {
    if (!game?.periods) return [];

    return game.periods.reduce(
      (acc, periodInfo, pIndex) => {
        // Check if periodInfo exists and playByPlay exists and is an array before reducing
        const periodTotals =
          periodInfo &&
          periodInfo.playByPlay &&
          Array.isArray(periodInfo.playByPlay)
            ? periodInfo.playByPlay.reduce(
                (pAcc, play) => {
                  const points = getPointsForPlay(play);
                  if (play.playerId === "Opponent") {
                    pAcc.opponent += points;
                  } else {
                    pAcc.team += points;
                  }
                  return pAcc;
                },
                { team: 0, opponent: 0 },
              )
            : { team: 0, opponent: 0 }; // Fallback to 0 scores if periodInfo or playByPlay is null/undefined

        const lastTotal = acc[pIndex - 1] ?? { team: 0, opponent: 0 };
        acc[pIndex] = {
          team: lastTotal.team + periodTotals.team,
          opponent: lastTotal.opponent + periodTotals.opponent,
        };

        return acc;
      },
      [] as { team: number; opponent: number }[],
    );
  }, [game?.periods]);

  const handleSelectPlay = (index: number) => {
    if (selectedPlayIndex === index) {
      // Deselect if tapping the same play
      setSelectedPlayIndex(null);
    } else {
      // Select the play
      setSelectedPlayIndex(index);
    }
  };

  const handleDeletePlay = (index: number) => {
    if (onDeletePlay) {
      onDeletePlay(index, period);
    }
    setSelectedPlayIndex(null); // Deselect after delete
  };

  if (
    !game ||
    !game.periods ||
    !game.periods[period] ||
    !game.periods[period]?.playByPlay ||
    !Array.isArray(game.periods[period]?.playByPlay)
  ) {
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
            // Compute cumulative score up to the current play across all periods
            const calculateCumulativeScore = () => {
              // Get base scores from all completed periods before current period
              const baseTeamScore =
                period === 0
                  ? 0
                  : (cumulativePeriodTotals[period - 1]?.team ?? 0);
              const baseOpponentScore =
                period === 0
                  ? 0
                  : (cumulativePeriodTotals[period - 1]?.opponent ?? 0);

              // Calculate scores from plays in current period up to and including current play
              // Since playByPlay is stored in reverse chronological order (newest first),
              // we need to slice from index to end to get plays from current play to start of period
              const currentPeriodScores = (
                game.periods[period].playByPlay || []
              )
                .slice(index)
                .reduce(
                  (acc, play: PlayByPlayType) => {
                    const points = getPointsForPlay(play);
                    if (play.playerId === "Opponent") {
                      acc.opponentScore += points;
                    } else {
                      acc.teamScore += points;
                    }
                    return acc;
                  },
                  { teamScore: 0, opponentScore: 0 },
                );

              return {
                teamScore: baseTeamScore + currentPeriodScores.teamScore,
                opponentScore:
                  baseOpponentScore + currentPeriodScores.opponentScore,
              };
            };

            const { teamScore, opponentScore } = calculateCumulativeScore();

            const isMadeShot = item.action.includes("made");
            return (
              <PlayByPlayTile
                play={item}
                teamScore={isMadeShot ? teamScore : undefined}
                opponentScore={isMadeShot ? opponentScore : undefined}
                isSelected={selectedPlayIndex === index}
                onSelect={() => handleSelectPlay(index)}
                onDelete={() => handleDeletePlay(index)}
              />
            );
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
