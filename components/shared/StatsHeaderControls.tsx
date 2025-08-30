import { theme } from "@/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type StatsHeaderControlsProps = {
  title: string;
  showToggle?: boolean;
  toggleOptions?: {
    leftLabel: string;
    rightLabel: string;
    currentMode: string | number;
    leftValue: string | number;
    rightValue: string | number;
    onToggle: (value: string | number) => void;
  };
  showExpand?: boolean;
  isExpanded?: boolean;
  onExpandToggle?: () => void;
};

export function StatsHeaderControls({
  title,
  showToggle = false,
  toggleOptions,
  showExpand = false,
  isExpanded = false,
  onExpandToggle,
}: StatsHeaderControlsProps) {
  return (
    <View style={styles.statsHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.headerControls}>
        {showToggle && toggleOptions && (
          <View style={styles.statsToggle}>
            <TouchableOpacity
              style={[
                styles.toggleOption,
                toggleOptions.currentMode === toggleOptions.leftValue && styles.activeToggle,
              ]}
              onPress={() => toggleOptions.onToggle(toggleOptions.leftValue)}
            >
              <Text
                style={[
                  styles.toggleText,
                  toggleOptions.currentMode === toggleOptions.leftValue && styles.activeToggleText,
                ]}
              >
                {toggleOptions.leftLabel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleOption,
                toggleOptions.currentMode === toggleOptions.rightValue && styles.activeToggle,
              ]}
              onPress={() => toggleOptions.onToggle(toggleOptions.rightValue)}
            >
              <Text
                style={[
                  styles.toggleText,
                  toggleOptions.currentMode === toggleOptions.rightValue && styles.activeToggleText,
                ]}
              >
                {toggleOptions.rightLabel}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {showExpand && onExpandToggle && (
          <TouchableOpacity style={styles.expandBtn} onPress={onExpandToggle}>
            <Text style={styles.expandText}>{isExpanded ? "Less" : "More"}</Text>
            <Text style={styles.expandArrow}>{isExpanded ? "▲" : "▼"}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colorOnyx,
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
});
