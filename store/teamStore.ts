import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";
import { createTeam, TeamType } from "@/types/team";
import { Result } from "@/types/player";
import { Stat } from "@/types/stats";
import { Team } from "@/types/game";

type TeamState = {
  teams: Record<string, TeamType>;
  currentTeamId: string;
  addTeam: (name: string, imageUri?: string) => Promise<void>;
  removeTeam: (teamId: string) => void;
  setCurrentTeamId: (teamId: string) => void;
  updateGamesPlayed: (teamId: string, result: Result) => void;
  updateStats: (teamId: string, stat: Stat, amount: number, team: Team) => void;
};

export const useTeamStore = create(
  persist<TeamState>(
    (set) => ({
      teams: {},
      currentTeamId: "",
      addTeam: async (name: string, imageUri?: string) => {
        const savedImageUri =
          FileSystem.documentDirectory +
          `${new Date().getTime()}-${imageUri?.split("/").slice(-1)[0]}`;

        if (imageUri) {
          await FileSystem.copyAsync({
            from: imageUri,
            to: savedImageUri,
          });
        }
        const id = uuid.v4();

        return set((state) => ({
          teams: {
            [id]: createTeam(id, name, imageUri ? savedImageUri : undefined),
            ...state.teams,
          },
        }));
      },
      removeTeam: (teamId: string) => {
        return set((state) => {
          if (!state.teams[teamId]) {
            console.warn(`Team with ID ${teamId} not found. Cannot remove.`);
            return state;
          }
          const newTeams = { ...state.teams };
          delete newTeams[teamId];
          return { teams: newTeams };
        });
      },
      setCurrentTeamId: (teamId: string) => {
        return set((state) => ({
          ...state,
          currentTeamId: teamId,
        }));
      },
      updateGamesPlayed: (teamId: string, result: Result) => {
        set((state) => {
          const team = state.teams[teamId];
          if (!team) {
            console.warn(`Team with ID ${teamId} not found.`);
            return state;
          }
          return {
            teams: {
              ...state.teams,
              [teamId]: {
                ...team,
                gameNumbers: {
                  ...team.gameNumbers,
                  [result]: (team.gameNumbers?.[result] || 0) + 1,
                  gamesPlayed: (team.gameNumbers.gamesPlayed || 0) + 1,
                },
              },
            },
          };
        });
      },
      updateStats(teamId: string, stat: Stat, amount: number, team: Team) {
        set((state) => {
          const selectedTeam = state.teams[teamId];
          if (!selectedTeam) {
            console.warn(`Team with ID ${teamId} not found.`);
            return state;
          }
          return {
            teams: {
              ...state.teams,
              [teamId]: {
                ...selectedTeam,
                stats: {
                  ...selectedTeam.stats,
                  [team]: {
                    ...selectedTeam.stats[team],
                    [stat]: (selectedTeam.stats[team][stat] || 0) + amount,
                  },
                },
              },
            },
          };
        });
      },
    }),
    {
      name: "baskItball-team-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
