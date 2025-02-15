import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import uuid from "react-native-uuid";
import { GameType, PeriodType, Team, createGame } from "@/types/game";
import { initialBaseStats, Stat, StatsType } from "@/types/stats";

type GameState = {
  games: Record<string, GameType>;
  addGame: (
    teamId: string,
    opposingTeamName: string,
    periodType: PeriodType,
  ) => string;
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
  updateSetStats: (
    gameId: string,
    setId: string,
    stat: Stat,
    amount: number,
  ) => void;
  incrementSetRunCount: (gameId: string, setId: string) => void;
  addPlayersToGamePlayedList: (gameId: string, playerIds: string[]) => void;
};

export const useGameStore = create(
  persist<GameState>(
    (set, get) => ({
      games: {},
      addGame: (
        teamId: string,
        opposingTeamName: string,
        periodType: PeriodType,
      ) => {
        const id = uuid.v4();
        set((state) => ({
          games: {
            [id]: createGame(id, teamId, opposingTeamName, periodType),
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
              [Team.Us]: 0,
              [Team.Opponent]: 0,
              playByPlay: [],
            };
          }
          let scoreIncrease = 0;
          if (stat === Stat.TwoPointMakes) scoreIncrease = 2;
          if (stat === Stat.ThreePointMakes) scoreIncrease = 3;
          if (stat === Stat.FreeThrowsMade) scoreIncrease = 1;

          updatedPeriods[period] = {
            ...updatedPeriods[period],
            [team]: (updatedPeriods[period]?.[team] ?? 0) + scoreIncrease,
          };

          // Add new play-by-play event
          updatedPeriods[period].playByPlay.unshift({
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
      updateSetStats: (
        gameId: string,
        setId: string,
        stat: Stat,
        amount: number,
      ) => {
        set((state) => {
          const game = state.games[gameId];
          if (!game) {
            console.warn(`Game with ID ${gameId} not found.`);
            return state;
          }
          const existingSet = game.sets[setId];
          return {
            games: {
              ...state.games,
              [gameId]: {
                ...game,
                sets: {
                  ...game.sets,
                  [setId]: {
                    ...existingSet,
                    stats: {
                      ...(existingSet?.stats || { ...initialBaseStats }),
                      [stat]: (existingSet?.stats?.[stat] || 0) + amount,
                    },
                  },
                },
              },
            },
          };
        });
      },
      incrementSetRunCount: (gameId: string, setId: string) => {
        set((state) => {
          const game = state.games[gameId];
          if (!game) {
            console.warn(`Game with ID ${gameId} not found.`);
            return state;
          }

          const existingSet = game.sets[setId];

          return {
            games: {
              ...state.games,
              [gameId]: {
                ...game,
                sets: {
                  ...game.sets,
                  [setId]: {
                    ...existingSet, // Spread existing set if it exists
                    runCount: (existingSet?.runCount || 0) + 1, // Initialize to 1 if it doesn't exist
                  },
                },
              },
            },
          };
        });
      },
      addPlayersToGamePlayedList: (gameId: string, playerIds: string[]) => {
        set((state) => {
          const game = state.games[gameId];
          if (!game) {
            console.warn(`Game with ID ${gameId} not found.`);
            return state;
          }

          // Create a new set to prevent duplicates, then convert back to an array
          const updatedGamePlayedList = Array.from(
            new Set([...game.gamePlayedList, ...playerIds]),
          );

          return {
            games: {
              ...state.games,
              [gameId]: {
                ...game,
                gamePlayedList: updatedGamePlayedList,
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
