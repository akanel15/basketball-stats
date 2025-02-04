import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import uuid from "react-native-uuid";
import { GameType, Team, createGame } from "@/types/game";
import { initialBaseStats, Stat, StatsType } from "@/types/stats";

type GameState = {
  games: Record<string, GameType>;
  addGame: (teamId: string, opposingTeamName: string) => void;
  removeGame: (gameId: string) => void;
  updateBoxScore: (
    gameId: string,
    playerId: string,
    stat: Stat,
    amount: number,
  ) => void;
  updateTotals: (
    gameId: string,
    stat: Stat,
    amount: number,
    team: Team,
  ) => void;
  // handleStatUpdate: (
  //   gameId: string,
  //   playerId: string,
  //   statType: Stat,
  //   amount: number,
  // ) => void;
};

export const useGameStore = create(
  persist<GameState>(
    (set, get) => ({
      games: {},
      addGame: (teamId: string, opposingTeamName: string) => {
        const id = uuid.v4();
        set((state) => ({
          games: {
            ...state.games,
            [id]: createGame(id, teamId, opposingTeamName),
          },
        }));
      },

      removeGame: (gameId: string) => {
        set((state) => {
          if (!state.games[gameId]) {
            console.warn(`Game with ID ${gameId} not found. Cannot remove.`);
            return state;
          }
          const newGames = { ...state.games };
          delete newGames[gameId];
          return { games: newGames };
        });
      },

      //USED TO UPDATE AN INDIVIDUAL STAT FOR OUR TEAM IN THE BOX SCORE AND STAT TOTALS VALUES
      updateBoxScore: (
        gameId: string,
        playerId: string,
        stat: Stat,
        amount: number,
      ) => {
        set((state) => {
          const game = state.games[gameId];
          if (!game) {
            console.warn(`Game with ID ${gameId} not found.`);
            return state;
          }

          // Ensure player has a stats entry
          const playerBoxScore: StatsType = game.boxScore[playerId]
            ? { ...game.boxScore[playerId] }
            : { ...initialBaseStats };

          // Update the player's specific stat
          playerBoxScore[stat] = (playerBoxScore[stat] || 0) + amount;

          return {
            games: {
              ...state.games,
              [gameId]: {
                ...game,
                boxScore: {
                  ...game.boxScore,
                  [playerId]: playerBoxScore,
                },
              },
            },
          };
        });
      },
      updateTotals: (
        gameId: string,
        stat: Stat,
        amount: number,
        team: Team,
      ) => {
        set((state) => {
          const game = state.games[gameId];
          if (!game) {
            console.warn(`Game with ID ${gameId} not found.`);
            return state;
          }

          // Update the team's stat totals
          const newStatTotals = { ...game.statTotals };

          newStatTotals[team][stat] = (newStatTotals[team][stat] || 0) + amount;

          return {
            games: {
              ...state.games,
              [gameId]: {
                ...game,
                statTotals: newStatTotals,
              },
            },
          };
        });
      },
      // handleStatUpdate: (
      //   gameId: string,
      //   playerId: string,
      //   statType: Stat,
      //   amount: number,
      // ) => {
      //   set((state) => {
      //     const game = state.games[gameId];
      //     if (!game) {
      //       console.warn(`Game with ID ${gameId} not found.`);
      //       return state;
      //     }

      //     // Update the player's box score for points
      //     get().updateBoxScore(gameId, playerId, statType, amount);

      //     // Update the team's total points
      //     get().updateTotals(gameId, statType, amount, Team.Us);

      //     return state;
      //   });
      // },
    }),
    {
      name: "baskItball-game-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
