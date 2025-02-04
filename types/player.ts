import { initialBaseStats, StatsType } from "./stats";

export type GameNumbersType = {
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
};

export type PlayerType = {
  id: string;
  name: string;
  number: number;
  teamId: string;
  imageUri?: string;
  gameNumbers: GameNumbersType;
  stats: StatsType;
};

export const initialGameNumbers: GameNumbersType = {
  wins: 0,
  losses: 0,
  draws: 0,
  gamesPlayed: 0,
};

export const createPlayer = (
  id: string,
  name: string,
  number: number,
  teamId: string,
  imageUri?: string,
): PlayerType => ({
  id: id,
  name: name,
  number: number,
  teamId: teamId,
  imageUri: imageUri,
  gameNumbers: initialGameNumbers,
  stats: initialBaseStats,
});
