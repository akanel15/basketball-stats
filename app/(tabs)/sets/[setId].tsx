import { useLayoutEffect, useState, useEffect } from "react";
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
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { theme } from "@/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSetStore } from "@/store/setStore";
import { useTeamStore } from "@/store/teamStore";
import { Stat } from "@/types/stats";
import { StatCard } from "@/components/shared/StatCard";
import { ViewAllButton } from "@/components/shared/ViewAllButton";
import { BaskitballImage } from "@/components/BaskitballImage";
import { IconAvatar } from "@/components/shared/IconAvatar";
import { router } from "expo-router";
import { confirmSetDeletion } from "@/utils/playerDeletion";
import { LoadingState } from "@/components/LoadingState";

export default function SetPage() {
  const { setId } = useRoute().params as { setId: string };
  const navigation = useNavigation();
  const getSetSafely = useSetStore((state) => state.getSetSafely);
  const teams = useTeamStore((state) => state.teams);

  const [isExpanded, setIsExpanded] = useState(false);

  const set = getSetSafely(setId);
  const setName = set?.name || "Set";

  const handleDeleteSet = () => {
    confirmSetDeletion(setId, setName, () => {
      navigation.goBack();
    });
  };

  // Move all hooks before any conditional returns
  useLayoutEffect(() => {
    navigation.setOptions({
      title: setName,
      headerRight: () => (
        <Pressable hitSlop={20} onPress={handleDeleteSet}>
          <FontAwesome5
            name="trash-alt"
            size={24}
            color={theme.colorOrangePeel}
          />
        </Pressable>
      ),
    });
  });

  // Handle invalid set ID
  useEffect(() => {
    if (!set) {
      Alert.alert(
        "Set Not Found",
        "This set no longer exists or has been deleted.",
        [
          {
            text: "Go Back",
            onPress: () => navigation.goBack(),
          },
        ],
      );
      return;
    }
  }, [set, navigation]);

  // Show loading or error state if set doesn't exist
  if (!set) {
    return <LoadingState message="Loading set..." />;
  }

  const team = teams[set?.teamId || ""];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getMainStats = () => {
    const divisor = set.runCount || 1;
    return (
      <>
        <StatCard
          value={(set.stats[Stat.Points] / divisor).toFixed(1)}
          label="Pts/Run"
        />
        <StatCard
          value={(set.stats[Stat.Assists] / divisor).toFixed(1)}
          label="Ast/Run"
        />
        <StatCard
          value={(
            (set.stats[Stat.DefensiveRebounds] +
              set.stats[Stat.OffensiveRebounds]) /
            divisor
          ).toFixed(1)}
          label="Reb/Run"
        />
        <StatCard
          value={(set.stats[Stat.Steals] / divisor).toFixed(1)}
          label="Stl/Run"
        />
        <StatCard
          value={(set.stats[Stat.Blocks] / divisor).toFixed(1)}
          label="Blk/Run"
        />
        <StatCard
          value={(set.stats[Stat.Turnovers] / divisor).toFixed(1)}
          label="TO/Run"
        />
      </>
    );
  };

  // Helper function to format percentages safely
  const formatPercentage = (made: number, attempted: number) => {
    if (attempted === 0 || made === 0) return "-";
    const percentage = (made / attempted) * 100;
    if (isNaN(percentage)) return "-";
    if (percentage >= 100) return "100%";
    return percentage.toFixed(1) + "%";
  };

  const getExpandedStats = () => {
    const divisor = set.runCount || 1;
    return (
      <>
        <StatCard
          value={(
            (set.stats[Stat.TwoPointMakes] + set.stats[Stat.ThreePointMakes]) /
            divisor
          ).toFixed(1)}
          label="FGM/Run"
        />
        <StatCard
          value={(
            (set.stats[Stat.TwoPointAttempts] +
              set.stats[Stat.ThreePointAttempts]) /
            divisor
          ).toFixed(1)}
          label="FGA/Run"
        />
        <StatCard
          value={formatPercentage(
            set.stats[Stat.TwoPointMakes] + set.stats[Stat.ThreePointMakes],
            set.stats[Stat.TwoPointAttempts] +
              set.stats[Stat.ThreePointAttempts],
          )}
          label="FG%"
        />
        <StatCard
          value={(set.stats[Stat.TwoPointMakes] / divisor).toFixed(1)}
          label="2PM/Run"
        />
        <StatCard
          value={(set.stats[Stat.TwoPointAttempts] / divisor).toFixed(1)}
          label="2PA/Run"
        />
        <StatCard
          value={formatPercentage(
            set.stats[Stat.TwoPointMakes],
            set.stats[Stat.TwoPointAttempts],
          )}
          label="2P%"
        />
        <StatCard
          value={(set.stats[Stat.ThreePointMakes] / divisor).toFixed(1)}
          label="3PM/Run"
        />
        <StatCard
          value={(set.stats[Stat.ThreePointAttempts] / divisor).toFixed(1)}
          label="3PA/Run"
        />
        <StatCard
          value={formatPercentage(
            set.stats[Stat.ThreePointMakes],
            set.stats[Stat.ThreePointAttempts],
          )}
          label="3P%"
        />
        <StatCard
          value={(set.stats[Stat.FreeThrowsMade] / divisor).toFixed(1)}
          label="FTM/Run"
        />
        <StatCard
          value={(set.stats[Stat.FreeThrowsAttempted] / divisor).toFixed(1)}
          label="FTA/Run"
        />
        <StatCard
          value={formatPercentage(
            set.stats[Stat.FreeThrowsMade],
            set.stats[Stat.FreeThrowsAttempted],
          )}
          label="FT%"
        />
        <StatCard
          value={(set.stats[Stat.OffensiveRebounds] / divisor).toFixed(1)}
          label="Off Reb/Run"
        />
        <StatCard
          value={(set.stats[Stat.DefensiveRebounds] / divisor).toFixed(1)}
          label="Def Reb/Run"
        />
        <StatCard
          value={(set.stats[Stat.FoulsCommitted] / divisor).toFixed(1)}
          label="Fouls/Run"
        />
      </>
    );
  };

  const handleTeamPress = () => {
    if (team) {
      router.push(`/(tabs)/${team.id}`);
    }
  };

  const getEfficiencyRating = () => {
    const divisor = set.runCount || 1;
    const pointsPerRun = set.stats[Stat.Points] / divisor;
    const assistsPerRun = set.stats[Stat.Assists] / divisor;
    const reboundsPerRun =
      (set.stats[Stat.OffensiveRebounds] + set.stats[Stat.DefensiveRebounds]) /
      divisor;
    const turnoversPerRun = set.stats[Stat.Turnovers] / divisor;

    // Simple efficiency formula: (Points + Assists + Rebounds - Turnovers) per run
    return (
      (pointsPerRun + assistsPerRun + reboundsPerRun - turnoversPerRun) *
      10
    ).toFixed(1);
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={[styles.centered, styles.topBanner]}>
        <IconAvatar size={60} icon="📊" />
        <View style={styles.runsBadge}>
          <Text style={styles.runsText}>
            {set.runCount} {set.runCount === 1 ? "Run" : "Runs"}
          </Text>
        </View>
      </View>

      <View style={styles.padding}>
        {/* Set Stats */}
        <View style={styles.section}>
          <View style={styles.statsHeader}>
            <Text style={styles.sectionTitle}>Set Performance</Text>
            <TouchableOpacity style={styles.expandBtn} onPress={toggleExpanded}>
              <Text style={styles.expandText}>
                {isExpanded ? "Less" : "More"}
              </Text>
              <Text style={styles.expandArrow}>{isExpanded ? "▲" : "▼"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsGrid}>
            {getMainStats()}
            {isExpanded && getExpandedStats()}
          </View>
        </View>

        {/* Efficiency Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Efficiency</Text>
          <View style={styles.efficiencyCard}>
            <Text style={styles.efficiencyScore}>{getEfficiencyRating()}</Text>
            <Text style={styles.efficiencyLabel}>Efficiency Rating</Text>
            <Text style={styles.efficiencyDescription}>
              Based on points, assists, rebounds, and turnovers per run
            </Text>
          </View>
        </View>

        {/* Team Information */}
        {team && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Team</Text>
            <TouchableOpacity style={styles.teamCard} onPress={handleTeamPress}>
              <View style={styles.teamInfo}>
                <View style={styles.teamAvatar}>
                  <BaskitballImage size={50} imageUri={team.imageUri} />
                </View>
                <View style={styles.teamDetails}>
                  <Text style={styles.teamName}>{team.name}</Text>
                  <Text style={styles.teamRecord}>
                    {team.gameNumbers.wins}-{team.gameNumbers.losses}-
                    {team.gameNumbers.draws} Record
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Navigation */}
        <View style={styles.section}>
          <ViewAllButton
            text="View All Sets"
            onPress={() => router.navigate("/sets")}
          />
        </View>

        {/* Bottom spacing */}
        <View style={{ marginBottom: 100 }} />
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
  runsBadge: {
    backgroundColor: theme.colorGrey,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  runsText: {
    color: theme.colorWhite,
    fontSize: 14,
    fontWeight: "600",
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
  efficiencyCard: {
    backgroundColor: theme.colorLightGrey,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colorLightGrey,
  },
  efficiencyScore: {
    fontSize: 48,
    fontWeight: "800",
    color: theme.colorOrangePeel,
    marginBottom: 8,
  },
  efficiencyLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colorOnyx,
    marginBottom: 8,
  },
  efficiencyDescription: {
    fontSize: 12,
    color: theme.colorGrey,
    textAlign: "center",
    lineHeight: 16,
  },
  teamCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: theme.colorWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colorLightGrey,
  },
  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  teamAvatar: {
    width: 50,
    height: 50,
    backgroundColor: theme.colorOrangePeel,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  teamDetails: {
    flex: 1,
  },
  teamName: {
    fontWeight: "600",
    fontSize: 16,
    color: theme.colorOnyx,
    marginBottom: 2,
  },
  teamRecord: {
    fontSize: 12,
    color: theme.colorGrey,
    fontWeight: "500",
  },
});
