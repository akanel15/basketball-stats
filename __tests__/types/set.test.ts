import { createSet } from "@/types/set";
import { Stat } from "@/types/stats";

describe("Set Types and Utilities", () => {
  describe("createSet", () => {
    it("should create a set with correct properties", () => {
      const set = createSet("set-1", "Starting Five", "team-1");

      expect(set.id).toBe("set-1");
      expect(set.name).toBe("Starting Five");
      expect(set.teamId).toBe("team-1");
      expect(set.runCount).toBe(0);
      expect(set.stats).toBeDefined();
    });

    it("should initialize all stats to 0", () => {
      const set = createSet("set-1", "Test Set", "team-1");

      expect(set.stats[Stat.Points]).toBe(0);
      expect(set.stats[Stat.Assists]).toBe(0);
      expect(set.stats[Stat.TwoPointMakes]).toBe(0);
      expect(set.stats[Stat.ThreePointMakes]).toBe(0);
      expect(set.stats[Stat.DefensiveRebounds]).toBe(0);
      expect(set.stats[Stat.OffensiveRebounds]).toBe(0);
      expect(set.stats[Stat.Steals]).toBe(0);
      expect(set.stats[Stat.Blocks]).toBe(0);
      expect(set.stats[Stat.Turnovers]).toBe(0);
      expect(set.stats[Stat.FreeThrowsMade]).toBe(0);
      expect(set.stats[Stat.FreeThrowsAttempted]).toBe(0);
      expect(set.stats[Stat.TwoPointAttempts]).toBe(0);
      expect(set.stats[Stat.ThreePointAttempts]).toBe(0);
      expect(set.stats[Stat.FoulsCommitted]).toBe(0);
      expect(set.stats[Stat.FoulsDrawn]).toBe(0);
      expect(set.stats[Stat.Deflections]).toBe(0);
      expect(set.stats[Stat.PlusMinus]).toBe(0);
    });

    it("should create independent stat objects for different sets", () => {
      const set1 = createSet("set-1", "Set 1", "team-1");
      const set2 = createSet("set-2", "Set 2", "team-2");

      // Modify stats on set1
      set1.stats[Stat.Points] = 10;
      set1.runCount = 5;

      // Verify set2 is unaffected
      expect(set2.stats[Stat.Points]).toBe(0);
      expect(set2.runCount).toBe(0);
      expect(set2.teamId).toBe("team-2");
    });

    it("should handle empty names and team IDs", () => {
      const set = createSet("id", "", "");

      expect(set.id).toBe("id");
      expect(set.name).toBe("");
      expect(set.teamId).toBe("");
      expect(set.runCount).toBe(0);
      expect(set.stats).toBeDefined();
    });

    it("should create sets with unique IDs and names", () => {
      const set1 = createSet("unique-1", "Name A", "team-1");
      const set2 = createSet("unique-2", "Name B", "team-2");

      expect(set1.id).not.toBe(set2.id);
      expect(set1.name).not.toBe(set2.name);
      expect(set1.teamId).not.toBe(set2.teamId);
    });

    it("should conform to SetType interface", () => {
      const set = createSet("test-id", "Test Name", "test-team");

      // Type check - these should not throw TypeScript errors
      const id: string = set.id;
      const name: string = set.name;
      const teamId: string = set.teamId;
      const runCount: number = set.runCount;
      const points: number = set.stats[Stat.Points];

      expect(typeof id).toBe("string");
      expect(typeof name).toBe("string");
      expect(typeof teamId).toBe("string");
      expect(typeof runCount).toBe("number");
      expect(typeof points).toBe("number");
    });
  });
});
