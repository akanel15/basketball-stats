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
import { StatCard } from "@/components/teamPage/StatCard";

export default function TeamPage() {
  const { teamId } = useRoute().params as { teamId: string }; // Access teamId from route params
  const navigation = useNavigation();
  const teams = useTeamStore((state) => state.teams);
  const deleteTeam = useTeamStore((state) => state.removeTeam);

  const team = teams[teamId];
  const teamName = team?.name || "Team";

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
          label="Foulds"
        />
      </>
    );
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

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={[styles.centered, styles.topBanner]}>
        <BaskitballImage size={150} imageUri={team?.imageUri}></BaskitballImage>
        <View style={styles.teamRecord}>
          <Text style={styles.recordText}>
            {team.gameNumbers.wins}-{team.gameNumbers.losses}-
            {team.gameNumbers.draws} Record
          </Text>
        </View>
      </View>

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
            <TouchableOpacity style={styles.expandBtn} onPress={toggleExpanded}>
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
  teamRecord: {
    backgroundColor: theme.colorGrey,
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  recordText: {
    color: theme.colorWhite,
    fontSize: 16,
    fontWeight: "600",
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
    gap: 10, // Reduced gap
  },
});
