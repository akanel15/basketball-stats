import { Alert } from "react-native";
import {
  cascadeDeletePlayer,
  cascadeDeleteSet,
  cascadeDeleteGame,
  getPlayerDeletionInfo,
  getSetDeletionInfo,
} from "./cascadeDelete";
import { useGameStore } from "@/store/gameStore";

export function confirmPlayerDeletion(
  playerId: string,
  playerName: string,
  onSuccess: () => void,
): void {
  const deletionInfo = getPlayerDeletionInfo(playerId);
  const gamesCount = deletionInfo.games.length;

  let message = `This will permanently delete ${playerName} and any associated data. This action cannot be undone.`;

  if (gamesCount > 0) {
    message += `\n\nThe player will be removed from the following games:`;
    deletionInfo.games.slice(0, 3).forEach((game) => {
      message += `\n• ${game.name}`;
    });
    if (gamesCount > 3) {
      message += `\n• ...and ${gamesCount - 3} more`;
    }
  } else {
    message += `\n\nNo games will be affected.`;
  }

  Alert.alert(`Delete ${playerName}?`, message, [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Delete",
      style: "destructive",
      onPress: () => {
        cascadeDeletePlayer(playerId);
        onSuccess();
      },
    },
  ]);
}

export function confirmSetDeletion(
  setId: string,
  setName: string,
  onSuccess: () => void,
): void {
  const deletionInfo = getSetDeletionInfo(setId);
  const gamesCount = deletionInfo.games.length;

  let message = `This will permanently delete ${setName} and any associated data. This action cannot be undone.`;

  if (gamesCount > 0) {
    message += `\n\nThe set will be removed from the following games:`;
    deletionInfo.games.slice(0, 3).forEach((game) => {
      message += `\n• ${game.name}`;
    });
    if (gamesCount > 3) {
      message += `\n• ...and ${gamesCount - 3} more`;
    }
  } else {
    message += `\n\nNo games will be affected.`;
  }

  Alert.alert(`Delete ${setName}?`, message, [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Delete",
      style: "destructive",
      onPress: () => {
        cascadeDeleteSet(setId);
        onSuccess();
      },
    },
  ]);
}

export function confirmGameDeletion(
  gameId: string,
  gameName: string,
  onSuccess: () => void,
): void {
  const game = useGameStore.getState().games[gameId];

  if (!game) {
    Alert.alert("Error", "Game not found.");
    return;
  }

  let message = `This will permanently delete ${gameName} and all its data. This action cannot be undone.`;

  if (!game.isFinished) {
    message +=
      "\n\nWarning: This game is still active. Deleting it will lose all current progress.";
  }

  Alert.alert(`Delete ${gameName}?`, message, [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Delete",
      style: "destructive",
      onPress: () => {
        cascadeDeleteGame(gameId);
        onSuccess();
      },
    },
  ]);
}
