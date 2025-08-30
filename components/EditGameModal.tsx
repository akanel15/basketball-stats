import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { theme } from "@/theme";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as Haptics from "expo-haptics";
import { useGameStore } from "@/store/gameStore";
import { useTeamStore } from "@/store/teamStore";
import { usePlayerStore } from "@/store/playerStore";
import { Result } from "@/types/player";
import { Stat } from "@/types/stats";
import { Team } from "@/types/game";
import { confirmGameDeletion } from "@/utils/playerDeletion";

interface EditGameModalProps {
  gameId: string;
  visible: boolean;
  onClose: () => void;
  onDelete?: () => void;
}

export function EditGameModal({ gameId, visible, onClose, onDelete }: EditGameModalProps) {
  const [editedOpposingTeamName, setEditedOpposingTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getGameSafely = useGameStore(state => state.getGameSafely);
  const updateGame = useGameStore(state => state.updateGame);
  const markGameAsActive = useGameStore(state => state.markGameAsActive);

  const teamId = useTeamStore(state => state.currentTeamId);
  const revertTeamGameNumbers = useTeamStore(state => state.revertGameNumbers);

  const revertPlayerGameNumbers = usePlayerStore(state => state.revertGameNumbers);

  const game = getGameSafely(gameId);

  // Initialize form when modal opens
  useEffect(() => {
    if (visible && game) {
      setEditedOpposingTeamName(game.opposingTeamName);
    }
  }, [visible, game]);

  const handleHapticFeedback = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const calculateGameResult = (): Result => {
    if (!game) return Result.Draw;
    const ourPoints = game.statTotals[Team.Us][Stat.Points] || 0;
    const opponentPoints = game.statTotals[Team.Opponent][Stat.Points] || 0;

    if (ourPoints > opponentPoints) return Result.Win;
    if (ourPoints < opponentPoints) return Result.Loss;
    return Result.Draw;
  };

  const handleContinueGame = () => {
    handleHapticFeedback();
    if (!game) return;

    const result = calculateGameResult();

    // Revert team and player game counts
    revertTeamGameNumbers(teamId, result);
    game.gamePlayedList.forEach(playerId => {
      revertPlayerGameNumbers(playerId, result);
    });

    // Mark game as active
    markGameAsActive(gameId);
    onClose();
  };

  const handleSaveChanges = async () => {
    handleHapticFeedback();
    if (!game) return;

    if (editedOpposingTeamName.trim() === "") {
      Alert.alert("Validation Error", "Opposing team name cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      await updateGame(gameId, {
        opposingTeamName: editedOpposingTeamName.trim(),
      });
      onClose();
    } catch {
      Alert.alert("Error", "Failed to update game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    handleHapticFeedback();
    setEditedOpposingTeamName(game?.opposingTeamName || "");
    onClose();
  };

  const handleDeleteGame = () => {
    handleHapticFeedback();
    if (!game) return;

    const gameName = `vs ${game.opposingTeamName}`;
    confirmGameDeletion(gameId, gameName, () => {
      onClose();
      onDelete?.();
    });
  };

  if (!game) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Game</Text>
          <Text style={styles.subtitle}>vs {game.opposingTeamName}</Text>
        </View>

        <View style={styles.content}>
          {/* Team Name Editor */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Opposing Team Name</Text>
            <TextInput
              style={styles.textInput}
              value={editedOpposingTeamName}
              onChangeText={setEditedOpposingTeamName}
              placeholder="Enter opposing team name"
              autoCapitalize="words"
              editable={!isLoading}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.saveButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSaveChanges}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={theme.colorWhite} />
              ) : (
                <FontAwesome5 name="save" size={20} color={theme.colorWhite} />
              )}
              <View style={styles.buttonTextContainer}>
                <Text style={styles.actionButtonText}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Text>
                <Text style={styles.actionButtonSubtext}>Update team name and stay completed</Text>
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.resumeButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleContinueGame}
              disabled={isLoading}
            >
              <FontAwesome5 name="play" size={20} color={theme.colorOrangePeel} />
              <View style={styles.buttonTextContainer}>
                <Text style={[styles.actionButtonText, styles.resumeButtonText]}>
                  Continue Game
                </Text>
                <Text style={[styles.actionButtonSubtext, styles.resumeButtonSubtext]}>
                  Resume adding stats and plays
                </Text>
              </View>
            </Pressable>

            {/* Delete Button */}
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.deleteButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleDeleteGame}
              disabled={isLoading}
            >
              <FontAwesome5 name="trash-alt" size={20} color={theme.colorWhite} />
              <View style={styles.buttonTextContainer}>
                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete Game</Text>
                <Text style={[styles.actionButtonSubtext, styles.deleteButtonSubtext]}>
                  Permanently remove this game
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.cancelButton, pressed && styles.buttonPressed]}
              onPress={handleCancel}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorLightGrey,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colorOnyx,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colorOnyx,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    gap: 16,
  },
  saveButton: {
    backgroundColor: theme.colorOrangePeel,
  },
  resumeButton: {
    backgroundColor: theme.colorWhite,
    borderWidth: 2,
    borderColor: theme.colorOrangePeel,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonTextContainer: {
    flex: 1,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colorWhite,
    marginBottom: 2,
  },
  resumeButtonText: {
    color: theme.colorOrangePeel,
  },
  actionButtonSubtext: {
    fontSize: 14,
    color: theme.colorWhite,
    opacity: 0.9,
  },
  resumeButtonSubtext: {
    color: theme.colorOrangePeel,
  },
  deleteButton: {
    backgroundColor: theme.colorDestructive,
  },
  deleteButtonText: {
    color: theme.colorWhite,
  },
  deleteButtonSubtext: {
    color: theme.colorWhite,
  },
  actionsSection: {
    gap: 16,
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colorOnyx,
    opacity: 0.7,
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colorOnyx,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colorLightGrey,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: theme.colorWhite,
    color: theme.colorOnyx,
  },
});
