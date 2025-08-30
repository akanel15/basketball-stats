import { initialBaseStats, StatsType } from "./stats";

export type SetType = {
  id: string;
  name: string;
  teamId: string;
  runCount: number;
  stats: StatsType;
};

export const createSet = (id: string, name: string, teamId: string): SetType => ({
  id: id,
  name: name,
  teamId: teamId,
  runCount: 0,
  stats: { ...initialBaseStats }, // Create a copy
});
