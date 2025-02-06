import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import uuid from "react-native-uuid";
import { GameType, Team, createGame } from "@/types/game";
import { initialBaseStats, Stat, StatsType } from "@/types/stats";

type GameState = {
  games: Record<string, GameType>;
  addGame: (teamId: string, opposingTeamName: string) => string;
  removeGame: (gameId: string) => void;
  setActivePlayers: (gameId: string, newActivePlayers: string[]) => void;
  setActiveSets: (gameId: string, newActiveSets: string[]) => void;

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
  updatePeriods: (
    gameId: string,
    playerId: string,
    stat: Stat,
    period: number,
    team: Team,
  ) => void;
};

export const useGameStore = create(
  persist<GameState>(
    (set, get) => ({
      games: {},
      addGame: (teamId: string, opposingTeamName: string) => {
        const id = uuid.v4();
        set((state) => ({
          games: {
            [id]: createGame(id, teamId, opposingTeamName),
            ...state.games,
          },
        }));
        return id;
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
      setActivePlayers: (gameId, newActivePlayers) => {
        set((state) => {
          if (!state.games[gameId]) {
            console.warn(
              `Game with ID ${gameId} not found. Cannot update active players.`,
            );
            return state;
          }
          return {
            games: {
              ...state.games,
              [gameId]: {
                ...state.games[gameId],
                activePlayers: newActivePlayers,
              },
            },
          };
        });
      },
      setActiveSets: (gameId, newActiveSets) => {
        set((state) => {
          if (!state.games[gameId]) {
            console.warn(
              `Game with ID ${gameId} not found. Cannot update active sets.`,
            );
            return state;
          }
          return {
            games: {
              ...state.games,
              [gameId]: {
                ...state.games[gameId],
                activeSets: newActiveSets,
              },
            },
          };
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
      updatePeriods: (
        gameId: string,
        playerId: string,
        stat: Stat,
        period: number,
        team: Team,
      ) => {
        set((state) => {
          const game = state.games[gameId];
          if (!game) return state; // Game not found, return state as is

          // Clone the periods array so we don't mutate state directly
          const updatedPeriods = [...game.periods];

          // Ensure the period index exists
          if (!updatedPeriods[period]) {
            updatedPeriods[period] = {
              us: 0,
              opponent: 0,
              playByPlay: [],
            };
          }
          let scoreIncrease = 0;
          if (stat === Stat.TwoPointMakes) scoreIncrease = 2;
          if (stat === Stat.ThreePointMakes) scoreIncrease = 3;
          if (stat === Stat.FreeThrowsMade) scoreIncrease = 1;

          if (team === Team.Us) {
            updatedPeriods[period].us += scoreIncrease;
          } else {
            updatedPeriods[period].opponent += scoreIncrease;
          }

          // Add new play-by-play event
          updatedPeriods[period].playByPlay.push({
            playerId,
            action: stat,
          });

          return {
            ...state,
            games: {
              ...state.games,
              [gameId]: {
                ...game,
                periods: updatedPeriods,
              },
            },
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
