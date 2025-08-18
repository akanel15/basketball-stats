import { useLayoutEffect, useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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
import { TopSetCard } from "@/components/shared/TopSetCard";
import { useSetStore } from "@/store/setStore";
import { RecordBadge } from "@/components/shared/RecordBadge";
import { TeamDeletionConfirm } from "@/components/deletion/TeamDeletionConfirm";
import { getTeamDeletionInfo } from "@/utils/cascadeDelete";
import { LoadingState } from "@/components/LoadingState";
import * as ImagePicker from "expo-image-picker";

export default function TeamPage() {
  const { teamId } = useRoute().params as { teamId: string }; // Access teamId from route params
  const navigation = useNavigation();
  const getTeamSafely = useTeamStore((state) => state.getTeamSafely);

  //game info
  const games = useGameStore((state) => state.games);
  const gameList = Object.values(games);
  const teamGames = gameList.filter((game) => game.teamId === teamId);

  // player info
  const players = usePlayerStore((state) => state.players);
  const playersList = Object.values(players);
  const teamPlayers = playersList.filter((player) => player.teamId === teamId);

  // sets info
  const sets = useSetStore((state) => state.sets);
  const setsList = Object.values(sets);
  const teamSets = setsList.filter((set) => set.teamId === teamId);

  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMode, setCurrentMode] = useState(Team.Us);
  const [showDeletionConfirm, setShowDeletionConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedImageUri, setEditedImageUri] = useState<string | undefined>();

  const team = getTeamSafely(teamId);
  const teamName = team?.name || "Team";
  const updateTeam = useTeamStore((state) => state.updateTeam);

  const handleDeleteTeam = () => {
    setShowDeletionConfirm(true);
  };

  const handleDeletionConfirm = () => {
    setShowDeletionConfirm(false);
    navigation.goBack();
  };

  const handleDeletionCancel = () => {
    setShowDeletionConfirm(false);
  };

  const handleSwapTeam = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setEditedName(team?.name || "");
    setEditedImageUri(team?.imageUri);
  };

  const handleSave = async () => {
    if (editedName.trim() === "") {
      Alert.alert("Validation Error", "Team name cannot be empty");
      return;
    }

    try {
      await updateTeam(teamId, {
        name: editedName.trim(),
        imageUri: editedImageUri,
      });
      setIsEditMode(false);
    } catch {
      Alert.alert("Error", "Failed to update team. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditedName(team?.name || "");
    setEditedImageUri(team?.imageUri);
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setEditedImageUri(result.assets[0].uri);
    }
  };

  // Initialize edit values when team changes
  useEffect(() => {
    if (team) {
      setEditedName(team.name);
      setEditedImageUri(team.imageUri);
    }
  }, [team]);

  // Move all hooks before any conditional returns
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditMode ? "Edit Team" : teamName,
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
        <Pressable hitSlop={20} onPress={isEditMode ? handleSave : handleEdit}>
          <Text style={styles.headerButtonText}>
            {isEditMode ? "Done" : "Edit"}
          </Text>
        </Pressable>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, teamName, editedName, editedImageUri]);

  // Handle invalid team ID
  useEffect(() => {
    if (!team) {
      Alert.alert(
        "Team Not Found",
        "This team no longer exists or has been deleted.",
        [
          {
            text: "Go Back",
            onPress: () => navigation.goBack(),
          },
        ],
      );
      return;
    }
  }, [team, navigation]);

  // Show loading or error state if team doesn't exist
  if (!team) {
    return <LoadingState message="Loading team..." />;
  }

  const toggleStatsType = (type: Team) => {
    setCurrentMode(type);
  };
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

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

  // Helper functions for sets
  const calculatePerRunStat = (statValue: number, runCount: number): number => {
    return runCount > 0 ? statValue / runCount : 0;
  };

  const formatPerRun = (value: number): string => {
    return value.toFixed(1);
  };

  // Get top performing sets for the top performers section
  const getTopPerformingSets = () => {
    return teamSets
      .map((set) => ({
        set,
        pointsPerRun: calculatePerRunStat(set.stats[Stat.Points], set.runCount),
        assistsPerRun: calculatePerRunStat(
          set.stats[Stat.Assists],
          set.runCount,
        ),
      }))
      .sort((a, b) => b.pointsPerRun - a.pointsPerRun)
      .slice(0, 3)
      .map(({ set, pointsPerRun, assistsPerRun }) => ({
        set,
        primaryStat: {
          label: "pts/run",
          value: formatPerRun(pointsPerRun),
        },
        secondaryStat: {
          label: "ast/run",
          value: formatPerRun(assistsPerRun),
        },
      }));
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
        {isEditMode ? (
          <TouchableOpacity
            onPress={handleImagePicker}
            style={styles.editImageContainer}
          >
            <BaskitballImage
              size={150}
              imageUri={editedImageUri}
            ></BaskitballImage>
            <Text style={styles.editImageHint}>Tap to change image</Text>
          </TouchableOpacity>
        ) : (
          <BaskitballImage
            size={150}
            imageUri={team?.imageUri}
          ></BaskitballImage>
        )}

        {isEditMode ? (
          <View style={styles.editNameContainer}>
            <TextInput
              style={styles.editNameInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Team name"
              autoCapitalize="words"
              placeholderTextColor={theme.colorGrey}
            />
          </View>
        ) : (
          <RecordBadge
            wins={team.gameNumbers.wins}
            losses={team.gameNumbers.losses}
            draws={team.gameNumbers.draws}
          />
        )}
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
        <View style={styles.section}>
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

        {/* Top Performing Sets */}
        {teamSets.length > 0 && (
          <View style={[styles.section, { marginBottom: 100 }]}>
            <Text style={styles.sectionTitle}>Top Performing Sets</Text>
            <View style={styles.topSets}>
              {getTopPerformingSets().map(
                ({ set, primaryStat, secondaryStat }) => (
                  <TopSetCard
                    key={set.id}
                    set={set}
                    primaryStat={primaryStat}
                    secondaryStat={secondaryStat}
                  />
                ),
              )}
            </View>
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => router.navigate("/sets")}
            >
              <Text style={styles.viewAllBtnText}>View All Sets</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Delete and Cancel Buttons in Edit Mode */}
        {isEditMode && (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteTeam}
            >
              <FontAwesome5
                name="trash-alt"
                size={16}
                color={theme.colorWhite}
              />
              <Text style={styles.deleteButtonText}>Delete Team</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TeamDeletionConfirm
        visible={showDeletionConfirm}
        teamId={teamId}
        teamName={teamName}
        deletionInfo={getTeamDeletionInfo(teamId)}
        onCancel={handleDeletionCancel}
        onConfirm={handleDeletionConfirm}
      />
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
  topSets: {
    backgroundColor: theme.colorWhite,
    borderRadius: 12,
    shadowColor: theme.colorOnyx,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButtonText: {
    color: theme.colorOrangePeel,
    fontSize: 16,
    fontWeight: "600",
  },
  editImageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  editImageHint: {
    color: theme.colorWhite,
    fontSize: 14,
    marginTop: 8,
    fontWeight: "500",
  },
  editNameContainer: {
    width: "80%",
    marginTop: 16,
  },
  editNameInput: {
    backgroundColor: theme.colorWhite,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: theme.colorOnyx,
    borderWidth: 2,
    borderColor: theme.colorLightGrey,
  },
  editActions: {
    marginTop: 30,
    marginBottom: 50,
    gap: 12,
  },
  deleteButton: {
    backgroundColor: theme.colorDestructive,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonText: {
    color: theme.colorWhite,
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: theme.colorLightGrey,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: theme.colorOnyx,
    fontSize: 16,
    fontWeight: "600",
  },
});
