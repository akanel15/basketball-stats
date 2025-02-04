import { Text, TouchableOpacity, StyleSheet } from "react-native";

type RadioButtonProps = {
  title: string;
  selected: boolean;
  onPress: () => void;
};

export const SetRadioButton = ({
  title,
  selected,
  onPress,
}: RadioButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.radioButton,
        { backgroundColor: selected ? "#007BFF" : "#FFF" },
      ]}
      onPress={onPress}
    >
      <Text
        style={[styles.radioButtonText, { color: selected ? "#FFF" : "#000" }]}
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
    borderColor: "#007BFF",
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
