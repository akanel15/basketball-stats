import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import uuid from "react-native-uuid";

export type GameType = {
  id: string;
  teamId: string;
  opposingTeamName: string;
  score: { us: number; opponent: number };
  playByPlay?: string;
  //... other stats maybe stat dictionaty
};

type GameState = {
  games: GameType[];
  addGame: (teamId: string, opposingTeamName: string, playsOn: boolean) => void;
  removeGame: (teamId: string) => void;
};

export const useGameStore = create(
  persist<GameState>(
    (set) => ({
      games: [],
      addGame: async (
        teamId: string,
        opposingTeamName: string,
        playsOn: boolean,
      ) => {
        return set((state) => {
          return {
            ...state,
            games: [
              {
                id: uuid.v4(),
                teamId,
                opposingTeamName,
                score: { us: 0, opponent: 0 },
              },
              ...state.games,
            ],
          };
        });
      },
      removeGame: (gameId: string) => {
        return set((state) => {
          return {
            ...state,
            games: state.games.filter((game) => game.id !== gameId),
          };
        });
      },
    }),
    {
      name: "baskItball-game-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
