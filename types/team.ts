import { Team } from "./game";
import { GameNumbersType, initialGameNumbers } from "./player";
import { initialBaseStats, StatsType } from "./stats";

export type TeamType = {
  id: string;
  name: string;
  imageUri?: string;
  gameNumbers: GameNumbersType;
  stats: { [Team.Us]: StatsType; [Team.Opponent]: StatsType }; //for quick access to all game stat totals for both teams
};

export const createTeam = (id: string, name: string, imageUri?: string): TeamType => ({
  id: id,
  name: name,
  imageUri: imageUri,
  gameNumbers: initialGameNumbers,
  stats: {
    [Team.Us]: { ...initialBaseStats },
    [Team.Opponent]: { ...initialBaseStats },
  },
});
