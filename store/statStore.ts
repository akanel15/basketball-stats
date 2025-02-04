// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";

// type PlayByPlayType = {
//   playerId: string;
//   action: string;
// };

// type BoxScoreType = Record<string, StatsType>; //<playerId, stats>

// type GameStatsType = {
//   teamId: string;
//   totals: StatsType;
//   boxScore: BoxScoreType; //opponent can be stored here also in one stats type with key "opponent" or anything else
//   playByPlay: PlayByPlayType[];
//   isFinished: boolean;
// };

// type SetStatsType = {
//   runCount: number;
//   stats: StatsType;
// };

// type TeamStatsType = {
//   gameNumbers: GameNumbersType;
//   opponentStats: StatsType;
//   stats: StatsType;
// };

// const initialGameStats: GameStatsType = {
//   teamId: "",
//   totals: initialBaseStats,
//   boxScore: {},
//   playByPlay: [],
//   isFinished: false,
// };

// const initialTeamStats: TeamStatsType = {
//   gameNumbers: initialGameNumbers,
//   stats: initialBaseStats,
//   opponentStats: initialBaseStats,
// };

// const initialSetStats: SetStatsType = {
//   runCount: 0,
//   stats: initialBaseStats,
// };

// type StatsState = {
//   gameStats: Record<string, GameStatsType>;
//   playerStats: Record<string, PlayerStatsType>;
//   teamStats: Record<string, TeamStatsType>;
//   setStats: Record<string, SetStatsType>;

//   //Methods
//   updateBoxScore: (
//     gameId: string,
//     playerId: string,
//     update: keyof StatsType,
//     amount: number,
//   ) => void;

//   // updateOpponentGameStats: (
//   //   gameId: string,
//   //   updates: Partial<StatsType>,
//   // ) => void;
//   // updatePlayerStats: (playerId: string, updates: Partial<StatsType>) => void;
//   // updateTeamStats: (teamId: string, updates: Partial<StatsType>) => void;
//   // updateSetStats: (setId: string, updates: Partial<StatsType>) => void;
//   // addPlayByPlay: (gameId: string, play: PlayByPlayType) => void;

//   //mutliAction

//   //shooting
//   //   statUpdateAction: (
//   //     category: Stat, //change to enum
//   //     playerId: string,
//   //     teamId: string,
//   //     gameId: string,
//   //     setId?: string,
//   //   ) => void;
//   //   opponentStatUpdateAction: (
//   //     category: string, //change to enum
//   //     gameId: string,
//   //   ) => void;
// };

// export const useStatStore = create(
//   persist<StatsState>(
//     (set) => ({
//       gameStats: {}, // Record<string, GameStatsType>
//       playerStats: {}, // Record<string, PlayerStatsType>
//       teamStats: {}, // Record<string, TeamStatsType>
//       setStats: {}, // Record<string, SetStatsType>

//       updateBoxScore: (
//         gameId: string,
//         playerId: string,
//         stat: keyof StatsType,
//         amount: number,
//       ) => {
//         set((state) => {
//           const game = state.gameStats[gameId] ?? {
//             ...initialGameStats,
//           };
//           const playerStats = game.boxScore[playerId] ?? {
//             ...initialBaseStats,
//           }; // Use initial stats if missing

//           return {
//             gameStats: {
//               ...state.gameStats,
//               [gameId]: {
//                 ...game,
//                 boxScore: {
//                   ...game.boxScore,
//                   [playerId]: {
//                     ...playerStats,
//                     [stat]: (playerStats[stat] || 0) + amount, // Update the stat
//                   },
//                 },
//               },
//             },
//           };
//         });
//       },
//     }),
//     {
//       name: "baskItball-stat-store",
//       storage: createJSONStorage(() => AsyncStorage),
//     },
//   ),
// );
