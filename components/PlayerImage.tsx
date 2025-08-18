import { PlayerType } from "@/types/player";
import { IconAvatar } from "./shared/IconAvatar";

type Props = {
  player?: PlayerType;
  size?: number;
};

export function PlayerImage({ player, size = 80 }: Props) {
  return (
    <IconAvatar
      size={size}
      imageUri={player?.imageUri}
      number={player?.number || 0}
    />
  );
}
