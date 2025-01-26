import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";

export type TeamType = {
  id: string;
  name: string;
  playerIdList: string[];
  imageUri?: string;
};

type TeamState = {
  teams: TeamType[];
  addTeam: (name: string, imageUri?: string) => Promise<void>;
  removeTeam: (teamId: string) => void;
};

export const useTeamStore = create(
  persist<TeamState>(
    (set) => ({
      teams: [],
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
            teams: [
              {
                id: uuid.v4(),
                name,
                playerIdList: [],
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
