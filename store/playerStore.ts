import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";
import { createPlayer, PlayerType } from "@/types/player";

type PlayerState = {
  players: Record<string, PlayerType>;
  addPlayer: (
    name: string,
    number: number,
    teamId: string,
    imageUri?: string,
  ) => Promise<void>;
  removePlayer: (playerId: string) => void;
  //?updateGamesPlayed: (playerId: string)
  //updateStats: (playerId: string, stat: Stat, amount: number)
};

export const usePlayerStore = create(
  persist<PlayerState>(
    (set, get) => ({
      players: {},
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
        const id = uuid.v4();

        return set((state) => ({
          players: {
            [id]: createPlayer(
              id,
              name,
              number,
              teamId,
              imageUri ? savedImageUri : undefined,
            ),
            ...state.players,
          },
        }));
      },
      removePlayer: (playerId: string) => {
        return set((state) => {
          if (!state.players[playerId]) {
            console.warn(
              `Player with ID ${playerId} not found. Cannot remove.`,
            );
            return state;
          }
          const newPlayers = { ...state.players };
          delete newPlayers[playerId];
          return { players: newPlayers };
        });
      },
    }),
    {
      name: "baskItball-player-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
