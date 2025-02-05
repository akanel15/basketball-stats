import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";
import { createTeam, TeamType } from "@/types/team";

type TeamState = {
  teams: Record<string, TeamType>;
  currentTeamId: string;
  addTeam: (name: string, imageUri?: string) => Promise<void>;
  removeTeam: (teamId: string) => void;
  setCurrentTeamId: (teamId: string) => void;
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
      // addPlayerToTeam: (teamId: string, playerId: string) => {
      //   return set((state) => {
      //     return {
      //       ...state,
      //       teams: state.teams.map((team) =>
      //         team.id === teamId
      //           ? {
      //               ...team,
      //               playerIdList: [...(team.playerIdList || []), playerId],
      //             }
      //           : team,
      //       ),
      //     };
      //   });
      // },
      setCurrentTeamId: (teamId: string) => {
        return set((state) => ({
          ...state,
          currentTeamId: teamId,
        }));
      },
    }),
    {
      name: "baskItball-team-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
