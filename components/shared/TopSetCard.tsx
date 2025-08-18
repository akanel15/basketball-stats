import { theme } from "@/theme";
import { SetType } from "@/types/set";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native";

type TopSetCardProps = {
  set: SetType;
  primaryStat: { label: string; value: string };
  secondaryStat: { label: string; value: string };
};

export function TopSetCard({
  set,
  primaryStat,
  secondaryStat,
}: TopSetCardProps) {
  return (
    <View style={styles.setItem}>
      <View style={styles.setInfo}>
        <View style={styles.setIcon}>
          <Text style={styles.setInitial}>
            {set.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={styles.setName}>{set.name}</Text>
        </View>
      </View>
      <View style={styles.setStats}>
        <Text style={styles.primaryStat}>
          {primaryStat.value} {primaryStat.label}
        </Text>
        <Text style={styles.secondaryStat}>
          {secondaryStat.value} {secondaryStat.label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  setItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorLightGrey,
  },
  setInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  setIcon: {
    width: 40,
    height: 40,
    backgroundColor: theme.colorOrangePeel,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  setInitial: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colorWhite,
  },
  setName: {
    fontWeight: "600",
    fontSize: 16,
    color: theme.colorOnyx,
    flexShrink: 1,
  },
  setStats: {
    alignItems: "flex-end",
  },
  primaryStat: {
    fontWeight: "700",
    fontSize: 16,
    color: theme.colorOrangePeel,
  },
  secondaryStat: {
    fontSize: 12,
    color: theme.colorGrey,
  },
});
