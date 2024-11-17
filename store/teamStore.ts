import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as FileSystem from "expo-file-system";

export type TeamType = {
  id: string;
  name: string;
  playerList: string[];
  imageUri?: string;
};

type TeamState = {
  nextId: number;
  teams: TeamType[];
  addTeam: (name: string, imageUri?: string) => Promise<void>;
  removeTeam: (teamId: string) => void;
};

export const useTeamStore = create(
  persist<TeamState>(
    (set) => ({
      teams: [],
      nextId: 1,
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
        return set((state) => {
          return {
            ...state,
            nextId: state.nextId + 1,
            teams: [
              {
                id: String(state.nextId),
                name,
                playerList: [],
                imageUri: imageUri ? savedImageUri : undefined,
              },
              ...state.teams,
            ],
          };
        });
      },
      removeTeam: (teamId: string) => {
        return set((state) => {
          return {
            ...state,
            teams: state.teams.filter((team) => team.id !== teamId),
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
