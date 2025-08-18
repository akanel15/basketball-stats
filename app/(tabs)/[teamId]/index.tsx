import { useLayoutEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTeamStore } from "@/store/teamStore";
import { theme } from "@/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BaskitballImage } from "@/components/BaskitballImage";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Stat } from "@/types/stats";
import { Team } from "@/types/game";
import { StatCard } from "@/components/shared/StatCard";
import { GameItem } from "@/components/shared/GameItem";
import { Result } from "@/types/player";
import { router } from "expo-router";
import { useGameStore } from "@/store/gameStore";
import { TopPlayerCard } from "@/components/shared/TopPlayerCard";
import { usePlayerStore } from "@/store/playerStore";
import { StatsHeaderControls } from "@/components/shared/StatsHeaderControls";
import { RecordBadge } from "@/components/shared/RecordBadge";
import { ViewAllButton } from "@/components/shared/ViewAllButton";
import { EmptyStateText } from "@/components/shared/EmptyStateText";

export default function TeamPage() {
  const { teamId } = useRoute().params as { teamId: string }; // Access teamId from route params
  const navigation = useNavigation();
  const teams = useTeamStore((state) => state.teams);
  const deleteTeam = useTeamStore((state) => state.removeTeam);

  //game info
  const games = useGameStore((state) => state.games);
  const gameList = Object.values(games);
  const teamGames = gameList.filter((game) => game.teamId === teamId);

  const team = teams[teamId];
  const teamName = team?.name || "Team";

  // player info
  const players = usePlayerStore((state) => state.players);
  const playersList = Object.values(players);
  const teamPlayers = playersList.filter((player) => player.teamId === teamId);

  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMode, setCurrentMode] = useState(Team.Us);

  const toggleStatsType = (type: Team) => {
    setCurrentMode(type);
  };
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDeleteTeam = () => {
    Alert.alert(`${teamName} will be removed`, "All their stats will be lost", [
      {
        text: "Yes",
        onPress: () => {
          deleteTeam(teamId);
          navigation.goBack();
        },
        style: "destructive",
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSwapTeam = () => {
    navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: teamName,
      headerLeft: () => (
        <Pressable hitSlop={20} onPress={handleSwapTeam}>
          <FontAwesome6
            name="arrows-rotate"
            size={24}
            color={theme.colorOrangePeel}
          />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable hitSlop={20} onPress={handleDeleteTeam}>
          <FontAwesome5
            name="trash-alt"
            size={24}
            color={theme.colorOrangePeel}
          />
        </Pressable>
      ),
    });
  });

  const getMainStats = (teamType: Team) => {
    const divisor = team.gameNumbers.gamesPlayed || 1; // Avoid division by zero
    return (
      <>
        <StatCard
          value={(team.stats[teamType][Stat.Points] / divisor).toFixed(1)}
          label="Points"
        />
        <StatCard
          value={(team.stats[teamType][Stat.Assists] / divisor).toFixed(1)}
          label="Assists"
        />
        <StatCard
          value={(
            (team.stats[teamType][Stat.DefensiveRebounds] +
              team.stats[teamType][Stat.OffensiveRebounds]) /
            divisor
          ).toFixed(1)}
          label="Rebounds"
        />
        <StatCard
          value={(team.stats[teamType][Stat.Steals] / divisor).toFixed(1)}
          label="Steals"
        />
        <StatCard
          value={(team.stats[teamType][Stat.Blocks] / divisor).toFixed(1)}
          label="Blocks"
        />
        <StatCard
          value={(team.stats[teamType][Stat.Turnovers] / divisor).toFixed(1)}
          label="Turnovers"
        />
      </>
    );
  };

  const getExpandedStats = (teamType: Team) => {
    const divisor = team.gameNumbers.gamesPlayed || 1; // Avoid division by zero
    return (
      <>
        <StatCard
          value={(
            (team.stats[teamType][Stat.TwoPointMakes] +
              team.stats[teamType][Stat.ThreePointMakes]) /
            divisor
          ).toFixed(1)}
          label="FGM"
        />
        <StatCard
          value={(
            (team.stats[teamType][Stat.TwoPointMakes] +
              team.stats[teamType][Stat.ThreePointMakes]) /
            divisor
          ).toFixed(1)}
          label="FGA"
        />
        <StatCard
          value={
            (
              ((team.stats[teamType][Stat.TwoPointMakes] +
                team.stats[teamType][Stat.ThreePointMakes]) /
                (team.stats[teamType][Stat.TwoPointAttempts] +
                  team.stats[teamType][Stat.ThreePointAttempts])) *
              100
            ).toFixed(1) + "%"
          }
          label="FG%"
        />
        <StatCard
          value={(team.stats[teamType][Stat.TwoPointMakes] / divisor).toFixed(
            1,
          )}
          label="2PM"
        />
        <StatCard
          value={(
            team.stats[teamType][Stat.TwoPointAttempts] / divisor
          ).toFixed(1)}
          label="2PA"
        />
        <StatCard
          value={
            (
              (team.stats[teamType][Stat.TwoPointMakes] /
                team.stats[teamType][Stat.TwoPointAttempts]) *
              100
            ).toFixed(1) + "%"
          }
          label="2P%"
        />
        <StatCard
          value={(team.stats[teamType][Stat.ThreePointMakes] / divisor).toFixed(
            1,
          )}
          label="3PM"
        />
        <StatCard
          value={(
            team.stats[teamType][Stat.ThreePointAttempts] / divisor
          ).toFixed(1)}
          label="3PA"
        />
        <StatCard
          value={
            (
              (team.stats[teamType][Stat.ThreePointMakes] /
                team.stats[teamType][Stat.ThreePointAttempts]) *
              100
            ).toFixed(1) + "%"
          }
          label="3P%"
        />
        <StatCard
          value={(team.stats[teamType][Stat.FreeThrowsMade] / divisor).toFixed(
            1,
          )}
          label="FTM"
        />
        <StatCard
          value={(
            team.stats[teamType][Stat.FreeThrowsAttempted] / divisor
          ).toFixed(1)}
          label="FTA"
        />
        <StatCard
          value={
            (
              (team.stats[teamType][Stat.FreeThrowsMade] /
                team.stats[teamType][Stat.FreeThrowsAttempted]) *
              100
            ).toFixed(1) + "%"
          }
          label="FT%"
        />
        <StatCard
          value={(
            team.stats[teamType][Stat.OffensiveRebounds] / divisor
          ).toFixed(1)}
          label="Off Rebs"
        />
        <StatCard
          value={(
            team.stats[teamType][Stat.DefensiveRebounds] / divisor
          ).toFixed(1)}
          label="Def Rebs"
        />
        <StatCard
          value={(team.stats[teamType][Stat.FoulsCommitted] / divisor).toFixed(
            1,
          )}
          label="Fouls"
        />
      </>
    );
  };
  const getTopPlayers = () => {
    // Calculate efficiency score for each player
    const playersWithEfficiency = teamPlayers.map((player) => {
      const stats = player.stats;
      const games = player.gameNumbers.gamesPlayed || 1; // Avoid division by zero

      const efficiency =
        (stats[Stat.Points] +
          stats[Stat.Assists] +
          stats[Stat.OffensiveRebounds] +
          stats[Stat.DefensiveRebounds] +
          stats[Stat.Steals] +
          stats[Stat.Blocks] +
          stats[Stat.TwoPointMakes] +
          stats[Stat.ThreePointMakes] -
          (stats[Stat.TwoPointAttempts] +
            stats[Stat.ThreePointAttempts] +
            stats[Stat.Turnovers])) /
        games;

      return { player, efficiency };
    });

    // Sort by efficiency (highest first) and take top 3
    const top3Players = playersWithEfficiency
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, 3);

    // For each top player, find their 2 best individual stats (per game)
    return top3Players.map(({ player }) => {
      const games = player.gameNumbers.gamesPlayed || 1;

      const statEntries = Object.entries(player.stats)
        .filter(([stat, value]) =>
          [
            Stat.Points,
            Stat.Assists,
            Stat.OffensiveRebounds,
            Stat.DefensiveRebounds,
            Stat.Steals,
            Stat.Blocks,
            Stat.TwoPointMakes,
            Stat.ThreePointMakes,
          ].includes(stat as Stat),
        )
        .map(([stat, value]) => ({
          stat: stat as Stat,
          value: (value as number) / games, // Convert to per-game
        }))
        .sort((a, b) => b.value - a.value) // Sort by per-game value descending
        .slice(0, 2); // Take top 2

      return {
        player,
        bestStats: statEntries,
      };
    });
  };

  const renderMainStats = (): React.ReactNode => {
    if (currentMode === Team.Us) {
      return getMainStats(Team.Us);
    } else {
      return getMainStats(Team.Opponent);
    }
  };
  const renderExpandedStats = (): React.ReactNode => {
    if (currentMode === Team.Us) {
      return getExpandedStats(Team.Us);
    } else {
      return getExpandedStats(Team.Opponent);
    }
  };

  const renderRecentGames = () => {
    if (teamGames.length === 0) {
      //===
      return (
        <Text style={styles.noGamesText}>
          No games played yet.{"\n"}Start a game to track stats!
        </Text>
      );
    } else {
      return teamGames
        .slice(0, 3)
        .map((game) => (
          <GameItem
            key={game.id}
            opponent={`vs ${game.opposingTeamName}`}
            score={`${game.statTotals[0][Stat.Points]} - ${game.statTotals[1][Stat.Points]}`}
            result={
              game.statTotals[0][Stat.Points] > game.statTotals[1][Stat.Points]
                ? Result.Win
                : game.statTotals[0][Stat.Points] <
                    game.statTotals[1][Stat.Points]
                  ? Result.Loss
                  : Result.Draw
            }
          />
        ));
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={[styles.centered, styles.topBanner]}>
        <BaskitballImage size={150} imageUri={team?.imageUri}></BaskitballImage>
        <RecordBadge
          wins={team.gameNumbers.wins}
          losses={team.gameNumbers.losses}
          draws={team.gameNumbers.draws}
        />
      </View>

      <View style={styles.padding}>
        {/* Team Stats */}
        <View style={styles.section}>
          <View style={styles.statsHeader}>
            <Text style={styles.sectionTitle}>Team Stats</Text>
            <View style={styles.headerControls}>
              <View style={styles.statsToggle}>
                <TouchableOpacity
                  style={[
                    styles.toggleOption,
                    currentMode === Team.Us && styles.activeToggle,
                  ]}
                  onPress={() => toggleStatsType(Team.Us)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      currentMode === Team.Us && styles.activeToggleText,
                    ]}
                  >
                    For
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleOption,
                    currentMode === Team.Opponent && styles.activeToggle,
                  ]}
                  onPress={() => toggleStatsType(Team.Opponent)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      currentMode === Team.Opponent && styles.activeToggleText,
                    ]}
                  >
                    Against
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.expandBtn}
                onPress={toggleExpanded}
              >
                <Text style={styles.expandText}>
                  {isExpanded ? "Less" : "More"}
                </Text>
                <Text style={styles.expandArrow}>{isExpanded ? "▲" : "▼"}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.statsGrid}>
            {renderMainStats()}
            {isExpanded && renderExpandedStats()}
          </View>
        </View>
        {/* Recent Games */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Games</Text>
          <View style={styles.recentGames}>{renderRecentGames()}</View>
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => router.navigate("/games")}
          >
            <Text style={styles.viewAllBtnText}>View All Games</Text>
          </TouchableOpacity>
        </View>
        {/* Top Players */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <Text style={styles.sectionTitle}>Top Performers</Text>
          <View style={styles.topPlayers}>
            {getTopPlayers().map(({ bestStats, player }, index) => (
              <TopPlayerCard
                key={player.id}
                player={player}
                primaryStat={bestStats[0]}
                secondaryStat={bestStats[1]}
              />
            ))}
          </View>
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => router.navigate("/players")}
          >
            <Text style={styles.viewAllBtnText}>View All Players</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  centered: {
    alignItems: "center",
    marginBottom: 24,
    padding: 24,
  },
  topBanner: {
    backgroundColor: theme.colorOnyx,
  },
  padding: {
    padding: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colorOnyx,
    marginBottom: 15,
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  headerControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statsToggle: {
    flexDirection: "row",
    backgroundColor: theme.colorLightGrey,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colorLightGrey,
    overflow: "hidden",
  },
  toggleOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  activeToggle: {
    backgroundColor: theme.colorOrangePeel,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colorGrey,
  },
  activeToggleText: {
    color: theme.colorWhite,
  },
  expandBtn: {
    backgroundColor: theme.colorBlue,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  expandText: {
    color: theme.colorWhite,
    fontSize: 12,
    fontWeight: "600",
  },
  expandArrow: {
    color: theme.colorWhite,
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  recentGames: {
    backgroundColor: theme.colorWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colorLightGrey,
  },
  viewAllBtn: {
    backgroundColor: theme.colorBlue,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  viewAllBtnText: {
    color: theme.colorWhite,
    fontWeight: "600",
    fontSize: 16,
  },
  noGamesText: {
    textAlign: "center",
    color: theme.colorGrey,
    fontSize: 16,
    fontStyle: "italic",
    padding: 20,
  },
  topPlayers: {
    backgroundColor: theme.colorWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colorLightGrey,
  },
});
