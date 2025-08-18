import { theme } from "@/theme";
import { StyleSheet, Text, View } from "react-native";
import { BaskitballImage } from "../BaskitballImage";

type IconAvatarProps = {
  size?: number;
  icon?: string; // For emoji/text icons like "📋"
  number?: number; // For player numbers
  imageUri?: string; // For custom images
  showBorder?: boolean; // Whether to show orange border
};

export function IconAvatar({
  size = 80,
  icon,
  number,
  imageUri,
  showBorder = true,
}: IconAvatarProps) {
  const fontSize = size * 0.52; // Scale font size proportionally

  // If there's a custom image, use BaskitballImage
  if (imageUri) {
    return <BaskitballImage size={size} imageUri={imageUri} />;
  }

  // Otherwise show icon/number with consistent styling
  return (
    <View
      style={[
        styles.borderContainer,
        { width: size, height: size },
        !showBorder && { backgroundColor: "transparent" },
      ]}
    >
      <View
        style={[
          styles.contentContainer,
          {
            width: showBorder ? size - 6 : size,
            height: showBorder ? size - 6 : size,
          },
        ]}
      >
        <Text style={[styles.contentText, { fontSize }]}>
          {icon || number || "?"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  borderContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorOrangePeel,
    borderRadius: 50,
  },
  contentContainer: {
    backgroundColor: theme.colorOnyx,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  contentText: {
    fontWeight: "bold",
    color: theme.colorWhite,
  },
});
