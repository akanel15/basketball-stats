import { useTeamStore } from "@/store/teamStore";
import { usePlayerStore } from "@/store/playerStore";
import { useGameStore } from "@/store/gameStore";
import { useSetStore } from "@/store/setStore";
import { Team } from "@/types/game";
import { Stat } from "@/types/stats";
import {
  auditGameCounts,
  correctGameCounts,
  type GameCountAuditResult,
} from "@/utils/gameCountAudit";

export type IssueLevel = "info" | "warning" | "error";

export type ValidationIssue = {
  id: string;
  level: IssueLevel;
  title: string;
  description: string;
  entityType: "team" | "player" | "game" | "set";
  entityId?: string;
  entityName?: string;
  fixable: boolean;
  fixAction?: () => void;
  inspectAction?: () => void;
};

export type StoreValidationReport = {
  storeType: "teams" | "players" | "games" | "sets";
  totalEntities: number;
  issues: ValidationIssue[];
  healthScore: number; // 0-100
};

export type GlobalValidationReport = {
  storeReports: StoreValidationReport[];
  gameCountAudit: GameCountAuditResult;
  globalIssues: ValidationIssue[];
  overallHealthScore: number;
  totalIssues: number;
};

let issueIdCounter = 0;
function generateIssueId(): string {
  return `issue_${++issueIdCounter}_${Date.now()}`;
}

/**
 * Validates team store for common issues
 */
function validateTeams(): StoreValidationReport {
  const teamState = useTeamStore.getState();
  const teams = Object.values(teamState.teams);
  const issues: ValidationIssue[] = [];

  // Check for teams without names
  teams.forEach((team) => {
    if (!team.name || team.name.trim() === "") {
      issues.push({
        id: generateIssueId(),
        level: "error",
        title: "Team Missing Name",
        description: "Team has no name or empty name",
        entityType: "team",
        entityId: team.id,
        entityName: team.name || "<No Name>",
        fixable: false,
      });
    }

    // Check for negative game numbers
    const gameNumbers = team.gameNumbers;
    if (
      gameNumbers.wins < 0 ||
      gameNumbers.losses < 0 ||
      gameNumbers.draws < 0 ||
      gameNumbers.gamesPlayed < 0
    ) {
      issues.push({
        id: generateIssueId(),
        level: "error",
        title: "Negative Game Numbers",
        description: `Team has negative values: W:${gameNumbers.wins} L:${gameNumbers.losses} D:${gameNumbers.draws} Total:${gameNumbers.gamesPlayed}`,
        entityType: "team",
        entityId: team.id,
        entityName: team.name,
        fixable: true,
        fixAction: () => {
          const state = useTeamStore.getState();
          const teamToFix = state.teams[team.id];
          if (teamToFix) {
            useTeamStore.setState({
              teams: {
                ...state.teams,
                [team.id]: {
                  ...teamToFix,
                  gameNumbers: {
                    wins: Math.max(0, gameNumbers.wins),
                    losses: Math.max(0, gameNumbers.losses),
                    draws: Math.max(0, gameNumbers.draws),
                    gamesPlayed: Math.max(0, gameNumbers.gamesPlayed),
                  },
                },
              },
            });
          }
        },
      });
    }

    // Check for inconsistent game totals
    const calculatedTotal =
      gameNumbers.wins + gameNumbers.losses + gameNumbers.draws;
    if (gameNumbers.gamesPlayed !== calculatedTotal) {
      issues.push({
        id: generateIssueId(),
        level: "warning",
        title: "Inconsistent Game Total",
        description: `Games played (${gameNumbers.gamesPlayed}) doesn't match sum of W+L+D (${calculatedTotal})`,
        entityType: "team",
        entityId: team.id,
        entityName: team.name,
        fixable: true,
        fixAction: () => {
          const state = useTeamStore.getState();
          const teamToFix = state.teams[team.id];
          if (teamToFix) {
            useTeamStore.setState({
              teams: {
                ...state.teams,
                [team.id]: {
                  ...teamToFix,
                  gameNumbers: {
                    ...gameNumbers,
                    gamesPlayed: calculatedTotal,
                  },
                },
              },
            });
          }
        },
      });
    }
  });

  // Check for invalid current team selection
  if (teamState.currentTeamId && !teamState.teams[teamState.currentTeamId]) {
    issues.push({
      id: generateIssueId(),
      level: "warning",
      title: "Invalid Current Team",
      description: `Current team ID "${teamState.currentTeamId}" doesn't exist`,
      entityType: "team",
      entityId: teamState.currentTeamId,
      fixable: true,
      fixAction: () => {
        useTeamStore.setState({ currentTeamId: "" });
      },
    });
  }

  const healthScore = Math.max(0, 100 - issues.length * 10);

  return {
    storeType: "teams",
    totalEntities: teams.length,
    issues,
    healthScore,
  };
}

/**
 * Validates player store for common issues
 */
function validatePlayers(): StoreValidationReport {
  const playerState = usePlayerStore.getState();
  const teamState = useTeamStore.getState();
  const players = Object.values(playerState.players);
  const issues: ValidationIssue[] = [];

  players.forEach((player) => {
    // Check for orphaned players (team doesn't exist)
    if (!teamState.teams[player.teamId]) {
      issues.push({
        id: generateIssueId(),
        level: "error",
        title: "Orphaned Player",
        description: `Player belongs to non-existent team "${player.teamId}" - can be deleted`,
        entityType: "player",
        entityId: player.id,
        entityName: player.name,
        fixable: true,
        fixAction: () => {
          const state = usePlayerStore.getState();
          if (state.players[player.id]) {
            const { [player.id]: removed, ...remainingPlayers } = state.players;
            usePlayerStore.setState({
              players: remainingPlayers,
            });
          }
        },
      });
    }

    // Check for players without names
    if (!player.name || player.name.trim() === "") {
      issues.push({
        id: generateIssueId(),
        level: "error",
        title: "Player Missing Name",
        description: "Player has no name or empty name",
        entityType: "player",
        entityId: player.id,
        entityName: `#${player.number}`,
        fixable: false,
      });
    }

    // Check for unrealistic negative stats (excluding plus/minus which can be negative)
    const stats = player.stats;
    const invalidNegativeStats = Object.entries(stats).filter(
      ([stat, value]) => {
        // Plus/minus can be negative in basketball - it's normal!
        if (stat === Stat.PlusMinus) return false;
        // All other stats should be non-negative
        return value < 0;
      },
    );

    if (invalidNegativeStats.length > 0) {
      issues.push({
        id: generateIssueId(),
        level: "error",
        title: "Invalid Negative Player Stats",
        description: `Player has invalid negative stats: ${invalidNegativeStats.map(([stat, val]) => `${stat}:${val}`).join(", ")}`,
        entityType: "player",
        entityId: player.id,
        entityName: player.name,
        fixable: true,
        fixAction: () => {
          const state = usePlayerStore.getState();
          const playerToFix = state.players[player.id];
          if (playerToFix) {
            const fixedStats = { ...playerToFix.stats };
            Object.entries(fixedStats).forEach(([stat, value]) => {
              // Don't "fix" plus/minus - it can legitimately be negative
              if (stat !== Stat.PlusMinus && value < 0) {
                (fixedStats as any)[stat] = 0;
              }
            });

            usePlayerStore.setState({
              players: {
                ...state.players,
                [player.id]: {
                  ...playerToFix,
                  stats: fixedStats,
                },
              },
            });
          }
        },
      });
    }
  });

  const healthScore = Math.max(0, 100 - issues.length * 8);

  return {
    storeType: "players",
    totalEntities: players.length,
    issues,
    healthScore,
  };
}

/**
 * Validates game store for common issues
 */
function validateGames(): StoreValidationReport {
  const gameState = useGameStore.getState();
  const teamState = useTeamStore.getState();
  const playerState = usePlayerStore.getState();
  const games = Object.values(gameState.games);
  const issues: ValidationIssue[] = [];

  games.forEach((game) => {
    // Check for orphaned games (team doesn't exist)
    if (!teamState.teams[game.teamId]) {
      issues.push({
        id: generateIssueId(),
        level: "error",
        title: "Orphaned Game",
        description: `Game belongs to non-existent team "${game.teamId}" - can be deleted`,
        entityType: "game",
        entityId: game.id,
        entityName: `vs ${game.opposingTeamName}`,
        fixable: true,
        fixAction: () => {
          const state = useGameStore.getState();
          if (state.games[game.id]) {
            const { [game.id]: removed, ...remainingGames } = state.games;
            useGameStore.setState({
              games: remainingGames,
            });
          }
        },
      });
    }

    // Check for invalid active players (players that don't exist)
    const invalidActivePlayers = game.activePlayers.filter(
      (playerId) => !playerState.players[playerId],
    );
    if (invalidActivePlayers.length > 0) {
      issues.push({
        id: generateIssueId(),
        level: "warning",
        title: "Invalid Active Players",
        description: `Game references ${invalidActivePlayers.length} non-existent players`,
        entityType: "game",
        entityId: game.id,
        entityName: `vs ${game.opposingTeamName}`,
        fixable: true,
        fixAction: () => {
          const state = useGameStore.getState();
          const gameToFix = state.games[game.id];
          if (gameToFix) {
            useGameStore.setState({
              games: {
                ...state.games,
                [game.id]: {
                  ...gameToFix,
                  activePlayers: gameToFix.activePlayers.filter(
                    (playerId) => playerState.players[playerId],
                  ),
                },
              },
            });
          }
        },
      });
    }

    // Check for period score inconsistencies in finished games
    if (game.isFinished && game.periods && game.periods.length > 0) {
      try {
        const periodTotalUs = game.periods.reduce((sum, period) => {
          return (
            sum +
            (period && period[Team.Us] !== undefined ? period[Team.Us] : 0)
          );
        }, 0);

        const periodTotalOpp = game.periods.reduce((sum, period) => {
          return (
            sum +
            (period && period[Team.Opponent] !== undefined
              ? period[Team.Opponent]
              : 0)
          );
        }, 0);

        const statTotalUs =
          game.statTotals &&
          game.statTotals[Team.Us] &&
          game.statTotals[Team.Us][Stat.Points]
            ? game.statTotals[Team.Us][Stat.Points]
            : 0;
        const statTotalOpp =
          game.statTotals &&
          game.statTotals[Team.Opponent] &&
          game.statTotals[Team.Opponent][Stat.Points]
            ? game.statTotals[Team.Opponent][Stat.Points]
            : 0;

        if (periodTotalUs !== statTotalUs || periodTotalOpp !== statTotalOpp) {
          issues.push({
            id: generateIssueId(),
            level: "warning",
            title: "Score Inconsistency",
            description: `Period totals (${periodTotalUs}-${periodTotalOpp}) don't match stat totals (${statTotalUs}-${statTotalOpp})`,
            entityType: "game",
            entityId: game.id,
            entityName: `vs ${game.opposingTeamName}`,
            fixable: true,
            fixAction: () => {
              const state = useGameStore.getState();
              const gameToFix = state.games[game.id];
              if (gameToFix && gameToFix.statTotals) {
                const updatedStatTotals = { ...gameToFix.statTotals };
                if (updatedStatTotals[Team.Us]) {
                  updatedStatTotals[Team.Us] = {
                    ...updatedStatTotals[Team.Us],
                    [Stat.Points]: periodTotalUs,
                  };
                }
                if (updatedStatTotals[Team.Opponent]) {
                  updatedStatTotals[Team.Opponent] = {
                    ...updatedStatTotals[Team.Opponent],
                    [Stat.Points]: periodTotalOpp,
                  };
                }

                useGameStore.setState({
                  games: {
                    ...state.games,
                    [game.id]: {
                      ...gameToFix,
                      statTotals: updatedStatTotals,
                    },
                  },
                });
              }
            },
          });
        }
      } catch (error) {
        console.warn("Error validating game periods for game:", game.id, error);
        // Skip this validation for this game if there's an error
      }
    }
  });

  const healthScore = Math.max(0, 100 - issues.length * 12);

  return {
    storeType: "games",
    totalEntities: games.length,
    issues,
    healthScore,
  };
}

/**
 * Validates set store for common issues
 */
function validateSets(): StoreValidationReport {
  const setState = useSetStore.getState();
  const teamState = useTeamStore.getState();
  const sets = Object.values(setState.sets);
  const issues: ValidationIssue[] = [];

  sets.forEach((set) => {
    // Check for orphaned sets (team doesn't exist)
    if (!teamState.teams[set.teamId]) {
      issues.push({
        id: generateIssueId(),
        level: "error",
        title: "Orphaned Set",
        description: `Set belongs to non-existent team "${set.teamId}" - can be deleted`,
        entityType: "set",
        entityId: set.id,
        entityName: set.name,
        fixable: true,
        fixAction: () => {
          const state = useSetStore.getState();
          if (state.sets[set.id]) {
            const { [set.id]: removed, ...remainingSets } = state.sets;
            useSetStore.setState({
              sets: remainingSets,
            });
          }
        },
      });
    }

    // Check for sets without names
    if (!set.name || set.name.trim() === "") {
      issues.push({
        id: generateIssueId(),
        level: "error",
        title: "Set Missing Name",
        description: "Set has no name or empty name",
        entityType: "set",
        entityId: set.id,
        entityName: "<No Name>",
        fixable: false,
      });
    }

    // Check for negative run count
    if (set.runCount < 0) {
      issues.push({
        id: generateIssueId(),
        level: "error",
        title: "Negative Run Count",
        description: `Set has negative run count: ${set.runCount}`,
        entityType: "set",
        entityId: set.id,
        entityName: set.name,
        fixable: true,
        fixAction: () => {
          const state = useSetStore.getState();
          const setToFix = state.sets[set.id];
          if (setToFix) {
            useSetStore.setState({
              sets: {
                ...state.sets,
                [set.id]: {
                  ...setToFix,
                  runCount: 0,
                },
              },
            });
          }
        },
      });
    }

    // Check for unrealistic negative stats (excluding plus/minus)
    const stats = set.stats;
    const invalidNegativeStats = Object.entries(stats).filter(
      ([stat, value]) => {
        // Plus/minus can be negative in basketball - it's normal!
        if (stat === Stat.PlusMinus) return false;
        // All other stats should be non-negative
        return value < 0;
      },
    );

    if (invalidNegativeStats.length > 0) {
      issues.push({
        id: generateIssueId(),
        level: "error",
        title: "Invalid Negative Set Stats",
        description: `Set has invalid negative stats: ${invalidNegativeStats.map(([stat, val]) => `${stat}:${val}`).join(", ")}`,
        entityType: "set",
        entityId: set.id,
        entityName: set.name,
        fixable: true,
        fixAction: () => {
          const state = useSetStore.getState();
          const setToFix = state.sets[set.id];
          if (setToFix) {
            const fixedStats = { ...setToFix.stats };
            Object.entries(fixedStats).forEach(([stat, value]) => {
              // Don't "fix" plus/minus - it can legitimately be negative
              if (stat !== Stat.PlusMinus && value < 0) {
                (fixedStats as any)[stat] = 0;
              }
            });

            useSetStore.setState({
              sets: {
                ...state.sets,
                [set.id]: {
                  ...setToFix,
                  stats: fixedStats,
                },
              },
            });
          }
        },
      });
    }
  });

  const healthScore = Math.max(0, 100 - issues.length * 15);

  return {
    storeType: "sets",
    totalEntities: sets.length,
    issues,
    healthScore,
  };
}

/**
 * Runs comprehensive validation across all stores
 */
export function runFullValidation(): GlobalValidationReport {
  console.log("🔍 Running full data validation...");

  const storeReports: StoreValidationReport[] = [
    validateTeams(),
    validatePlayers(),
    validateGames(),
    validateSets(),
  ];

  const gameCountAudit = auditGameCounts();

  // Convert game count discrepancies to validation issues
  const globalIssues: ValidationIssue[] = [];

  // Add team game count issues
  gameCountAudit.teamAudit.forEach((teamAudit) => {
    if (teamAudit.discrepancy.gamesPlayed !== 0) {
      globalIssues.push({
        id: generateIssueId(),
        level: "warning",
        title: "Game Count Mismatch (Team)",
        description: `${teamAudit.teamName} has incorrect game counts (off by ${teamAudit.discrepancy.gamesPlayed})`,
        entityType: "team",
        entityId: teamAudit.teamId,
        entityName: teamAudit.teamName,
        fixable: true,
        fixAction: () => {
          correctGameCounts();
        },
      });
    }
  });

  // Add player game count issues (summarized)
  const playersWithIssues = gameCountAudit.playerAudit.filter(
    (p) => p.discrepancy.gamesPlayed !== 0,
  );
  if (playersWithIssues.length > 0) {
    globalIssues.push({
      id: generateIssueId(),
      level: "warning",
      title: "Game Count Mismatch (Players)",
      description: `${playersWithIssues.length} players have incorrect game counts`,
      entityType: "player",
      fixable: true,
      fixAction: () => {
        correctGameCounts();
      },
    });
  }

  const totalIssues =
    storeReports.reduce((sum, report) => sum + report.issues.length, 0) +
    globalIssues.length;
  const overallHealthScore =
    storeReports.reduce((sum, report) => sum + report.healthScore, 0) /
    storeReports.length;

  console.log(
    `✅ Validation complete: ${totalIssues} issues found, ${overallHealthScore.toFixed(1)}% health score`,
  );

  return {
    storeReports,
    gameCountAudit,
    globalIssues,
    overallHealthScore,
    totalIssues,
  };
}

/**
 * Fixes all auto-fixable issues
 */
export function fixAllAutoFixableIssues(): number {
  console.log("🔧 Auto-fixing all fixable issues...");

  const report = runFullValidation();
  let fixedCount = 0;

  // Fix store-specific issues
  report.storeReports.forEach((storeReport) => {
    storeReport.issues.forEach((issue) => {
      if (issue.fixable && issue.fixAction) {
        try {
          issue.fixAction();
          fixedCount++;
        } catch (error) {
          console.error(`Failed to fix issue ${issue.id}:`, error);
        }
      }
    });
  });

  // Fix global issues
  report.globalIssues.forEach((issue) => {
    if (issue.fixable && issue.fixAction) {
      try {
        issue.fixAction();
        fixedCount++;
      } catch (error) {
        console.error(`Failed to fix global issue ${issue.id}:`, error);
      }
    }
  });

  console.log(`✅ Fixed ${fixedCount} issues automatically`);
  return fixedCount;
}
