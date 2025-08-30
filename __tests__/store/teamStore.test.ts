import { useTeamStore } from "@/store/teamStore";
import { Result } from "@/types/player";
import { Stat } from "@/types/stats";
import { Team } from "@/types/game";

// Mock UUID for consistent IDs
jest.mock("react-native-uuid", () => ({
  v4: jest.fn(() => "test-team-id"),
}));

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock Expo FileSystem
jest.mock("expo-file-system", () => ({
  documentDirectory: "file://test-directory/",
  copyAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock zustand to bypass persistence for testing
jest.mock("zustand/middleware", () => ({
  persist: (fn: any) => fn,
  createJSONStorage: () => ({}),
}));

describe("Team Store", () => {
  beforeEach(() => {
    // Reset store state before each test
    useTeamStore.getState().teams = {};
    useTeamStore.getState().currentTeamId = "";
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clear all store state after tests
    useTeamStore.getState().teams = {};
    useTeamStore.getState().currentTeamId = "";
  });

  describe("Team CRUD Operations", () => {
    it("should add a new team without image", async () => {
      const store = useTeamStore.getState();

      await store.addTeam("Lakers");

      const teams = useTeamStore.getState().teams;
      expect(Object.keys(teams)).toHaveLength(1);
      expect(teams["test-team-id"]).toBeDefined();
      expect(teams["test-team-id"].name).toBe("Lakers");
      expect(teams["test-team-id"].imageUri).toBeUndefined();
      expect(teams["test-team-id"].gameNumbers.gamesPlayed).toBe(0);
      expect(teams["test-team-id"].stats[Team.Us][Stat.Points]).toBe(0);
      expect(teams["test-team-id"].stats[Team.Opponent][Stat.Points]).toBe(0);
    });

    it("should add a new team with image", async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mockFileSystem = require("expo-file-system");
      const store = useTeamStore.getState();

      await store.addTeam("Warriors", "file://team-logo.jpg");

      expect(mockFileSystem.copyAsync).toHaveBeenCalled();
      const teams = useTeamStore.getState().teams;
      expect(teams["test-team-id"].imageUri).toContain("file://test-directory/");
      expect(teams["test-team-id"].imageUri).toContain("team-logo.jpg");
    });

    it("should remove a team", async () => {
      const store = useTeamStore.getState();

      // First add a team
      await store.addTeam("Lakers");
      expect(Object.keys(useTeamStore.getState().teams)).toHaveLength(1);

      // Then remove the team
      store.removeTeam("test-team-id");
      expect(Object.keys(useTeamStore.getState().teams)).toHaveLength(0);
    });

    it("should warn and not crash when removing non-existent team", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      const store = useTeamStore.getState();

      store.removeTeam("non-existent-id");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Team with ID non-existent-id not found. Cannot remove.",
      );
      expect(Object.keys(useTeamStore.getState().teams)).toHaveLength(0);
      consoleSpy.mockRestore();
    });
  });

  describe("Current Team Management", () => {
    beforeEach(async () => {
      const store = useTeamStore.getState();
      await store.addTeam("Lakers");
    });

    it("should set current team ID", () => {
      const store = useTeamStore.getState();

      store.setCurrentTeamId("test-team-id");

      expect(useTeamStore.getState().currentTeamId).toBe("test-team-id");
    });

    it("should update current team ID", () => {
      const store = useTeamStore.getState();

      store.setCurrentTeamId("team-1");
      expect(useTeamStore.getState().currentTeamId).toBe("team-1");

      store.setCurrentTeamId("team-2");
      expect(useTeamStore.getState().currentTeamId).toBe("team-2");
    });

    it("should clear current team ID", () => {
      const store = useTeamStore.getState();

      store.setCurrentTeamId("test-team-id");
      expect(useTeamStore.getState().currentTeamId).toBe("test-team-id");

      store.setCurrentTeamId("");
      expect(useTeamStore.getState().currentTeamId).toBe("");
    });
  });

  describe("Game Statistics Updates", () => {
    beforeEach(async () => {
      const store = useTeamStore.getState();
      await store.addTeam("Lakers");
    });

    it("should update games played for wins", () => {
      const store = useTeamStore.getState();

      store.updateGamesPlayed("test-team-id", Result.Win);

      const team = useTeamStore.getState().teams["test-team-id"];
      expect(team.gameNumbers.wins).toBe(1);
      expect(team.gameNumbers.gamesPlayed).toBe(1);
      expect(team.gameNumbers.losses).toBe(0);
      expect(team.gameNumbers.draws).toBe(0);
    });

    it("should update games played for losses", () => {
      const store = useTeamStore.getState();

      store.updateGamesPlayed("test-team-id", Result.Loss);

      const team = useTeamStore.getState().teams["test-team-id"];
      expect(team.gameNumbers.losses).toBe(1);
      expect(team.gameNumbers.gamesPlayed).toBe(1);
      expect(team.gameNumbers.wins).toBe(0);
      expect(team.gameNumbers.draws).toBe(0);
    });

    it("should update games played for draws", () => {
      const store = useTeamStore.getState();

      store.updateGamesPlayed("test-team-id", Result.Draw);

      const team = useTeamStore.getState().teams["test-team-id"];
      expect(team.gameNumbers.draws).toBe(1);
      expect(team.gameNumbers.gamesPlayed).toBe(1);
      expect(team.gameNumbers.wins).toBe(0);
      expect(team.gameNumbers.losses).toBe(0);
    });

    it("should accumulate game numbers", () => {
      const store = useTeamStore.getState();

      store.updateGamesPlayed("test-team-id", Result.Win);
      store.updateGamesPlayed("test-team-id", Result.Win);
      store.updateGamesPlayed("test-team-id", Result.Loss);
      store.updateGamesPlayed("test-team-id", Result.Draw);

      const team = useTeamStore.getState().teams["test-team-id"];
      expect(team.gameNumbers.wins).toBe(2);
      expect(team.gameNumbers.losses).toBe(1);
      expect(team.gameNumbers.draws).toBe(1);
      expect(team.gameNumbers.gamesPlayed).toBe(4);
    });

    it("should warn when updating games for non-existent team", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      const store = useTeamStore.getState();

      store.updateGamesPlayed("non-existent", Result.Win);

      expect(consoleSpy).toHaveBeenCalledWith("Team with ID non-existent not found.");
      consoleSpy.mockRestore();
    });
  });

  describe("Game Statistics Reversion", () => {
    beforeEach(async () => {
      const store = useTeamStore.getState();
      await store.addTeam("Lakers");
      // Add some games first
      store.updateGamesPlayed("test-team-id", Result.Win);
      store.updateGamesPlayed("test-team-id", Result.Win);
      store.updateGamesPlayed("test-team-id", Result.Loss);
    });

    it("should revert win statistics", () => {
      const store = useTeamStore.getState();

      store.revertGameNumbers("test-team-id", Result.Win);

      const team = useTeamStore.getState().teams["test-team-id"];
      expect(team.gameNumbers.wins).toBe(1);
      expect(team.gameNumbers.losses).toBe(1);
      expect(team.gameNumbers.draws).toBe(0);
      expect(team.gameNumbers.gamesPlayed).toBe(2);
    });

    it("should revert loss statistics", () => {
      const store = useTeamStore.getState();

      store.revertGameNumbers("test-team-id", Result.Loss);

      const team = useTeamStore.getState().teams["test-team-id"];
      expect(team.gameNumbers.wins).toBe(2);
      expect(team.gameNumbers.losses).toBe(0);
      expect(team.gameNumbers.draws).toBe(0);
      expect(team.gameNumbers.gamesPlayed).toBe(2);
    });

    it("should not go below zero when reverting", () => {
      const store = useTeamStore.getState();

      // Revert more draws than exist
      store.revertGameNumbers("test-team-id", Result.Draw);
      store.revertGameNumbers("test-team-id", Result.Draw);

      const team = useTeamStore.getState().teams["test-team-id"];
      expect(team.gameNumbers.draws).toBe(0);
      expect(team.gameNumbers.gamesPlayed).toBeGreaterThanOrEqual(0);
    });

    it("should warn when reverting games for non-existent team", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      const store = useTeamStore.getState();

      store.revertGameNumbers("non-existent", Result.Win);

      expect(consoleSpy).toHaveBeenCalledWith("Team with ID non-existent not found.");
      consoleSpy.mockRestore();
    });
  });

  describe("Team Statistics Updates", () => {
    beforeEach(async () => {
      const store = useTeamStore.getState();
      await store.addTeam("Lakers");
    });

    it("should update team statistics for us", () => {
      const store = useTeamStore.getState();

      store.updateStats("test-team-id", Stat.Points, 15, Team.Us);

      const team = useTeamStore.getState().teams["test-team-id"];
      expect(team.stats[Team.Us][Stat.Points]).toBe(15);
      expect(team.stats[Team.Opponent][Stat.Points]).toBe(0);
    });

    it("should update team statistics for opponent", () => {
      const store = useTeamStore.getState();

      store.updateStats("test-team-id", Stat.Points, 12, Team.Opponent);

      const team = useTeamStore.getState().teams["test-team-id"];
      expect(team.stats[Team.Us][Stat.Points]).toBe(0);
      expect(team.stats[Team.Opponent][Stat.Points]).toBe(12);
    });

    it("should accumulate team statistics", () => {
      const store = useTeamStore.getState();

      store.updateStats("test-team-id", Stat.Points, 10, Team.Us);
      store.updateStats("test-team-id", Stat.Points, 5, Team.Us);
      store.updateStats("test-team-id", Stat.Points, 8, Team.Opponent);

      const team = useTeamStore.getState().teams["test-team-id"];
      expect(team.stats[Team.Us][Stat.Points]).toBe(15);
      expect(team.stats[Team.Opponent][Stat.Points]).toBe(8);
    });

    it("should update different statistics independently", () => {
      const store = useTeamStore.getState();

      store.updateStats("test-team-id", Stat.Points, 20, Team.Us);
      store.updateStats("test-team-id", Stat.Assists, 8, Team.Us);
      store.updateStats("test-team-id", Stat.DefensiveRebounds, 12, Team.Us);
      store.updateStats("test-team-id", Stat.Points, 18, Team.Opponent);

      const team = useTeamStore.getState().teams["test-team-id"];
      expect(team.stats[Team.Us][Stat.Points]).toBe(20);
      expect(team.stats[Team.Us][Stat.Assists]).toBe(8);
      expect(team.stats[Team.Us][Stat.DefensiveRebounds]).toBe(12);
      expect(team.stats[Team.Opponent][Stat.Points]).toBe(18);
      expect(team.stats[Team.Opponent][Stat.Assists]).toBe(0);
    });

    it("should handle negative stat updates (reversals)", () => {
      const store = useTeamStore.getState();

      store.updateStats("test-team-id", Stat.Points, 25, Team.Us);
      store.updateStats("test-team-id", Stat.Points, -7, Team.Us);

      const team = useTeamStore.getState().teams["test-team-id"];
      expect(team.stats[Team.Us][Stat.Points]).toBe(18);
    });

    it("should warn when updating stats for non-existent team", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      const store = useTeamStore.getState();

      store.updateStats("non-existent", Stat.Points, 10, Team.Us);

      expect(consoleSpy).toHaveBeenCalledWith("Team with ID non-existent not found.");
      consoleSpy.mockRestore();
    });
  });

  describe("Data Integrity", () => {
    it("should maintain separate team data", async () => {
      const store = useTeamStore.getState();

      await store.addTeam("Lakers");
      const team1Id = "test-team-id";

      // Mock UUID to return different ID for second team
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mockUuid = require("react-native-uuid");
      mockUuid.v4.mockReturnValueOnce("test-team-id-2");

      await store.addTeam("Warriors");

      store.updateStats(team1Id, Stat.Points, 100, Team.Us);
      store.updateStats("test-team-id-2", Stat.Points, 110, Team.Us);
      store.updateGamesPlayed(team1Id, Result.Win);
      store.updateGamesPlayed("test-team-id-2", Result.Loss);

      const teams = useTeamStore.getState().teams;
      expect(teams[team1Id].stats[Team.Us][Stat.Points]).toBe(100);
      expect(teams["test-team-id-2"].stats[Team.Us][Stat.Points]).toBe(110);
      expect(teams[team1Id].gameNumbers.wins).toBe(1);
      expect(teams["test-team-id-2"].gameNumbers.losses).toBe(1);
    });

    it("should preserve unchanged fields when updating", async () => {
      const store = useTeamStore.getState();

      await store.addTeam("Lakers", "file://logo.jpg");

      const originalTeam = useTeamStore.getState().teams["test-team-id"];
      const originalName = originalTeam.name;
      const originalImageUri = originalTeam.imageUri;

      store.updateStats("test-team-id", Stat.Points, 25, Team.Us);
      store.updateGamesPlayed("test-team-id", Result.Win);

      const updatedTeam = useTeamStore.getState().teams["test-team-id"];
      expect(updatedTeam.name).toBe(originalName);
      expect(updatedTeam.imageUri).toBe(originalImageUri);
      expect(updatedTeam.stats[Team.Us][Stat.Points]).toBe(25);
      expect(updatedTeam.gameNumbers.wins).toBe(1);
    });

    it("should maintain current team ID independently of team operations", async () => {
      const store = useTeamStore.getState();

      await store.addTeam("Lakers");
      store.setCurrentTeamId("test-team-id");

      expect(useTeamStore.getState().currentTeamId).toBe("test-team-id");

      store.updateStats("test-team-id", Stat.Points, 15, Team.Us);
      expect(useTeamStore.getState().currentTeamId).toBe("test-team-id");

      store.updateGamesPlayed("test-team-id", Result.Win);
      expect(useTeamStore.getState().currentTeamId).toBe("test-team-id");
    });
  });

  describe("Safe Team Retrieval", () => {
    beforeEach(async () => {
      const store = useTeamStore.getState();
      await store.addTeam("Lakers");
    });

    it("should return team when it exists", () => {
      const store = useTeamStore.getState();

      const team = store.getTeamSafely("test-team-id");

      expect(team).toBeDefined();
      expect(team?.name).toBe("Lakers");
    });

    it("should return undefined when team does not exist", () => {
      const store = useTeamStore.getState();

      const team = store.getTeamSafely("non-existent-id");

      expect(team).toBeNull();
    });

    it("should not log warnings for non-existent teams", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      const store = useTeamStore.getState();

      store.getTeamSafely("non-existent-id");

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("Error Edge Cases", () => {
    it("should handle reversion that would result in negative values", async () => {
      const store = useTeamStore.getState();
      await store.addTeam("Lakers");

      // Try to revert more wins than exist
      store.revertGameNumbers("test-team-id", Result.Win);
      store.revertGameNumbers("test-team-id", Result.Win);

      const team = useTeamStore.getState().teams["test-team-id"];
      expect(team.gameNumbers.wins).toBe(0);
      expect(team.gameNumbers.gamesPlayed).toBe(0);
    });

    it("should handle zero and negative stat updates correctly", async () => {
      const store = useTeamStore.getState();
      await store.addTeam("Lakers");

      store.updateStats("test-team-id", Stat.Points, 0, Team.Us);
      store.updateStats("test-team-id", Stat.Points, -5, Team.Us);

      const team = useTeamStore.getState().teams["test-team-id"];
      expect(team.stats[Team.Us][Stat.Points]).toBe(-5);
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined or null stat values gracefully", async () => {
      const store = useTeamStore.getState();

      await store.addTeam("Lakers");

      // The stats should initialize to 0, not undefined
      const team = useTeamStore.getState().teams["test-team-id"];
      expect(team.stats[Team.Us][Stat.Points]).toBe(0);
      expect(team.stats[Team.Opponent][Stat.Points]).toBe(0);

      // Updating should work even if the stat is initially undefined
      store.updateStats("test-team-id", Stat.Points, 12, Team.Us);
      expect(useTeamStore.getState().teams["test-team-id"].stats[Team.Us][Stat.Points]).toBe(12);
    });

    it("should handle undefined or null game number values gracefully", async () => {
      const store = useTeamStore.getState();

      await store.addTeam("Lakers");

      // The game numbers should initialize to 0
      const team = useTeamStore.getState().teams["test-team-id"];
      expect(team.gameNumbers.wins).toBe(0);
      expect(team.gameNumbers.gamesPlayed).toBe(0);

      // Updating should work correctly
      store.updateGamesPlayed("test-team-id", Result.Win);
      const updatedTeam = useTeamStore.getState().teams["test-team-id"];
      expect(updatedTeam.gameNumbers.wins).toBe(1);
      expect(updatedTeam.gameNumbers.gamesPlayed).toBe(1);
    });

    it("should handle empty current team ID", () => {
      const store = useTeamStore.getState();

      expect(useTeamStore.getState().currentTeamId).toBe("");

      store.setCurrentTeamId("some-team-id");
      expect(useTeamStore.getState().currentTeamId).toBe("some-team-id");

      store.setCurrentTeamId("");
      expect(useTeamStore.getState().currentTeamId).toBe("");
    });
  });
});
