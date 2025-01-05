import { Image, useWindowDimensions } from "react-native";
type Props = {
  size?: number;
  imageUri?: string;
};

export function BaskitballImage({ size, imageUri }: Props) {
  const { width } = useWindowDimensions();
  const imageSize = size || Math.min(width / 1.2, 400);

  return (
    <Image
      source={imageUri ? { uri: imageUri } : require("@/assets/baskitball.png")}
      style={{ width: imageSize, height: imageSize, borderRadius: 6 }}
    />
  );
}
