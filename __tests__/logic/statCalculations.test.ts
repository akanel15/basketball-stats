import {
  calculateUpdatedBoxScore,
  calculateUpdatedStatTotals,
  calculatePlusMinusAmount,
  calculateUpdatedGameNumbers,
  calculateRevertedGameNumbers,
  calculateUpdatedPlayerStats,
  calculateUpdatedTeamStats,
  shouldIncrementSetRun,
  shouldSetFreeThrowToggle,
  createStatUpdateOperations,
  GameNumbers,
} from "@/logic/statCalculations";
import { Stat, StatsType, initialBaseStats } from "@/types/stats";
import { Team } from "@/types/game";
import { Result } from "@/types/player";

describe("Stat Calculations Logic", () => {
  describe("calculateUpdatedBoxScore", () => {
    test("should update existing box score", () => {
      const currentBoxScore: StatsType = {
        ...initialBaseStats,
        [Stat.Points]: 10,
        [Stat.TwoPointMakes]: 2,
      };

      const result = calculateUpdatedBoxScore(currentBoxScore, Stat.Points, 3);

      expect(result).toEqual({
        ...currentBoxScore,
        [Stat.Points]: 13,
      });
    });

    test("should create new box score from undefined", () => {
      const result = calculateUpdatedBoxScore(undefined, Stat.Points, 5);

      expect(result).toEqual({
        ...initialBaseStats,
        [Stat.Points]: 5,
      });
    });

    test("should handle zero stat value", () => {
      const currentBoxScore: StatsType = { ...initialBaseStats };
      const result = calculateUpdatedBoxScore(currentBoxScore, Stat.Assists, 1);

      expect(result[Stat.Assists]).toBe(1);
    });

    test("should handle negative amounts", () => {
      const currentBoxScore: StatsType = {
        ...initialBaseStats,
        [Stat.Points]: 10,
      };

      const result = calculateUpdatedBoxScore(currentBoxScore, Stat.Points, -3);

      expect(result[Stat.Points]).toBe(7);
    });

    test("should not mutate original box score", () => {
      const currentBoxScore: StatsType = {
        ...initialBaseStats,
        [Stat.Points]: 10,
      };
      const originalPoints = currentBoxScore[Stat.Points];

      calculateUpdatedBoxScore(currentBoxScore, Stat.Points, 5);

      expect(currentBoxScore[Stat.Points]).toBe(originalPoints);
    });
  });

  describe("calculateUpdatedStatTotals", () => {
    test("should update stat totals for our team", () => {
      const currentTotals = {
        [Team.Us]: { ...initialBaseStats, [Stat.Points]: 50 },
        [Team.Opponent]: { ...initialBaseStats, [Stat.Points]: 45 },
      };

      const result = calculateUpdatedStatTotals(currentTotals, Stat.Points, 2, Team.Us);

      expect(result[Team.Us][Stat.Points]).toBe(52);
      expect(result[Team.Opponent][Stat.Points]).toBe(45);
    });

    test("should update stat totals for opponent team", () => {
      const currentTotals = {
        [Team.Us]: { ...initialBaseStats, [Stat.Points]: 50 },
        [Team.Opponent]: { ...initialBaseStats, [Stat.Points]: 45 },
      };

      const result = calculateUpdatedStatTotals(currentTotals, Stat.Points, 3, Team.Opponent);

      expect(result[Team.Us][Stat.Points]).toBe(50);
      expect(result[Team.Opponent][Stat.Points]).toBe(48);
    });

    test("should handle undefined stat values", () => {
      const currentTotals = {
        [Team.Us]: {
          ...initialBaseStats,
          [Stat.DefensiveRebounds]: undefined as any,
        },
        [Team.Opponent]: { ...initialBaseStats },
      };

      const result = calculateUpdatedStatTotals(currentTotals, Stat.DefensiveRebounds, 1, Team.Us);

      expect(result[Team.Us][Stat.DefensiveRebounds]).toBe(1);
    });

    test("should not mutate original stat totals", () => {
      const currentTotals = {
        [Team.Us]: { ...initialBaseStats, [Stat.Points]: 50 },
        [Team.Opponent]: { ...initialBaseStats, [Stat.Points]: 45 },
      };
      const originalUsPoints = currentTotals[Team.Us][Stat.Points];

      calculateUpdatedStatTotals(currentTotals, Stat.Points, 2, Team.Us);

      expect(currentTotals[Team.Us][Stat.Points]).toBe(originalUsPoints);
    });
  });

  describe("calculatePlusMinusAmount", () => {
    test("should return positive amount for our team", () => {
      expect(calculatePlusMinusAmount(Team.Us, 5)).toBe(5);
    });

    test("should return negative amount for opponent team", () => {
      expect(calculatePlusMinusAmount(Team.Opponent, 5)).toBe(-5);
    });

    test("should handle zero amount", () => {
      expect(calculatePlusMinusAmount(Team.Us, 0)).toBe(0);
      expect(calculatePlusMinusAmount(Team.Opponent, 0)).toBe(0);
    });

    test("should handle negative amounts", () => {
      expect(calculatePlusMinusAmount(Team.Us, -3)).toBe(-3);
      expect(calculatePlusMinusAmount(Team.Opponent, -3)).toBe(3);
    });
  });

  describe("calculateUpdatedGameNumbers", () => {
    test("should update wins", () => {
      const currentNumbers: GameNumbers = {
        wins: 5,
        losses: 3,
        draws: 1,
        gamesPlayed: 9,
      };

      const result = calculateUpdatedGameNumbers(currentNumbers, Result.Win);

      expect(result).toEqual({
        wins: 6,
        losses: 3,
        draws: 1,
        gamesPlayed: 10,
      });
    });

    test("should update losses", () => {
      const currentNumbers: GameNumbers = {
        wins: 5,
        losses: 3,
        draws: 1,
        gamesPlayed: 9,
      };

      const result = calculateUpdatedGameNumbers(currentNumbers, Result.Loss);

      expect(result).toEqual({
        wins: 5,
        losses: 4,
        draws: 1,
        gamesPlayed: 10,
      });
    });

    test("should update draws", () => {
      const currentNumbers: GameNumbers = {
        wins: 5,
        losses: 3,
        draws: 1,
        gamesPlayed: 9,
      };

      const result = calculateUpdatedGameNumbers(currentNumbers, Result.Draw);

      expect(result).toEqual({
        wins: 5,
        losses: 3,
        draws: 2,
        gamesPlayed: 10,
      });
    });

    test("should handle undefined values", () => {
      const currentNumbers: GameNumbers = {
        gamesPlayed: 0,
      };

      const result = calculateUpdatedGameNumbers(currentNumbers, Result.Win);

      expect(result).toEqual({
        wins: 1,
        gamesPlayed: 1,
      });
    });

    test("should not mutate original game numbers", () => {
      const currentNumbers: GameNumbers = {
        wins: 5,
        losses: 3,
        draws: 1,
        gamesPlayed: 9,
      };
      const originalWins = currentNumbers.wins;

      calculateUpdatedGameNumbers(currentNumbers, Result.Win);

      expect(currentNumbers.wins).toBe(originalWins);
    });
  });

  describe("calculateRevertedGameNumbers", () => {
    test("should revert wins", () => {
      const currentNumbers: GameNumbers = {
        wins: 5,
        losses: 3,
        draws: 1,
        gamesPlayed: 9,
      };

      const result = calculateRevertedGameNumbers(currentNumbers, Result.Win);

      expect(result).toEqual({
        wins: 4,
        losses: 3,
        draws: 1,
        gamesPlayed: 8,
      });
    });

    test("should not go below zero", () => {
      const currentNumbers: GameNumbers = {
        wins: 0,
        losses: 0,
        draws: 0,
        gamesPlayed: 0,
      };

      const result = calculateRevertedGameNumbers(currentNumbers, Result.Win);

      expect(result).toEqual({
        wins: 0,
        losses: 0,
        draws: 0,
        gamesPlayed: 0,
      });
    });

    test("should handle undefined values", () => {
      const currentNumbers: GameNumbers = {
        gamesPlayed: 1,
      };

      const result = calculateRevertedGameNumbers(currentNumbers, Result.Win);

      expect(result).toEqual({
        wins: 0, // Math.max(0, undefined - 1) = Math.max(0, NaN - 1) = 0
        gamesPlayed: 0,
      });
    });
  });

  describe("calculateUpdatedPlayerStats", () => {
    test("should update player stats", () => {
      const currentStats: StatsType = {
        ...initialBaseStats,
        [Stat.Points]: 15,
        [Stat.Assists]: 3,
      };

      const result = calculateUpdatedPlayerStats(currentStats, Stat.Assists, 1);

      expect(result).toEqual({
        ...currentStats,
        [Stat.Assists]: 4,
      });
    });

    test("should handle undefined stat values", () => {
      const currentStats: StatsType = { ...initialBaseStats };
      // Create a copy where Steals is explicitly undefined
      const statsWithUndefined = {
        ...currentStats,
        [Stat.Steals]: undefined as any,
      };

      const result = calculateUpdatedPlayerStats(statsWithUndefined, Stat.Steals, 2);

      expect(result[Stat.Steals]).toBe(2);
    });

    test("should not mutate original stats", () => {
      const currentStats: StatsType = {
        ...initialBaseStats,
        [Stat.Points]: 15,
      };
      const originalPoints = currentStats[Stat.Points];

      calculateUpdatedPlayerStats(currentStats, Stat.Points, 2);

      expect(currentStats[Stat.Points]).toBe(originalPoints);
    });
  });

  describe("calculateUpdatedTeamStats", () => {
    test("should update team stats for our team", () => {
      const currentTeamStats = {
        [Team.Us]: { ...initialBaseStats, [Stat.Points]: 100 },
        [Team.Opponent]: { ...initialBaseStats, [Stat.Points]: 95 },
      };

      const result = calculateUpdatedTeamStats(currentTeamStats, Stat.Points, 2, Team.Us);

      expect(result[Team.Us][Stat.Points]).toBe(102);
      expect(result[Team.Opponent][Stat.Points]).toBe(95);
    });

    test("should update team stats for opponent team", () => {
      const currentTeamStats = {
        [Team.Us]: { ...initialBaseStats, [Stat.Points]: 100 },
        [Team.Opponent]: { ...initialBaseStats, [Stat.Points]: 95 },
      };

      const result = calculateUpdatedTeamStats(
        currentTeamStats,
        Stat.DefensiveRebounds,
        3,
        Team.Opponent,
      );

      expect(result[Team.Opponent][Stat.DefensiveRebounds]).toBe(3);
      expect(result[Team.Us][Stat.DefensiveRebounds]).toBe(0);
    });

    test("should not mutate original team stats", () => {
      const currentTeamStats = {
        [Team.Us]: { ...initialBaseStats, [Stat.Points]: 100 },
        [Team.Opponent]: { ...initialBaseStats, [Stat.Points]: 95 },
      };
      const originalUsPoints = currentTeamStats[Team.Us][Stat.Points];

      calculateUpdatedTeamStats(currentTeamStats, Stat.Points, 2, Team.Us);

      expect(currentTeamStats[Team.Us][Stat.Points]).toBe(originalUsPoints);
    });
  });

  describe("shouldIncrementSetRun", () => {
    test("should return false for opponent player", () => {
      const result = shouldIncrementSetRun("Opponent", [Stat.TwoPointMakes], false);
      expect(result).toBe(false);
    });

    test("should return true for two point makes", () => {
      const result = shouldIncrementSetRun("player1", [Stat.TwoPointMakes], false);
      expect(result).toBe(true);
    });

    test("should return true for two point attempts", () => {
      const result = shouldIncrementSetRun("player1", [Stat.TwoPointAttempts], false);
      expect(result).toBe(true);
    });

    test("should return true for three point makes", () => {
      const result = shouldIncrementSetRun("player1", [Stat.ThreePointMakes], false);
      expect(result).toBe(true);
    });

    test("should return true for three point attempts", () => {
      const result = shouldIncrementSetRun("player1", [Stat.ThreePointAttempts], false);
      expect(result).toBe(true);
    });

    test("should return true for turnovers", () => {
      const result = shouldIncrementSetRun("player1", [Stat.Turnovers], false);
      expect(result).toBe(true);
    });

    test("should return false for free throws when toggle is false", () => {
      const result = shouldIncrementSetRun("player1", [Stat.FreeThrowsMade], false);
      expect(result).toBe(false);
    });

    test("should return true for new action post free throw", () => {
      // freeThrowToggle is true but stats don't include free throws
      const result = shouldIncrementSetRun("player1", [Stat.Assists], true);
      expect(result).toBe(true);
    });

    test("should return true when free throw toggle is true but only includes made free throws", () => {
      // When toggle is true and only FreeThrowsMade is included (not attempted),
      // it should return true because the condition !stats.includes(Stat.FreeThrowsAttempted) is true
      const result = shouldIncrementSetRun("player1", [Stat.FreeThrowsMade], true);
      expect(result).toBe(true);
    });

    test("should return false when free throw toggle is true and includes both free throw stats", () => {
      // When toggle is true and both FreeThrowsMade and FreeThrowsAttempted are included,
      // the condition (!stats.includes(FreeThrowsMade) || !stats.includes(FreeThrowsAttempted)) is false
      const result = shouldIncrementSetRun(
        "player1",
        [Stat.FreeThrowsMade, Stat.FreeThrowsAttempted],
        true,
      );
      expect(result).toBe(false);
    });

    test("should return false for non-concluding stats", () => {
      const result = shouldIncrementSetRun(
        "player1",
        [Stat.Assists, Stat.DefensiveRebounds],
        false,
      );
      expect(result).toBe(false);
    });

    test("should return true if any stat concludes possession", () => {
      const result = shouldIncrementSetRun("player1", [Stat.Assists, Stat.TwoPointMakes], false);
      expect(result).toBe(true);
    });
  });

  describe("shouldSetFreeThrowToggle", () => {
    test("should return true for free throw makes", () => {
      const result = shouldSetFreeThrowToggle([Stat.FreeThrowsMade]);
      expect(result).toBe(true);
    });

    test("should return true for free throw attempts", () => {
      const result = shouldSetFreeThrowToggle([Stat.FreeThrowsAttempted]);
      expect(result).toBe(true);
    });

    test("should return true for both free throw stats", () => {
      const result = shouldSetFreeThrowToggle([Stat.FreeThrowsMade, Stat.FreeThrowsAttempted]);
      expect(result).toBe(true);
    });

    test("should return false for non-free-throw stats", () => {
      const result = shouldSetFreeThrowToggle([Stat.Points, Stat.Assists]);
      expect(result).toBe(false);
    });

    test("should return false for empty stats array", () => {
      const result = shouldSetFreeThrowToggle([]);
      expect(result).toBe(false);
    });

    test("should return true when mixed with other stats", () => {
      const result = shouldSetFreeThrowToggle([Stat.Points, Stat.FreeThrowsMade, Stat.Assists]);
      expect(result).toBe(true);
    });
  });

  describe("createStatUpdateOperations", () => {
    test("should create operations for single stat", () => {
      const operations = createStatUpdateOperations("game-id", "team-id", "player-id", "set-id", [
        Stat.Points,
      ]);

      expect(operations).toHaveLength(1);
      expect(operations[0]).toEqual({
        updateBoxScore: {
          gameId: "game-id",
          playerId: "player-id",
          stat: Stat.Points,
          amount: 1,
        },
        updateTotals: {
          gameId: "game-id",
          stat: Stat.Points,
          amount: 1,
          team: Team.Us,
        },
        updateTeamStats: {
          teamId: "team-id",
          stat: Stat.Points,
          amount: 1,
          team: Team.Us,
        },
        updatePlayerStats: {
          playerId: "player-id",
          stat: Stat.Points,
          amount: 1,
        },
        updateSetStats: { setId: "set-id", stat: Stat.Points, amount: 1 },
      });
    });

    test("should create operations for multiple stats", () => {
      const operations = createStatUpdateOperations("game-id", "team-id", "player-id", "set-id", [
        Stat.Points,
        Stat.TwoPointMakes,
        Stat.TwoPointAttempts,
      ]);

      expect(operations).toHaveLength(3);
      expect(operations[0].updateBoxScore?.stat).toBe(Stat.Points);
      expect(operations[1].updateBoxScore?.stat).toBe(Stat.TwoPointMakes);
      expect(operations[2].updateBoxScore?.stat).toBe(Stat.TwoPointAttempts);
    });

    test("should create operations for empty stats array", () => {
      const operations = createStatUpdateOperations(
        "game-id",
        "team-id",
        "player-id",
        "set-id",
        [],
      );

      expect(operations).toHaveLength(0);
    });

    test("should use provided IDs in all operations", () => {
      const operations = createStatUpdateOperations(
        "test-game",
        "test-team",
        "test-player",
        "test-set",
        [Stat.Assists],
      );

      const operation = operations[0];
      expect(operation.updateBoxScore?.gameId).toBe("test-game");
      expect(operation.updateBoxScore?.playerId).toBe("test-player");
      expect(operation.updateTotals?.gameId).toBe("test-game");
      expect(operation.updateTeamStats?.teamId).toBe("test-team");
      expect(operation.updatePlayerStats?.playerId).toBe("test-player");
      expect(operation.updateSetStats?.setId).toBe("test-set");
    });
  });

  describe("Edge Cases and Error Handling", () => {
    test("should handle very large stat values", () => {
      const currentStats: StatsType = {
        ...initialBaseStats,
        [Stat.Points]: 999999,
      };

      const result = calculateUpdatedPlayerStats(currentStats, Stat.Points, 1);
      expect(result[Stat.Points]).toBe(1000000);
    });

    test("should handle very large negative amounts", () => {
      const currentStats: StatsType = {
        ...initialBaseStats,
        [Stat.Points]: 100,
      };

      const result = calculateUpdatedPlayerStats(currentStats, Stat.Points, -999999);
      expect(result[Stat.Points]).toBe(-999899);
    });

    test("should handle all stat types", () => {
      Object.values(Stat).forEach(stat => {
        const result = calculateUpdatedPlayerStats(initialBaseStats, stat, 1);
        expect(result[stat]).toBe(1);
      });
    });
  });
});
