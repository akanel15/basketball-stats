import { theme } from "@/theme";
import { StyleSheet, Text, View } from "react-native";

type StatCardProps = {
  value: string;
  label: string;
};

export function StatCard({ value, label }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    backgroundColor: theme.colorLightGrey,
    padding: 15, // Reduced from 20
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colorLightGrey,
    width: "31%", // Changed from 47% to fit 3 per row
  },
  statValue: {
    fontSize: 24, // Reduced from 28
    fontWeight: "800",
    color: theme.colorOrangePeel,
    marginBottom: 3, // Reduced from 5
  },
  statLabel: {
    fontSize: 13, // Reduced from 14
    color: theme.colorGrey,
    fontWeight: "500",
    textAlign: "center",
  },
});
