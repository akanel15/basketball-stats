import { StyleSheet, View, Text, Pressable } from "react-native";
import { theme } from "@/theme";
import { Link } from "expo-router";
import { Stat } from "@/types/stats";
import { SetType } from "@/types/set";

// Helper functions for calculating statistics
const calculatePerRunStat = (statValue: number, runCount: number): number => {
  return runCount > 0 ? statValue / runCount : 0;
};

const calculatePercentage = (made: number, attempted: number): number => {
  return attempted > 0 ? (made / attempted) * 100 : 0;
};

const formatPercentage = (percentage: number): string => {
  return percentage.toFixed(0);
};

const formatPerRun = (value: number): string => {
  return value.toFixed(1);
};

export function SetCard({ set }: { set: SetType }) {
  // Calculate key statistics
  const pointsPerRun = calculatePerRunStat(
    set.stats[Stat.Points],
    set.runCount,
  );
  const assistsPerRun = calculatePerRunStat(
    set.stats[Stat.Assists],
    set.runCount,
  );
  const totalRebounds =
    set.stats[Stat.OffensiveRebounds] + set.stats[Stat.DefensiveRebounds];
  const reboundsPerRun = calculatePerRunStat(totalRebounds, set.runCount);

  // Calculate shooting percentages
  const twoPointPercentage = calculatePercentage(
    set.stats[Stat.TwoPointMakes],
    set.stats[Stat.TwoPointAttempts],
  );
  const threePointPercentage = calculatePercentage(
    set.stats[Stat.ThreePointMakes],
    set.stats[Stat.ThreePointAttempts],
  );

  return (
    <Link href={`/sets/${set.id}`} asChild>
      <Pressable style={styles.setCard}>
        <View style={styles.leftSection}>
          <Text numberOfLines={1} style={styles.setName}>
            {set.name}
          </Text>
          <Text style={styles.usageText}>
            {set.runCount} runs • {formatPerRun(reboundsPerRun)} reb/run
          </Text>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.primaryStat}>
            {formatPerRun(pointsPerRun)} pts/run
          </Text>
          <Text style={styles.secondaryStat}>
            {formatPerRun(assistsPerRun)} ast/run
          </Text>
          <Text style={styles.secondaryStat}>
            {formatPercentage(twoPointPercentage)}% 2PT •{" "}
            {formatPercentage(threePointPercentage)}% 3PT
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  setCard: {
    flexDirection: "row",
    shadowColor: theme.colorOnyx,
    backgroundColor: theme.colorWhite,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flex: 1,
    justifyContent: "center",
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  setName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: theme.colorOnyx,
  },
  usageText: {
    fontSize: 14,
    color: theme.colorGrey,
  },
  primaryStat: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colorOrangePeel,
    marginBottom: 2,
  },
  secondaryStat: {
    fontSize: 12,
    color: theme.colorGrey,
    marginBottom: 1,
    textAlign: "right",
  },
});
