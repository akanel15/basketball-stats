import { useGameStore } from "@/store/gameStore";
import { usePlayerStore } from "@/store/playerStore";
import { useSetStore } from "@/store/setStore";
import { useTeamStore } from "@/store/teamStore";

export type CascadeDeletionInfo = {
  games: { id: string; name: string }[];
  players: { id: string; name: string }[];
  sets: { id: string; name: string }[];
};

export function getTeamDeletionInfo(teamId: string): CascadeDeletionInfo {
  const games = useGameStore.getState().games;
  const players = usePlayerStore.getState().players;
  const sets = useSetStore.getState().sets;

  const teamGames = Object.values(games)
    .filter((game) => game.teamId === teamId)
    .map((game) => ({
      id: game.id,
      name: `vs ${game.opposingTeamName}`,
    }));

  const teamPlayers = Object.values(players)
    .filter((player) => player.teamId === teamId)
    .map((player) => ({
      id: player.id,
      name: player.name,
    }));

  const teamSets = Object.values(sets)
    .filter((set) => set.teamId === teamId)
    .map((set) => ({
      id: set.id,
      name: set.name,
    }));

  return {
    games: teamGames,
    players: teamPlayers,
    sets: teamSets,
  };
}

export function getPlayerDeletionInfo(playerId: string): CascadeDeletionInfo {
  const games = useGameStore.getState().games;

  const playerGames = Object.values(games)
    .filter(
      (game) =>
        game.boxScore[playerId] !== undefined ||
        game.activePlayers.includes(playerId) ||
        game.gamePlayedList.includes(playerId),
    )
    .map((game) => ({
      id: game.id,
      name: `vs ${game.opposingTeamName}`,
    }));

  return {
    games: playerGames,
    players: [],
    sets: [],
  };
}

export function cascadeDeleteTeam(teamId: string): void {
  const deletionInfo = getTeamDeletionInfo(teamId);

  // Delete all games for this team
  deletionInfo.games.forEach((game) => {
    useGameStore.getState().removeGame(game.id);
  });

  // Delete all players for this team
  deletionInfo.players.forEach((player) => {
    usePlayerStore.getState().removePlayer(player.id);
  });

  // Delete all sets for this team
  deletionInfo.sets.forEach((set) => {
    useSetStore.getState().removeSet(set.id);
  });

  // Finally delete the team
  useTeamStore.getState().removeTeam(teamId);
}

export function getSetDeletionInfo(setId: string): CascadeDeletionInfo {
  const games = useGameStore.getState().games;

  const setGames = Object.values(games)
    .filter(
      (game) =>
        game.sets[setId] !== undefined || game.activeSets.includes(setId),
    )
    .map((game) => ({
      id: game.id,
      name: `vs ${game.opposingTeamName}`,
    }));

  return {
    games: setGames,
    players: [],
    sets: [],
  };
}

export function cascadeDeletePlayer(playerId: string): void {
  const deletionInfo = getPlayerDeletionInfo(playerId);

  // Remove player from all games where they appear
  deletionInfo.games.forEach((game) => {
    const gameState = useGameStore.getState().games[game.id];
    if (gameState) {
      // Remove from active players
      const newActivePlayers = gameState.activePlayers.filter(
        (id) => id !== playerId,
      );
      useGameStore.getState().setActivePlayers(game.id, newActivePlayers);

      // Remove from game played list
      // Note: We keep their box score stats for historical record
    }
  });

  // Delete the player
  usePlayerStore.getState().removePlayer(playerId);
}

export function cascadeDeleteSet(setId: string): void {
  const deletionInfo = getSetDeletionInfo(setId);

  // Remove set from all games where it appears
  deletionInfo.games.forEach((game) => {
    const gameState = useGameStore.getState().games[game.id];
    if (gameState) {
      // Remove from active sets
      const newActiveSets = gameState.activeSets.filter((id) => id !== setId);
      useGameStore.getState().setActiveSets(game.id, newActiveSets);

      // Note: We keep set stats in games for historical record
    }
  });

  // Delete the set
  useSetStore.getState().removeSet(setId);
}

export function cascadeDeleteGame(gameId: string): void {
  // Games are leaf nodes, so just delete the game
  useGameStore.getState().removeGame(gameId);
}
