import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";

export type PlayerType = {
  id: string;
  name: string;
  number: number;
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
  nextId: number;
  players: PlayerType[];
  addPlayer: (name: string, number: number, imageUri?: string) => Promise<void>;
  removePlayer: (playerId: string) => void;
};

export const usePlatyerStore = create(
  persist<PlayerState>(
    (set) => ({
      players: [],
      nextId: 1,
      addPlayer: async (name: string, number: number, imageUri?: string) => {
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
            players: [
              {
                id: uuid.v4(),
                name,
                number,
                playerList: [],
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
