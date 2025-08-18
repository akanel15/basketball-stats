import { BaskitballButton } from "@/components/BaskitballButton";
import { SetCard } from "@/components/SetCard";
import { StatCard } from "@/components/shared/StatCard";
import { TopSetCard } from "@/components/shared/TopSetCard";
import { EmptyStateText } from "@/components/shared/EmptyStateText";
import { useSetStore } from "@/store/setStore";
import { useTeamStore } from "@/store/teamStore";
import { theme } from "@/theme";
import { router } from "expo-router";
import { Stat } from "@/types/stats";
import { View, Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const calculatePerRunStat = (statValue: number, runCount: number): number => {
  return runCount > 0 ? statValue / runCount : 0;
};

const formatPerRun = (value: number): string => {
  return value.toFixed(1);
};

export default function Sets() {
  const sets = useSetStore((state) => state.sets);
  const setList = Object.values(sets);
  const currentTeamId = useTeamStore((state) => state.currentTeamId);
  const teamSets = setList.filter((set) => set.teamId === currentTeamId);

  // Calculate overview statistics
  const totalSets = teamSets.length;
  const totalRuns = teamSets.reduce((sum, set) => sum + set.runCount, 0);
  const totalPoints = teamSets.reduce(
    (sum, set) => sum + set.stats[Stat.Points],
    0,
  );
  const avgPointsPerRun = totalRuns > 0 ? totalPoints / totalRuns : 0;

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

  if (totalSets === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <EmptyStateText message="No sets created yet.\nCreate your first set to start tracking performance!" />
          <BaskitballButton
            title="Add your first Set"
            onPress={() => router.navigate("/sets/newSet")}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.padding}>
        {/* Sets Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sets Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard value={totalSets.toString()} label="Total Sets" />
            <StatCard value={totalRuns.toString()} label="Total Runs" />
            <StatCard
              value={formatPerRun(avgPointsPerRun)}
              label="Avg Pts/Run"
            />
          </View>
        </View>

        {/* Top Performing Sets */}
        {teamSets.length > 0 && (
          <View style={styles.section}>
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
          </View>
        )}

        {/* All Sets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Sets</Text>
          <View style={styles.setsList}>
            {teamSets.map((set) => (
              <SetCard key={set.id} set={set} />
            ))}
          </View>
          <BaskitballButton
            title="Add New Set"
            onPress={() => router.navigate("/sets/newSet")}
          />
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  padding: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colorOnyx,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
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
  setsList: {
    marginBottom: 16,
  },
});
