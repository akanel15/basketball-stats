import {
  getTeamDeletionInfo,
  getPlayerDeletionInfo,
  getSetDeletionInfo,
  cascadeDeleteTeam,
  cascadeDeletePlayer,
  cascadeDeleteSet,
  cascadeDeleteGame,
} from "../../utils/cascadeDelete";
import { useGameStore } from "../../store/gameStore";
import { usePlayerStore } from "../../store/playerStore";
import { useSetStore } from "../../store/setStore";
import { useTeamStore } from "../../store/teamStore";
import { GameType } from "../../types/game";
import { PlayerType } from "../../types/player";
import { SetType } from "../../types/set";
import { TeamType } from "../../types/team";
import { Stat, initialBaseStats } from "../../types/stats";
import { PeriodType, Team } from "../../types/game";

// Mock the stores
jest.mock("../../store/gameStore");
jest.mock("../../store/playerStore");
jest.mock("../../store/setStore");
jest.mock("../../store/teamStore");

describe("cascadeDelete", () => {
  // Helper function to create complete mock game
  const createMockGame = (overrides: Partial<GameType> = {}): GameType => ({
    id: "game-1",
    teamId: "team-1",
    opposingTeamName: "Opponents",
    activePlayers: [],
    activeSets: [],
    gamePlayedList: [],
    periodType: PeriodType.Quarters,
    statTotals: {
      [Team.Us]: { ...initialBaseStats },
      [Team.Opponent]: { ...initialBaseStats },
    },
    boxScore: {},
    sets: {},
    periods: [],
    isFinished: false,
    ...overrides,
  });

  // Mock store instances
  const mockGameStore = {
    games: {} as Record<string, GameType>,
    removeGame: jest.fn(),
    setActivePlayers: jest.fn(),
    setActiveSets: jest.fn(),
  };

  const mockPlayerStore = {
    players: {} as Record<string, PlayerType>,
    removePlayer: jest.fn(),
  };

  const mockSetStore = {
    sets: {} as Record<string, SetType>,
    removeSet: jest.fn(),
  };

  const mockTeamStore = {
    teams: {} as Record<string, TeamType>,
    removeTeam: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset mock store data
    mockGameStore.games = {};
    mockPlayerStore.players = {};
    mockSetStore.sets = {};
    mockTeamStore.teams = {};

    // Mock store getState methods
    (useGameStore.getState as jest.Mock).mockReturnValue(mockGameStore);
    (usePlayerStore.getState as jest.Mock).mockReturnValue(mockPlayerStore);
    (useSetStore.getState as jest.Mock).mockReturnValue(mockSetStore);
    (useTeamStore.getState as jest.Mock).mockReturnValue(mockTeamStore);
  });

  describe("getTeamDeletionInfo", () => {
    it("should return empty arrays when team has no associated data", () => {
      const result = getTeamDeletionInfo("team-1");

      expect(result).toEqual({
        games: [],
        players: [],
        sets: [],
      });
    });

    it("should return all associated games, players, and sets for a team", () => {
      const teamId = "team-1";

      // Mock data
      mockGameStore.games = {
        "game-1": {
          id: "game-1",
          teamId,
          opposingTeamName: "Opponents",
        } as GameType,
        "game-2": {
          id: "game-2",
          teamId: "other-team",
          opposingTeamName: "Other Opponents",
        } as GameType,
      };

      mockPlayerStore.players = {
        "player-1": {
          id: "player-1",
          teamId,
          name: "Player 1",
        } as PlayerType,
        "player-2": {
          id: "player-2",
          teamId: "other-team",
          name: "Player 2",
        } as PlayerType,
      };

      mockSetStore.sets = {
        "set-1": {
          id: "set-1",
          teamId,
          name: "Set 1",
        } as SetType,
        "set-2": {
          id: "set-2",
          teamId: "other-team",
          name: "Set 2",
        } as SetType,
      };

      const result = getTeamDeletionInfo(teamId);

      expect(result).toEqual({
        games: [{ id: "game-1", name: "vs Opponents" }],
        players: [{ id: "player-1", name: "Player 1" }],
        sets: [{ id: "set-1", name: "Set 1" }],
      });
    });
  });

  describe("getPlayerDeletionInfo", () => {
    it("should return empty arrays when player has no associated games", () => {
      const result = getPlayerDeletionInfo("player-1");

      expect(result).toEqual({
        games: [],
        players: [],
        sets: [],
      });
    });

    it("should return games where player appears in boxScore", () => {
      const playerId = "player-1";

      mockGameStore.games = {
        "game-1": createMockGame({
          id: "game-1",
          opposingTeamName: "Team A",
          boxScore: {
            [playerId]: { ...initialBaseStats, [Stat.Points]: 10 },
          },
        }),
        "game-2": createMockGame({
          id: "game-2",
          opposingTeamName: "Team B",
          boxScore: {},
        }),
      };

      const result = getPlayerDeletionInfo(playerId);

      expect(result).toEqual({
        games: [{ id: "game-1", name: "vs Team A" }],
        players: [],
        sets: [],
      });
    });

    it("should return games where player appears in activePlayers", () => {
      const playerId = "player-1";

      mockGameStore.games = {
        "game-1": createMockGame({
          id: "game-1",
          opposingTeamName: "Team A",
          activePlayers: [playerId],
        }),
      };

      const result = getPlayerDeletionInfo(playerId);

      expect(result).toEqual({
        games: [{ id: "game-1", name: "vs Team A" }],
        players: [],
        sets: [],
      });
    });

    it("should return games where player appears in gamePlayedList", () => {
      const playerId = "player-1";

      mockGameStore.games = {
        "game-1": createMockGame({
          id: "game-1",
          opposingTeamName: "Team A",
          gamePlayedList: [playerId],
        }),
      };

      const result = getPlayerDeletionInfo(playerId);

      expect(result).toEqual({
        games: [{ id: "game-1", name: "vs Team A" }],
        players: [],
        sets: [],
      });
    });
  });

  describe("getSetDeletionInfo", () => {
    it("should return empty arrays when set has no associated games", () => {
      const result = getSetDeletionInfo("set-1");

      expect(result).toEqual({
        games: [],
        players: [],
        sets: [],
      });
    });

    it("should return games where set appears in sets object", () => {
      const setId = "set-1";

      mockGameStore.games = {
        "game-1": createMockGame({
          id: "game-1",
          opposingTeamName: "Team A",
          sets: {
            [setId]: {
              id: setId,
              name: "Test Set",
              teamId: "team-1",
              runCount: 5,
              stats: { ...initialBaseStats, [Stat.Points]: 5 },
            },
          },
        }),
        "game-2": createMockGame({
          id: "game-2",
          opposingTeamName: "Team B",
        }),
      };

      const result = getSetDeletionInfo(setId);

      expect(result).toEqual({
        games: [{ id: "game-1", name: "vs Team A" }],
        players: [],
        sets: [],
      });
    });

    it("should return games where set appears in activeSets", () => {
      const setId = "set-1";

      mockGameStore.games = {
        "game-1": createMockGame({
          id: "game-1",
          opposingTeamName: "Team A",
          activeSets: [setId],
        }),
      };

      const result = getSetDeletionInfo(setId);

      expect(result).toEqual({
        games: [{ id: "game-1", name: "vs Team A" }],
        players: [],
        sets: [],
      });
    });
  });

  describe("cascadeDeleteTeam", () => {
    it("should delete all associated games, players, sets, and the team", () => {
      const teamId = "team-1";

      // Set up mock data
      mockGameStore.games = {
        "game-1": { id: "game-1", teamId } as GameType,
        "game-2": { id: "game-2", teamId: "other-team" } as GameType,
      };

      mockPlayerStore.players = {
        "player-1": { id: "player-1", teamId } as PlayerType,
      };

      mockSetStore.sets = {
        "set-1": { id: "set-1", teamId } as SetType,
      };

      cascadeDeleteTeam(teamId);

      expect(mockGameStore.removeGame).toHaveBeenCalledWith("game-1");
      expect(mockPlayerStore.removePlayer).toHaveBeenCalledWith("player-1");
      expect(mockSetStore.removeSet).toHaveBeenCalledWith("set-1");
      expect(mockTeamStore.removeTeam).toHaveBeenCalledWith(teamId);

      // Should not delete items from other teams
      expect(mockGameStore.removeGame).not.toHaveBeenCalledWith("game-2");
    });
  });

  describe("cascadeDeletePlayer", () => {
    it("should remove player from games and delete the player", () => {
      const playerId = "player-1";
      const gameId = "game-1";

      const mockGame = createMockGame({
        id: gameId,
        activePlayers: [playerId, "player-2"],
        gamePlayedList: [playerId],
      });

      mockGameStore.games = {
        [gameId]: mockGame,
      };

      const mockSetActivePlayers = jest.fn();
      mockGameStore.setActivePlayers = mockSetActivePlayers;

      cascadeDeletePlayer(playerId);

      expect(mockSetActivePlayers).toHaveBeenCalledWith(gameId, ["player-2"]);
      expect(mockPlayerStore.removePlayer).toHaveBeenCalledWith(playerId);
    });

    it("should handle player not in any games", () => {
      const playerId = "player-1";

      cascadeDeletePlayer(playerId);

      expect(mockPlayerStore.removePlayer).toHaveBeenCalledWith(playerId);
    });
  });

  describe("cascadeDeleteSet", () => {
    it("should remove set from games and delete the set", () => {
      const setId = "set-1";
      const gameId = "game-1";

      const mockGame = createMockGame({
        id: gameId,
        activeSets: [setId, "set-2"],
      });

      mockGameStore.games = {
        [gameId]: mockGame,
      };

      const mockSetActiveSets = jest.fn();
      mockGameStore.setActiveSets = mockSetActiveSets;

      cascadeDeleteSet(setId);

      expect(mockSetActiveSets).toHaveBeenCalledWith(gameId, ["set-2"]);
      expect(mockSetStore.removeSet).toHaveBeenCalledWith(setId);
    });

    it("should handle set not in any games", () => {
      const setId = "set-1";

      cascadeDeleteSet(setId);

      expect(mockSetStore.removeSet).toHaveBeenCalledWith(setId);
    });
  });

  describe("cascadeDeleteGame", () => {
    it("should delete the game", () => {
      const gameId = "game-1";

      cascadeDeleteGame(gameId);

      expect(mockGameStore.removeGame).toHaveBeenCalledWith(gameId);
    });
  });
});
