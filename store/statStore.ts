import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export enum Stat {
  Points,
  Assists,
  DefensiveRebounds,
  OffensiveRebounds,
  Steals,
  Deflections,
  Blocks,
  Turnovers,
  TwoPointMakes,
  TwoPointAttempts,
  ThreePointMakes,
  ThreePointAttempts,
  FreeThrowsMade,
  FreeThrowsAttempted,
  FoulsCommitted,
  FoulsDrawn,
}

type StatsType = {
  [Stat.Points]: number;
  [Stat.Assists]: number;
  [Stat.DefensiveRebounds]: number;
  [Stat.OffensiveRebounds]: number;
  [Stat.Steals]: number;
  [Stat.Deflections]: number;
  [Stat.Blocks]: number;
  [Stat.Turnovers]: number;
  [Stat.TwoPointMakes]: number;
  [Stat.TwoPointAttempts]: number;
  [Stat.ThreePointMakes]: number;
  [Stat.ThreePointAttempts]: number;
  [Stat.FreeThrowsMade]: number;
  [Stat.FreeThrowsAttempted]: number;
  [Stat.FoulsCommitted]: number;
  [Stat.FoulsDrawn]: number;
};

type GameNumbersType = {
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
};

type PlayByPlayType = {
  playerId: string;
  action: string;
};

type BoxScoreType = Record<string, StatsType>; //<playerId, stats>

type GameStatsType = {
  teamId: string;
  totals: StatsType;
  boxScore: BoxScoreType; //opponent can be stored here also in one stats type with key "opponent" or anything else
  playByPlay: PlayByPlayType[];
  isFinished: boolean;
};

type SetStatsType = {
  runCount: number;
  stats: StatsType;
};

type TeamStatsType = {
  gameNumbers: GameNumbersType;
  opponentStats: StatsType;
  stats: StatsType;
};

type PlayerStatsType = {
  gameNumbers: GameNumbersType;
  stats: StatsType;
};

const initialBaseStats: StatsType = {
  [Stat.Points]: 0,
  [Stat.Assists]: 0,
  [Stat.DefensiveRebounds]: 0,
  [Stat.OffensiveRebounds]: 0,
  [Stat.Steals]: 0,
  [Stat.Deflections]: 0,
  [Stat.Blocks]: 0,
  [Stat.Turnovers]: 0,
  [Stat.TwoPointMakes]: 0,
  [Stat.TwoPointAttempts]: 0,
  [Stat.ThreePointMakes]: 0,
  [Stat.ThreePointAttempts]: 0,
  [Stat.FreeThrowsMade]: 0,
  [Stat.FreeThrowsAttempted]: 0,
  [Stat.FoulsCommitted]: 0,
  [Stat.FoulsDrawn]: 0,
};

const initialGameNumbers: GameNumbersType = {
  wins: 0,
  losses: 0,
  draws: 0,
  gamesPlayed: 0,
};

const initialGameStats: GameStatsType = {
  teamId: "",
  totals: initialBaseStats,
  boxScore: {},
  playByPlay: [],
  isFinished: false,
};

const initialPlayerStats: PlayerStatsType = {
  gameNumbers: initialGameNumbers,
  stats: initialBaseStats,
};

const initialTeamStats: TeamStatsType = {
  gameNumbers: initialGameNumbers,
  stats: initialBaseStats,
  opponentStats: initialBaseStats,
};

const initialSetStats: SetStatsType = {
  runCount: 0,
  stats: initialBaseStats,
};

type StatsState = {
  gameStats: Record<string, GameStatsType>;
  playerStats: Record<string, PlayerStatsType>;
  teamStats: Record<string, TeamStatsType>;
  setStats: Record<string, SetStatsType>;

  //Methods
  updateBoxScore: (
    gameId: string,
    playerId: string,
    update: keyof StatsType,
    amount: number,
  ) => void;

  // updateOpponentGameStats: (
  //   gameId: string,
  //   updates: Partial<StatsType>,
  // ) => void;
  // updatePlayerStats: (playerId: string, updates: Partial<StatsType>) => void;
  // updateTeamStats: (teamId: string, updates: Partial<StatsType>) => void;
  // updateSetStats: (setId: string, updates: Partial<StatsType>) => void;
  // addPlayByPlay: (gameId: string, play: PlayByPlayType) => void;

  //mutliAction

  //shooting
  //   statUpdateAction: (
  //     category: Stat, //change to enum
  //     playerId: string,
  //     teamId: string,
  //     gameId: string,
  //     setId?: string,
  //   ) => void;
  //   opponentStatUpdateAction: (
  //     category: string, //change to enum
  //     gameId: string,
  //   ) => void;
};

export const useStatStore = create(
  persist<StatsState>(
    (set) => ({
      gameStats: {}, // Record<string, GameStatsType>
      playerStats: {}, // Record<string, PlayerStatsType>
      teamStats: {}, // Record<string, TeamStatsType>
      setStats: {}, // Record<string, SetStatsType>

      updateBoxScore: (
        gameId: string,
        playerId: string,
        stat: keyof StatsType,
        amount: number,
      ) => {
        set((state) => {
          const game = state.gameStats[gameId] ?? {
            ...initialGameStats,
          };
          const playerStats = game.boxScore[playerId] ?? {
            ...initialBaseStats,
          }; // Use initial stats if missing

          return {
            gameStats: {
              ...state.gameStats,
              [gameId]: {
                ...game,
                boxScore: {
                  ...game.boxScore,
                  [playerId]: {
                    ...playerStats,
                    [stat]: (playerStats[stat] || 0) + amount, // Update the stat
                  },
                },
              },
            },
          };
        });
      },
    }),
    {
      name: "baskItball-stat-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
