import { theme } from "@/theme";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

type RadioButtonProps = {
  title: string;
  selected: boolean;
  onPress: () => void;
  reset?: boolean;
};

export const SetRadioButton = ({ title, selected, onPress, reset }: RadioButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.radioButton,
        {
          backgroundColor: reset ? theme.colorOnyx : selected ? theme.colorBlue : theme.colorWhite,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.radioButtonText,
          { color: selected || reset ? theme.colorWhite : theme.colorBlack },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colorBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    maxWidth: 120,
    minHeight: 50,
    maxHeight: 50,
  },
  radioButtonText: {
    fontSize: 14,
  },
});
