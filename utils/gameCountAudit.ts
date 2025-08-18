import { useGameStore } from "@/store/gameStore";
import { useTeamStore } from "@/store/teamStore";
import { usePlayerStore } from "@/store/playerStore";
import { Result } from "@/types/player";
import { Team } from "@/types/game";
import { Stat } from "@/types/stats";

export type GameCountAuditResult = {
  teamAudit: {
    teamId: string;
    teamName: string;
    currentCounts: {
      wins: number;
      losses: number;
      draws: number;
      gamesPlayed: number;
    };
    expectedCounts: {
      wins: number;
      losses: number;
      draws: number;
      gamesPlayed: number;
    };
    discrepancy: {
      wins: number;
      losses: number;
      draws: number;
      gamesPlayed: number;
    };
  }[];
  playerAudit: {
    playerId: string;
    playerName: string;
    teamId: string;
    currentCounts: {
      wins: number;
      losses: number;
      draws: number;
      gamesPlayed: number;
    };
    expectedCounts: {
      wins: number;
      losses: number;
      draws: number;
      gamesPlayed: number;
    };
    discrepancy: {
      wins: number;
      losses: number;
      draws: number;
      gamesPlayed: number;
    };
  }[];
  totalFinishedGames: number;
  gameDetails: {
    gameId: string;
    teamId: string;
    opposingTeam: string;
    result: Result;
    ourScore: number;
    opponentScore: number;
    playersInGame: string[];
  }[];
};

/**
 * Calculates the game result for a specific team
 */
function calculateGameResult(
  ourPoints: number,
  opponentPoints: number,
): Result {
  if (ourPoints > opponentPoints) {
    return Result.Win;
  } else if (ourPoints < opponentPoints) {
    return Result.Loss;
  } else {
    return Result.Draw;
  }
}

/**
 * Audits current game counts vs actual finished games
 */
export function auditGameCounts(): GameCountAuditResult {
  const games = useGameStore.getState().games;
  const teams = useTeamStore.getState().teams;
  const players = usePlayerStore.getState().players;

  // Get all finished games
  const finishedGames = Object.values(games).filter((game) => game.isFinished);

  console.log(`🔍 Found ${finishedGames.length} finished games`);

  // Initialize expected counts for teams and players
  const expectedTeamCounts: Record<
    string,
    { wins: number; losses: number; draws: number; gamesPlayed: number }
  > = {};
  const expectedPlayerCounts: Record<
    string,
    { wins: number; losses: number; draws: number; gamesPlayed: number }
  > = {};

  // Initialize all teams and players with zero counts
  Object.keys(teams).forEach((teamId) => {
    expectedTeamCounts[teamId] = {
      wins: 0,
      losses: 0,
      draws: 0,
      gamesPlayed: 0,
    };
  });

  Object.keys(players).forEach((playerId) => {
    expectedPlayerCounts[playerId] = {
      wins: 0,
      losses: 0,
      draws: 0,
      gamesPlayed: 0,
    };
  });

  // Process each finished game
  const gameDetails = finishedGames.map((game) => {
    const ourPoints = game.statTotals[Team.Us][Stat.Points] || 0;
    const opponentPoints = game.statTotals[Team.Opponent][Stat.Points] || 0;
    const result = calculateGameResult(ourPoints, opponentPoints);

    // Add to team counts
    if (expectedTeamCounts[game.teamId]) {
      expectedTeamCounts[game.teamId][result]++;
      expectedTeamCounts[game.teamId].gamesPlayed++;
    }

    // Add to player counts for all players who played in this game
    game.gamePlayedList.forEach((playerId) => {
      if (expectedPlayerCounts[playerId]) {
        expectedPlayerCounts[playerId][result]++;
        expectedPlayerCounts[playerId].gamesPlayed++;
      }
    });

    return {
      gameId: game.id,
      teamId: game.teamId,
      opposingTeam: game.opposingTeamName,
      result,
      ourScore: ourPoints,
      opponentScore: opponentPoints,
      playersInGame: game.gamePlayedList,
    };
  });

  // Generate team audit
  const teamAudit = Object.values(teams).map((team) => {
    const current = team.gameNumbers;
    const expected = expectedTeamCounts[team.id] || {
      wins: 0,
      losses: 0,
      draws: 0,
      gamesPlayed: 0,
    };

    return {
      teamId: team.id,
      teamName: team.name,
      currentCounts: {
        wins: current.wins,
        losses: current.losses,
        draws: current.draws,
        gamesPlayed: current.gamesPlayed,
      },
      expectedCounts: expected,
      discrepancy: {
        wins: current.wins - expected.wins,
        losses: current.losses - expected.losses,
        draws: current.draws - expected.draws,
        gamesPlayed: current.gamesPlayed - expected.gamesPlayed,
      },
    };
  });

  // Generate player audit
  const playerAudit = Object.values(players).map((player) => {
    const current = player.gameNumbers;
    const expected = expectedPlayerCounts[player.id] || {
      wins: 0,
      losses: 0,
      draws: 0,
      gamesPlayed: 0,
    };

    return {
      playerId: player.id,
      playerName: player.name,
      teamId: player.teamId,
      currentCounts: {
        wins: current.wins,
        losses: current.losses,
        draws: current.draws,
        gamesPlayed: current.gamesPlayed,
      },
      expectedCounts: expected,
      discrepancy: {
        wins: current.wins - expected.wins,
        losses: current.losses - expected.losses,
        draws: current.draws - expected.draws,
        gamesPlayed: current.gamesPlayed - expected.gamesPlayed,
      },
    };
  });

  return {
    teamAudit,
    playerAudit,
    totalFinishedGames: finishedGames.length,
    gameDetails,
  };
}

/**
 * Corrects game counts by recalculating from actual finished games
 */
export function correctGameCounts(): GameCountAuditResult {
  console.log("🔧 Starting game count correction...");

  const auditResult = auditGameCounts();

  // Apply corrections to team store
  auditResult.teamAudit.forEach((teamAudit) => {
    if (teamAudit.discrepancy.gamesPlayed !== 0) {
      console.log(
        `Correcting team ${teamAudit.teamName}:`,
        teamAudit.discrepancy,
      );

      const setTeamGameNumbers = (teamId: string, gameNumbers: any) => {
        const state = useTeamStore.getState();
        const team = state.teams[teamId];
        if (team) {
          useTeamStore.setState({
            teams: {
              ...state.teams,
              [teamId]: {
                ...team,
                gameNumbers: gameNumbers,
              },
            },
          });
        }
      };

      setTeamGameNumbers(teamAudit.teamId, teamAudit.expectedCounts);
    }
  });

  // Apply corrections to player store
  auditResult.playerAudit.forEach((playerAudit) => {
    if (playerAudit.discrepancy.gamesPlayed !== 0) {
      console.log(
        `Correcting player ${playerAudit.playerName}:`,
        playerAudit.discrepancy,
      );

      const setPlayerGameNumbers = (playerId: string, gameNumbers: any) => {
        const state = usePlayerStore.getState();
        const player = state.players[playerId];
        if (player) {
          usePlayerStore.setState({
            players: {
              ...state.players,
              [playerId]: {
                ...player,
                gameNumbers: gameNumbers,
              },
            },
          });
        }
      };

      setPlayerGameNumbers(playerAudit.playerId, playerAudit.expectedCounts);
    }
  });

  console.log("✅ Game count correction completed!");

  // Return updated audit to show the correction results
  return auditGameCounts();
}

/**
 * Pretty prints audit results to console
 */
export function printAuditResults(audit: GameCountAuditResult) {
  console.log("\n📊 GAME COUNT AUDIT RESULTS");
  console.log("=====================================");
  console.log(`Total finished games: ${audit.totalFinishedGames}`);

  console.log("\n🏀 TEAM AUDIT:");
  audit.teamAudit.forEach((team) => {
    const hasDiscrepancy = team.discrepancy.gamesPlayed !== 0;
    console.log(`\n${hasDiscrepancy ? "❌" : "✅"} ${team.teamName}:`);
    console.log(
      `  Current: W:${team.currentCounts.wins} L:${team.currentCounts.losses} D:${team.currentCounts.draws} Total:${team.currentCounts.gamesPlayed}`,
    );
    console.log(
      `  Expected: W:${team.expectedCounts.wins} L:${team.expectedCounts.losses} D:${team.expectedCounts.draws} Total:${team.expectedCounts.gamesPlayed}`,
    );
    if (hasDiscrepancy) {
      console.log(
        `  Discrepancy: W:${team.discrepancy.wins} L:${team.discrepancy.losses} D:${team.discrepancy.draws} Total:${team.discrepancy.gamesPlayed}`,
      );
    }
  });

  console.log("\n👥 PLAYER AUDIT:");
  const playersWithDiscrepancy = audit.playerAudit.filter(
    (p) => p.discrepancy.gamesPlayed !== 0,
  );
  console.log(
    `Players with correct counts: ${audit.playerAudit.length - playersWithDiscrepancy.length}`,
  );
  console.log(`Players with discrepancies: ${playersWithDiscrepancy.length}`);

  playersWithDiscrepancy.forEach((player) => {
    console.log(`\n❌ ${player.playerName}:`);
    console.log(
      `  Current: W:${player.currentCounts.wins} L:${player.currentCounts.losses} D:${player.currentCounts.draws} Total:${player.currentCounts.gamesPlayed}`,
    );
    console.log(
      `  Expected: W:${player.expectedCounts.wins} L:${player.expectedCounts.losses} D:${player.expectedCounts.draws} Total:${player.expectedCounts.gamesPlayed}`,
    );
    console.log(
      `  Discrepancy: W:${player.discrepancy.wins} L:${player.discrepancy.losses} D:${player.discrepancy.draws} Total:${player.discrepancy.gamesPlayed}`,
    );
  });

  console.log("\n🎮 GAME DETAILS:");
  audit.gameDetails.forEach((game, index) => {
    console.log(
      `${index + 1}. vs ${game.opposingTeam}: ${game.ourScore}-${game.opponentScore} (${game.result.toUpperCase()}) - ${game.playersInGame.length} players`,
    );
  });
}
