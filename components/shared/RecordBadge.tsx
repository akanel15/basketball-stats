import { theme } from "@/theme";
import { StyleSheet, Text, View } from "react-native";

type RecordBadgeProps = {
  wins: number;
  losses: number;
  draws: number;
  label?: string;
};

export function RecordBadge({
  wins,
  losses,
  draws,
  label = "Record",
}: RecordBadgeProps) {
  return (
    <View style={styles.recordBadge}>
      <Text style={styles.recordText}>
        {wins}-{losses}-{draws} {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  recordBadge: {
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
});
