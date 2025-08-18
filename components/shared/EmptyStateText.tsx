import { theme } from "@/theme";
import { StyleSheet, Text } from "react-native";

type EmptyStateTextProps = {
  message: string;
};

export function EmptyStateText({ message }: EmptyStateTextProps) {
  return <Text style={styles.emptyText}>{message}</Text>;
}

const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    color: theme.colorGrey,
    fontSize: 16,
    fontStyle: "italic",
    padding: 20,
  },
});
