import { Stat } from "@/types/stats";
import { Team, GameType } from "@/types/game";
import { Result } from "@/types/player";

/**
 * Calculates the game result based on final scores
 */
export const calculateGameResult = (game: GameType): Result => {
  const ourPoints = game.statTotals[Team.Us][Stat.Points] || 0;
  const opponentPoints = game.statTotals[Team.Opponent][Stat.Points] || 0;

  if (ourPoints > opponentPoints) {
    return Result.Win;
  } else if (ourPoints < opponentPoints) {
    return Result.Loss;
  } else {
    return Result.Draw;
  }
};

/**
 * Checks if a game can be completed (not already finished)
 */
export const canCompleteGame = (game: GameType): boolean => {
  return !game.isFinished;
};

/**
 * Gets the list of players who participated in the game
 */
export const getGameParticipants = (game: GameType): string[] => {
  return game.gamePlayedList || [];
};

/**
 * Pure function to complete a game - returns the operations to perform
 * This doesn't mutate state directly, but returns the actions needed
 */
export interface GameCompletionActions {
  markGameAsFinished: () => void;
  updateTeamGameNumbers: (teamId: string, result: Result) => void;
  updatePlayerGameNumbers: (playerId: string, result: Result) => void;
}

export interface GameCompletionData {
  gameId: string;
  teamId: string;
  result: Result;
  participants: string[];
  canComplete: boolean;
}

/**
 * Prepares game completion data without side effects
 */
export const prepareGameCompletion = (
  game: GameType,
  gameId: string,
  teamId: string,
): GameCompletionData => {
  const result = calculateGameResult(game);
  const participants = getGameParticipants(game);
  const canComplete = canCompleteGame(game);

  return {
    gameId,
    teamId,
    result,
    participants,
    canComplete,
  };
};

/**
 * Executes game completion with provided actions
 */
export const executeGameCompletion = (
  completionData: GameCompletionData,
  actions: GameCompletionActions,
  logPrefix: string = "GameCompletion",
): boolean => {
  if (!completionData.canComplete) {
    console.log(
      `${logPrefix}: Attempted to complete already finished game:`,
      completionData.gameId,
    );
    return false;
  }

  console.log(
    `${logPrefix}: Starting completion - Game:`,
    completionData.gameId,
    "Result:",
    completionData.result,
    "Players:",
    completionData.participants.length,
  );

  // Update team game numbers
  actions.updateTeamGameNumbers(completionData.teamId, completionData.result);

  // Update player game numbers for all participants
  completionData.participants.forEach((playerId) => {
    actions.updatePlayerGameNumbers(playerId, completionData.result);
  });

  // Mark game as finished
  actions.markGameAsFinished();

  console.log(`${logPrefix}: Completion successful - Game marked as finished`);
  return true;
};

/**
 * Convenience function for manual game completion
 */
export const completeGameManually = (
  game: GameType,
  gameId: string,
  teamId: string,
  actions: GameCompletionActions,
): boolean => {
  const completionData = prepareGameCompletion(game, gameId, teamId);
  return executeGameCompletion(
    completionData,
    actions,
    "GameCompletion: MANUAL",
  );
};

/**
 * Convenience function for automatic game completion (app state/focus)
 */
export const completeGameAutomatically = (
  game: GameType,
  gameId: string,
  teamId: string,
  actions: GameCompletionActions,
  trigger: "AppState" | "FocusEffect",
): boolean => {
  const completionData = prepareGameCompletion(game, gameId, teamId);
  return executeGameCompletion(
    completionData,
    actions,
    `GameCompletion: AUTO completion (${trigger})`,
  );
};
