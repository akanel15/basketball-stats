import { GameNumbersType, initialGameNumbers } from "./player";
import { initialBaseStats, StatsType } from "./stats";

export type TeamType = {
  id: string;
  name: string;
  imageUri?: string;
  gameNumbers: GameNumbersType;
  stats: StatsType;
  opponentStats: StatsType;
};

export const createTeam = (
  id: string,
  name: string,
  imageUri?: string,
): TeamType => ({
  id: id,
  name: name,
  imageUri: imageUri,
  gameNumbers: initialGameNumbers,
  stats: initialBaseStats,
  opponentStats: initialBaseStats,
});
