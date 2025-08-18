import {
  Stat,
  ActionType,
  ShootingStatMake,
  ShootingStatMiss,
  ReboundAssistStat,
  FoulTurnoverStat,
  DefensiveStat,
  StatMapping,
  initialBaseStats,
  getStatsForAction,
  getStatLabel,
} from "@/types/stats";

describe("Stats Types and Utilities", () => {
  describe("getStatsForAction", () => {
    describe("Shooting Makes", () => {
      it("should return correct stats for three point makes", () => {
        const result = getStatsForAction(Stat.ThreePointMakes);
        expect(result).toEqual([Stat.ThreePointMakes, Stat.ThreePointAttempts]);
      });

      it("should return correct stats for two point makes", () => {
        const result = getStatsForAction(Stat.TwoPointMakes);
        expect(result).toEqual([Stat.TwoPointMakes, Stat.TwoPointAttempts]);
      });

      it("should return correct stats for free throw makes", () => {
        const result = getStatsForAction(Stat.FreeThrowsMade);
        expect(result).toEqual([Stat.FreeThrowsMade, Stat.FreeThrowsAttempted]);
      });
    });

    describe("Shooting Misses", () => {
      it("should return correct stats for three point attempts (misses)", () => {
        const result = getStatsForAction(Stat.ThreePointAttempts);
        expect(result).toEqual([Stat.ThreePointAttempts]);
      });

      it("should return correct stats for two point attempts (misses)", () => {
        const result = getStatsForAction(Stat.TwoPointAttempts);
        expect(result).toEqual([Stat.TwoPointAttempts]);
      });

      it("should return correct stats for free throw attempts (misses)", () => {
        const result = getStatsForAction(Stat.FreeThrowsAttempted);
        expect(result).toEqual([Stat.FreeThrowsAttempted]);
      });
    });

    describe("Other Stats", () => {
      it("should return correct stats for assists", () => {
        const result = getStatsForAction(Stat.Assists);
        expect(result).toEqual([Stat.Assists]);
      });

      it("should return correct stats for steals", () => {
        const result = getStatsForAction(Stat.Steals);
        expect(result).toEqual([Stat.Steals]);
      });

      it("should return correct stats for blocks", () => {
        const result = getStatsForAction(Stat.Blocks);
        expect(result).toEqual([Stat.Blocks]);
      });

      it("should return correct stats for turnovers", () => {
        const result = getStatsForAction(Stat.Turnovers);
        expect(result).toEqual([Stat.Turnovers]);
      });

      it("should return correct stats for defensive rebounds", () => {
        const result = getStatsForAction(Stat.DefensiveRebounds);
        expect(result).toEqual([Stat.DefensiveRebounds]);
      });

      it("should return correct stats for offensive rebounds", () => {
        const result = getStatsForAction(Stat.OffensiveRebounds);
        expect(result).toEqual([Stat.OffensiveRebounds]);
      });

      it("should return correct stats for fouls committed", () => {
        const result = getStatsForAction(Stat.FoulsCommitted);
        expect(result).toEqual([Stat.FoulsCommitted]);
      });

      it("should return correct stats for fouls drawn", () => {
        const result = getStatsForAction(Stat.FoulsDrawn);
        expect(result).toEqual([Stat.FoulsDrawn]);
      });
    });

    describe("Edge Cases", () => {
      it("should return empty array for unknown action", () => {
        const result = getStatsForAction("unknown-action");
        expect(result).toEqual([]);
      });

      it("should return empty array for undefined action", () => {
        const result = getStatsForAction(undefined as any);
        expect(result).toEqual([]);
      });

      it("should return empty array for empty string", () => {
        const result = getStatsForAction("");
        expect(result).toEqual([]);
      });

      it("should return empty array for Points stat (not handled in switch)", () => {
        const result = getStatsForAction(Stat.Points);
        expect(result).toEqual([]);
      });

      it("should return empty array for PlusMinus stat (not handled in switch)", () => {
        const result = getStatsForAction(Stat.PlusMinus);
        expect(result).toEqual([]);
      });

      it("should return empty array for Deflections stat (not handled in switch)", () => {
        const result = getStatsForAction(Stat.Deflections);
        expect(result).toEqual([]);
      });
    });
  });

  describe("getStatLabel", () => {
    it("should return correct label for Points", () => {
      expect(getStatLabel(Stat.Points)).toBe("PPG");
    });

    it("should return correct label for Assists", () => {
      expect(getStatLabel(Stat.Assists)).toBe("APG");
    });

    it("should return correct label for Offensive Rebounds", () => {
      expect(getStatLabel(Stat.OffensiveRebounds)).toBe("ORPG");
    });

    it("should return correct label for Defensive Rebounds", () => {
      expect(getStatLabel(Stat.DefensiveRebounds)).toBe("DRPG");
    });

    it("should return correct label for Steals", () => {
      expect(getStatLabel(Stat.Steals)).toBe("SPG");
    });

    it("should return correct label for Blocks", () => {
      expect(getStatLabel(Stat.Blocks)).toBe("BPG");
    });

    it("should return correct label for Two Point Makes", () => {
      expect(getStatLabel(Stat.TwoPointMakes)).toBe("2PM");
    });

    it("should return correct label for Three Point Makes", () => {
      expect(getStatLabel(Stat.ThreePointMakes)).toBe("3PM");
    });

    describe("Unlabeled Stats", () => {
      it("should return empty string for TwoPointAttempts", () => {
        expect(getStatLabel(Stat.TwoPointAttempts)).toBe("");
      });

      it("should return empty string for ThreePointAttempts", () => {
        expect(getStatLabel(Stat.ThreePointAttempts)).toBe("");
      });

      it("should return empty string for FreeThrowsMade", () => {
        expect(getStatLabel(Stat.FreeThrowsMade)).toBe("");
      });

      it("should return empty string for FreeThrowsAttempted", () => {
        expect(getStatLabel(Stat.FreeThrowsAttempted)).toBe("");
      });

      it("should return empty string for Turnovers", () => {
        expect(getStatLabel(Stat.Turnovers)).toBe("");
      });

      it("should return empty string for FoulsCommitted", () => {
        expect(getStatLabel(Stat.FoulsCommitted)).toBe("");
      });

      it("should return empty string for FoulsDrawn", () => {
        expect(getStatLabel(Stat.FoulsDrawn)).toBe("");
      });

      it("should return empty string for PlusMinus", () => {
        expect(getStatLabel(Stat.PlusMinus)).toBe("");
      });

      it("should return empty string for Deflections", () => {
        expect(getStatLabel(Stat.Deflections)).toBe("");
      });
    });

    describe("Edge Cases", () => {
      it("should return empty string for undefined stat", () => {
        expect(getStatLabel(undefined as any)).toBe("");
      });

      it("should return empty string for unknown stat", () => {
        expect(getStatLabel("unknown-stat" as any)).toBe("");
      });
    });
  });

  describe("StatMapping", () => {
    it("should have correct structure for shooting makes", () => {
      expect(StatMapping[ActionType.ShootingMake]).toBeDefined();
      expect(
        StatMapping[ActionType.ShootingMake][ShootingStatMake.FreeThrowMake],
      ).toEqual([Stat.FreeThrowsMade, Stat.FreeThrowsAttempted]);
      expect(
        StatMapping[ActionType.ShootingMake][ShootingStatMake.TwoPointMake],
      ).toEqual([Stat.TwoPointMakes, Stat.TwoPointAttempts]);
      expect(
        StatMapping[ActionType.ShootingMake][ShootingStatMake.ThreePointMake],
      ).toEqual([Stat.ThreePointMakes, Stat.ThreePointAttempts]);
    });

    it("should have correct structure for shooting misses", () => {
      expect(StatMapping[ActionType.ShootingMiss]).toBeDefined();
      expect(
        StatMapping[ActionType.ShootingMiss][ShootingStatMiss.FreeThrowMiss],
      ).toEqual([Stat.FreeThrowsAttempted]);
      expect(
        StatMapping[ActionType.ShootingMiss][ShootingStatMiss.TwoPointMiss],
      ).toEqual([Stat.TwoPointAttempts]);
      expect(
        StatMapping[ActionType.ShootingMiss][ShootingStatMiss.ThreePointMiss],
      ).toEqual([Stat.ThreePointAttempts]);
    });

    it("should have correct structure for rebound/assist", () => {
      expect(StatMapping[ActionType.ReboundAssist]).toBeDefined();
      expect(
        StatMapping[ActionType.ReboundAssist][ReboundAssistStat.Assist],
      ).toEqual([Stat.Assists]);
      expect(
        StatMapping[ActionType.ReboundAssist][
          ReboundAssistStat.OffensiveRebound
        ],
      ).toEqual([Stat.OffensiveRebounds]);
      expect(
        StatMapping[ActionType.ReboundAssist][
          ReboundAssistStat.DefensiveRebound
        ],
      ).toEqual([Stat.DefensiveRebounds]);
    });

    it("should have correct structure for foul/turnover", () => {
      expect(StatMapping[ActionType.FoulTurnover]).toBeDefined();
      expect(
        StatMapping[ActionType.FoulTurnover][FoulTurnoverStat.Turnover],
      ).toEqual([Stat.Turnovers]);
      expect(
        StatMapping[ActionType.FoulTurnover][FoulTurnoverStat.FoulCommitted],
      ).toEqual([Stat.FoulsCommitted]);
      expect(
        StatMapping[ActionType.FoulTurnover][FoulTurnoverStat.FoulDrawn],
      ).toEqual([Stat.FoulsDrawn]);
    });

    it("should have correct structure for defensive plays", () => {
      expect(StatMapping[ActionType.DefensivePlay]).toBeDefined();
      expect(
        StatMapping[ActionType.DefensivePlay][DefensiveStat.Steal],
      ).toEqual([Stat.Steals]);
      expect(
        StatMapping[ActionType.DefensivePlay][DefensiveStat.Block],
      ).toEqual([Stat.Blocks]);
      expect(
        StatMapping[ActionType.DefensivePlay][DefensiveStat.Deflection],
      ).toEqual([Stat.Deflections]);
    });
  });

  describe("initialBaseStats", () => {
    it("should have all stats initialized to 0", () => {
      expect(initialBaseStats[Stat.Points]).toBe(0);
      expect(initialBaseStats[Stat.Assists]).toBe(0);
      expect(initialBaseStats[Stat.DefensiveRebounds]).toBe(0);
      expect(initialBaseStats[Stat.OffensiveRebounds]).toBe(0);
      expect(initialBaseStats[Stat.Steals]).toBe(0);
      expect(initialBaseStats[Stat.Deflections]).toBe(0);
      expect(initialBaseStats[Stat.Blocks]).toBe(0);
      expect(initialBaseStats[Stat.Turnovers]).toBe(0);
      expect(initialBaseStats[Stat.TwoPointMakes]).toBe(0);
      expect(initialBaseStats[Stat.TwoPointAttempts]).toBe(0);
      expect(initialBaseStats[Stat.ThreePointMakes]).toBe(0);
      expect(initialBaseStats[Stat.ThreePointAttempts]).toBe(0);
      expect(initialBaseStats[Stat.FreeThrowsMade]).toBe(0);
      expect(initialBaseStats[Stat.FreeThrowsAttempted]).toBe(0);
      expect(initialBaseStats[Stat.FoulsCommitted]).toBe(0);
      expect(initialBaseStats[Stat.FoulsDrawn]).toBe(0);
      expect(initialBaseStats[Stat.PlusMinus]).toBe(0);
    });

    it("should contain all required stat properties", () => {
      const expectedStats = [
        Stat.Points,
        Stat.Assists,
        Stat.DefensiveRebounds,
        Stat.OffensiveRebounds,
        Stat.Steals,
        Stat.Deflections,
        Stat.Blocks,
        Stat.Turnovers,
        Stat.TwoPointMakes,
        Stat.TwoPointAttempts,
        Stat.ThreePointMakes,
        Stat.ThreePointAttempts,
        Stat.FreeThrowsMade,
        Stat.FreeThrowsAttempted,
        Stat.FoulsCommitted,
        Stat.FoulsDrawn,
        Stat.PlusMinus,
      ];

      expectedStats.forEach((stat) => {
        expect(initialBaseStats).toHaveProperty(stat);
      });
    });

    it("should be immutable (not modify original when copied)", () => {
      const copy = { ...initialBaseStats };
      copy[Stat.Points] = 10;

      expect(initialBaseStats[Stat.Points]).toBe(0);
      expect(copy[Stat.Points]).toBe(10);
    });
  });

  describe("Enum Values", () => {
    it("should have correct Stat enum values", () => {
      expect(Stat.Points).toBe("Points");
      expect(Stat.Assists).toBe("assist");
      expect(Stat.DefensiveRebounds).toBe("defensive rebound");
      expect(Stat.OffensiveRebounds).toBe("offensive rebound");
      expect(Stat.Steals).toBe("steal");
      expect(Stat.Deflections).toBe("deflection");
      expect(Stat.Blocks).toBe("block");
      expect(Stat.Turnovers).toBe("turnover");
      expect(Stat.TwoPointMakes).toBe("2pt made");
      expect(Stat.TwoPointAttempts).toBe("2pt miss");
      expect(Stat.ThreePointMakes).toBe("3pt made");
      expect(Stat.ThreePointAttempts).toBe("3pt missed");
      expect(Stat.FreeThrowsMade).toBe("free throw made");
      expect(Stat.FreeThrowsAttempted).toBe("free throw missed");
      expect(Stat.FoulsCommitted).toBe("foul committed");
      expect(Stat.FoulsDrawn).toBe("foul drawn");
      expect(Stat.PlusMinus).toBe("plus/minus");
    });

    it("should have correct ActionType enum values", () => {
      expect(ActionType.ShootingMake).toBe("ShootingMake");
      expect(ActionType.ShootingMiss).toBe("ShootingMiss");
      expect(ActionType.ReboundAssist).toBe("ReboundAssist");
      expect(ActionType.FoulTurnover).toBe("FoulTurnover");
      expect(ActionType.DefensivePlay).toBe("DefensivePlay");
    });
  });
});
