import { Stat, StatsType, initialBaseStats } from "@/types/stats";
import { Team } from "@/types/game";
import { Result } from "@/types/player";

/**
 * Pure function to calculate updated box score for a player
 */
export const calculateUpdatedBoxScore = (
  currentBoxScore: StatsType | undefined,
  stat: Stat,
  amount: number
): StatsType => {
  const playerBoxScore: StatsType = currentBoxScore
    ? { ...currentBoxScore }
    : { ...initialBaseStats };

  playerBoxScore[stat] = (playerBoxScore[stat] || 0) + amount;
  return playerBoxScore;
};

/**
 * Pure function to calculate updated stat totals for a team
 */
export const calculateUpdatedStatTotals = (
  currentStatTotals: Record<Team, StatsType>,
  stat: Stat,
  amount: number,
  team: Team
): Record<Team, StatsType> => {
  return {
    ...currentStatTotals,
    [team]: {
      ...currentStatTotals[team],
      [stat]: (currentStatTotals[team][stat] || 0) + amount,
    },
  };
};

/**
 * Pure function to calculate plus/minus adjustment
 */
export const calculatePlusMinusAmount = (team: Team, amount: number): number => {
  const result = team === Team.Opponent ? -amount : amount;
  return result === -0 ? 0 : result;
};

/**
 * Pure function to update game numbers (wins/losses/draws)
 */
export interface GameNumbers {
  wins?: number;
  losses?: number;
  draws?: number;
  gamesPlayed: number;
}

export const calculateUpdatedGameNumbers = (
  currentGameNumbers: GameNumbers,
  result: Result
): GameNumbers => {
  return {
    ...currentGameNumbers,
    [result]: (currentGameNumbers[result] || 0) + 1,
    gamesPlayed: (currentGameNumbers.gamesPlayed || 0) + 1,
  };
};

/**
 * Pure function to revert game numbers
 */
export const calculateRevertedGameNumbers = (
  currentGameNumbers: GameNumbers,
  result: Result
): GameNumbers => {
  return {
    ...currentGameNumbers,
    [result]: Math.max(0, (currentGameNumbers[result] || 0) - 1),
    gamesPlayed: Math.max(0, currentGameNumbers.gamesPlayed - 1),
  };
};

/**
 * Pure function to update player stats
 */
export const calculateUpdatedPlayerStats = (
  currentStats: StatsType,
  stat: Stat,
  amount: number
): StatsType => {
  return {
    ...currentStats,
    [stat]: (currentStats[stat] || 0) + amount,
  };
};

/**
 * Pure function to update team stats for a specific team side
 */
export const calculateUpdatedTeamStats = (
  currentTeamStats: Record<Team, StatsType>,
  stat: Stat,
  amount: number,
  team: Team
): Record<Team, StatsType> => {
  return {
    ...currentTeamStats,
    [team]: {
      ...currentTeamStats[team],
      [stat]: (currentTeamStats[team][stat] || 0) + amount,
    },
  };
};

/**
 * Pure function to calculate if a set run should be incremented
 * Returns true if the play concludes a possession
 */
export const shouldIncrementSetRun = (
  selectedPlayer: string,
  stats: Stat[],
  freeThrowToggle: boolean
): boolean => {
  if (selectedPlayer === "Opponent") {
    return false;
  }

  const newActionPostFreeThrow =
    freeThrowToggle === true &&
    (!stats.includes(Stat.FreeThrowsMade) ||
      !stats.includes(Stat.FreeThrowsAttempted));

  return (
    stats.includes(Stat.TwoPointMakes) ||
    stats.includes(Stat.TwoPointAttempts) ||
    stats.includes(Stat.ThreePointMakes) ||
    stats.includes(Stat.ThreePointAttempts) ||
    stats.includes(Stat.Turnovers) ||
    newActionPostFreeThrow
  );
};

/**
 * Pure function to determine if free throw toggle should be set
 */
export const shouldSetFreeThrowToggle = (stats: Stat[]): boolean => {
  return (
    stats.includes(Stat.FreeThrowsMade) ||
    stats.includes(Stat.FreeThrowsAttempted)
  );
};

/**
 * Utility type for stat update operations
 */
export interface StatUpdateOperations {
  updateBoxScore?: {
    gameId: string;
    playerId: string;
    stat: Stat;
    amount: number;
  };
  updateTotals?: {
    gameId: string;
    stat: Stat;
    amount: number;
    team: Team;
  };
  updatePeriods?: {
    gameId: string;
    playerId: string;
    stat: Stat;
    period: number;
    team: Team;
  };
  updateTeamStats?: {
    teamId: string;
    stat: Stat;
    amount: number;
    team: Team;
  };
  updatePlayerStats?: {
    playerId: string;
    stat: Stat;
    amount: number;
  };
  updateSetStats?: {
    setId: string;
    stat: Stat;
    amount: number;
  };
}

/**
 * Creates stat update operations for a given action
 */
export const createStatUpdateOperations = (
  gameId: string,
  teamId: string,
  playerId: string,
  setId: string,
  stats: Stat[]
): StatUpdateOperations[] => {
  return stats.map((stat) => ({
    updateBoxScore: { gameId, playerId, stat, amount: 1 },
    updateTotals: { gameId, stat, amount: 1, team: Team.Us },
    updateTeamStats: { teamId, stat, amount: 1, team: Team.Us },
    updatePlayerStats: { playerId, stat, amount: 1 },
    updateSetStats: { setId, stat, amount: 1 },
  }));
};
