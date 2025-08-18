import { theme } from "@/theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type ViewAllButtonProps = {
  text: string;
  onPress: () => void;
};

export function ViewAllButton({ text, onPress }: ViewAllButtonProps) {
  return (
    <TouchableOpacity style={styles.viewAllBtn} onPress={onPress}>
      <Text style={styles.viewAllBtnText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
