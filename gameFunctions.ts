import { Stat } from "./types/stats";

export type StatUpdateType = {
  stat: Stat;
  gameId: string;
  teamId: string;
  playerId: string;
  setId: string;
};

export function handleStatUpdate(input: StatUpdateType) {
  const a = input.gameId;
}
