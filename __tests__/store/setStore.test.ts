import { useSetStore } from "@/store/setStore";
import { Stat } from "@/types/stats";

// Mock UUID for consistent IDs
jest.mock("react-native-uuid", () => ({
  v4: jest.fn(() => "test-set-id"),
}));

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock zustand to bypass persistence for testing
jest.mock("zustand/middleware", () => ({
  persist: (fn: any) => fn,
  createJSONStorage: () => ({}),
}));

describe("Set Store", () => {
  beforeEach(() => {
    // Reset store state before each test
    useSetStore.getState().sets = {};
  });

  afterEach(() => {
    // Clear all store state after tests
    useSetStore.getState().sets = {};
  });

  describe("Set CRUD Operations", () => {
    it("should add a new set", () => {
      const store = useSetStore.getState();

      store.addSet("Starting Five", "team-1");

      const sets = useSetStore.getState().sets;
      expect(Object.keys(sets)).toHaveLength(1);
      expect(sets["test-set-id"]).toBeDefined();
      expect(sets["test-set-id"].name).toBe("Starting Five");
      expect(sets["test-set-id"].teamId).toBe("team-1");
      expect(sets["test-set-id"].runCount).toBe(0);
      expect(sets["test-set-id"].stats).toBeDefined();
    });

    it("should add multiple sets", () => {
      const store = useSetStore.getState();

      // Mock uuid to return different IDs
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const uuidMock = require("react-native-uuid");
      uuidMock.v4.mockReturnValueOnce("set-1").mockReturnValueOnce("set-2");

      store.addSet("Starting Five", "team-1");
      store.addSet("Bench", "team-1");

      const sets = useSetStore.getState().sets;
      expect(Object.keys(sets)).toHaveLength(2);
      expect(sets["set-1"].name).toBe("Starting Five");
      expect(sets["set-2"].name).toBe("Bench");
    });

    it("should remove a set", () => {
      const store = useSetStore.getState();

      store.addSet("Starting Five", "team-1");
      store.removeSet("test-set-id");

      expect(Object.keys(useSetStore.getState().sets)).toHaveLength(0);
    });

    it("should warn and not crash when removing non-existent set", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      const store = useSetStore.getState();

      store.removeSet("non-existent-id");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Set with ID non-existent-id not found. Cannot remove.",
      );
      expect(Object.keys(useSetStore.getState().sets)).toHaveLength(0);
      consoleSpy.mockRestore();
    });

    it("should preserve other sets when removing one set", () => {
      const store = useSetStore.getState();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const uuidMock = require("react-native-uuid");
      uuidMock.v4.mockReturnValueOnce("set-1").mockReturnValueOnce("set-2");

      store.addSet("Starting Five", "team-1");
      store.addSet("Bench", "team-1");
      store.removeSet("set-1");

      const sets = useSetStore.getState().sets;
      expect(Object.keys(sets)).toHaveLength(1);
      expect(sets["set-2"]).toBeDefined();
      expect(sets["set-1"]).toBeUndefined();
    });
  });

  describe("Set Statistics Management", () => {
    beforeEach(() => {
      const store = useSetStore.getState();
      store.addSet("Test Set", "team-1");
    });

    it("should update set statistics", () => {
      const store = useSetStore.getState();

      store.updateStats("test-set-id", Stat.TwoPointMakes, 3);

      const set = useSetStore.getState().sets["test-set-id"];
      expect(set.stats[Stat.TwoPointMakes]).toBe(3);
    });

    it("should accumulate set statistics", () => {
      const store = useSetStore.getState();

      store.updateStats("test-set-id", Stat.TwoPointMakes, 2);
      store.updateStats("test-set-id", Stat.TwoPointMakes, 1);

      const set = useSetStore.getState().sets["test-set-id"];
      expect(set.stats[Stat.TwoPointMakes]).toBe(3);
    });

    it("should handle negative amounts (stat reversals)", () => {
      const store = useSetStore.getState();

      store.updateStats("test-set-id", Stat.TwoPointMakes, 5);
      store.updateStats("test-set-id", Stat.TwoPointMakes, -2);

      const set = useSetStore.getState().sets["test-set-id"];
      expect(set.stats[Stat.TwoPointMakes]).toBe(3);
    });

    it("should update multiple different stats", () => {
      const store = useSetStore.getState();

      store.updateStats("test-set-id", Stat.TwoPointMakes, 2);
      store.updateStats("test-set-id", Stat.ThreePointMakes, 1);
      store.updateStats("test-set-id", Stat.DefensiveRebounds, 5);

      const set = useSetStore.getState().sets["test-set-id"];
      expect(set.stats[Stat.TwoPointMakes]).toBe(2);
      expect(set.stats[Stat.ThreePointMakes]).toBe(1);
      expect(set.stats[Stat.DefensiveRebounds]).toBe(5);
    });

    it("should handle updating stats for undefined stat (initialize to 0)", () => {
      const store = useSetStore.getState();

      // Manually clear the stat to undefined to test initialization
      const currentSet = useSetStore.getState().sets["test-set-id"];
      currentSet.stats[Stat.TwoPointMakes] = undefined as any;

      store.updateStats("test-set-id", Stat.TwoPointMakes, 3);

      const set = useSetStore.getState().sets["test-set-id"];
      expect(set.stats[Stat.TwoPointMakes]).toBe(3);
    });

    it("should warn when updating stats for non-existent set", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      const store = useSetStore.getState();

      store.updateStats("non-existent", Stat.TwoPointMakes, 1);

      expect(consoleSpy).toHaveBeenCalledWith("Set with ID non-existent not found.");
      consoleSpy.mockRestore();
    });

    it("should preserve other set properties when updating stats", () => {
      const store = useSetStore.getState();
      const originalSet = { ...useSetStore.getState().sets["test-set-id"] };

      store.updateStats("test-set-id", Stat.TwoPointMakes, 3);

      const updatedSet = useSetStore.getState().sets["test-set-id"];
      expect(updatedSet.id).toBe(originalSet.id);
      expect(updatedSet.name).toBe(originalSet.name);
      expect(updatedSet.teamId).toBe(originalSet.teamId);
      expect(updatedSet.runCount).toBe(originalSet.runCount);
    });
  });

  describe("Run Count Management", () => {
    beforeEach(() => {
      const store = useSetStore.getState();
      store.addSet("Test Set", "team-1");
    });

    it("should increment run count", () => {
      const store = useSetStore.getState();

      store.incrementRunCount("test-set-id");

      const set = useSetStore.getState().sets["test-set-id"];
      expect(set.runCount).toBe(1);
    });

    it("should accumulate run count", () => {
      const store = useSetStore.getState();

      store.incrementRunCount("test-set-id");
      store.incrementRunCount("test-set-id");
      store.incrementRunCount("test-set-id");

      const set = useSetStore.getState().sets["test-set-id"];
      expect(set.runCount).toBe(3);
    });

    it("should handle undefined run count (initialize to 1)", () => {
      const store = useSetStore.getState();

      // Manually set run count to undefined to test initialization
      const currentSet = useSetStore.getState().sets["test-set-id"];
      currentSet.runCount = undefined as any;

      store.incrementRunCount("test-set-id");

      const set = useSetStore.getState().sets["test-set-id"];
      expect(set.runCount).toBe(1);
    });

    it("should warn when incrementing run count for non-existent set", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      const store = useSetStore.getState();

      store.incrementRunCount("non-existent");

      expect(consoleSpy).toHaveBeenCalledWith("Set with ID non-existent not found. Cannot remove.");
      consoleSpy.mockRestore();
    });

    it("should preserve other set properties when incrementing run count", () => {
      const store = useSetStore.getState();
      const originalSet = { ...useSetStore.getState().sets["test-set-id"] };

      store.incrementRunCount("test-set-id");

      const updatedSet = useSetStore.getState().sets["test-set-id"];
      expect(updatedSet.id).toBe(originalSet.id);
      expect(updatedSet.name).toBe(originalSet.name);
      expect(updatedSet.teamId).toBe(originalSet.teamId);
      expect(updatedSet.stats).toEqual(originalSet.stats);
    });
  });

  describe("Data Integrity", () => {
    it("should maintain separate set states", () => {
      const store = useSetStore.getState();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const uuidMock = require("react-native-uuid");
      uuidMock.v4.mockReturnValueOnce("set-1").mockReturnValueOnce("set-2");

      store.addSet("Starting Five", "team-1");
      store.addSet("Bench", "team-2");

      store.updateStats("set-1", Stat.TwoPointMakes, 5);
      store.updateStats("set-2", Stat.ThreePointMakes, 3);

      store.incrementRunCount("set-1");
      store.incrementRunCount("set-1");

      const sets = useSetStore.getState().sets;

      // Verify set-1 state
      expect(sets["set-1"].stats[Stat.TwoPointMakes]).toBe(5);
      expect(sets["set-1"].stats[Stat.ThreePointMakes]).toBe(0);
      expect(sets["set-1"].runCount).toBe(2);
      expect(sets["set-1"].teamId).toBe("team-1");

      // Verify set-2 state (should have initial stats + the three pointers we added)
      expect(sets["set-2"].stats[Stat.TwoPointMakes]).toBe(0); // Should be initialized from createSet
      expect(sets["set-2"].stats[Stat.ThreePointMakes]).toBe(3);
      expect(sets["set-2"].runCount).toBe(0);
      expect(sets["set-2"].teamId).toBe("team-2");
    });

    it("should handle mixed operations on multiple sets", () => {
      const store = useSetStore.getState();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const uuidMock = require("react-native-uuid");
      uuidMock.v4
        .mockReturnValueOnce("set-1")
        .mockReturnValueOnce("set-2")
        .mockReturnValueOnce("set-3");

      // Add multiple sets
      store.addSet("Set 1", "team-1");
      store.addSet("Set 2", "team-1");
      store.addSet("Set 3", "team-2");

      // Update stats and run counts
      store.updateStats("set-1", Stat.Points, 10);
      store.incrementRunCount("set-2");
      store.updateStats("set-3", Stat.Assists, 3);

      // Remove one set
      store.removeSet("set-2");

      const sets = useSetStore.getState().sets;
      expect(Object.keys(sets)).toHaveLength(2);
      expect(sets["set-1"].stats[Stat.Points]).toBe(10);
      expect(sets["set-3"].stats[Stat.Assists]).toBe(3);
      expect(sets["set-2"]).toBeUndefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero amounts in stat updates", () => {
      const store = useSetStore.getState();
      store.addSet("Test Set", "team-1");

      store.updateStats("test-set-id", Stat.TwoPointMakes, 0);

      const set = useSetStore.getState().sets["test-set-id"];
      expect(set.stats[Stat.TwoPointMakes]).toBe(0);
    });

    it("should handle large stat values", () => {
      const store = useSetStore.getState();
      store.addSet("Test Set", "team-1");

      store.updateStats("test-set-id", Stat.Points, 999);
      store.incrementRunCount("test-set-id");

      const set = useSetStore.getState().sets["test-set-id"];
      expect(set.stats[Stat.Points]).toBe(999);
      expect(set.runCount).toBe(1);
    });

    it("should handle empty string names gracefully", () => {
      const store = useSetStore.getState();

      store.addSet("", "team-1");

      const set = useSetStore.getState().sets["test-set-id"];
      expect(set.name).toBe("");
      expect(set.teamId).toBe("team-1");
    });

    it("should maintain state consistency after multiple operations", () => {
      const store = useSetStore.getState();
      store.addSet("Test Set", "team-1");

      // Perform multiple operations
      for (let i = 0; i < 10; i++) {
        store.updateStats("test-set-id", Stat.TwoPointMakes, 1);
        store.incrementRunCount("test-set-id");
      }

      const set = useSetStore.getState().sets["test-set-id"];
      expect(set.stats[Stat.TwoPointMakes]).toBe(10);
      expect(set.runCount).toBe(10);
    });
  });
});
