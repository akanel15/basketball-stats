import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";

export type PlayerType = {
  id: string;
  name: string;
  number: number;
  teamId: string;
  statistics?: StatsType;
  //... other stats maybe stat dictionaty
  imageUri?: string;
};

export type StatsType = {
  gamesPlayer: number;
  points: number;
  twoPointMakes: number;
  twoPointAttempts: number;
  //...
};

type PlayerState = {
  players: PlayerType[];
  addPlayer: (
    name: string,
    number: number,
    teamId: string,
    imageUri?: string,
  ) => Promise<void>;
  removePlayer: (playerId: string) => void;
};

export const usePlayerStore = create(
  persist<PlayerState>(
    (set) => ({
      players: [],
      addPlayer: async (
        name: string,
        number: number,
        teamId: string,
        imageUri?: string,
      ) => {
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
            players: [
              {
                id: uuid.v4(),
                name,
                number,
                teamId,
                imageUri: imageUri ? savedImageUri : undefined,
              },
              ...state.players,
            ],
          };
        });
      },
      removePlayer: (playerId: string) => {
        return set((state) => {
          return {
            ...state,
            players: state.players.filter((player) => player.id !== playerId),
          };
        });
      },
    }),
    {
      name: "baskItball-player-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
