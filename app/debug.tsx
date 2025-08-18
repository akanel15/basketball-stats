import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { theme } from "@/theme";
import {
  auditGameCounts,
  correctGameCounts,
  printAuditResults,
  GameCountAuditResult,
} from "@/utils/gameCountAudit";

export default function DebugScreen() {
  const [auditResult, setAuditResult] = useState<GameCountAuditResult | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const runAudit = async () => {
    setIsLoading(true);
    try {
      const result = auditGameCounts();
      setAuditResult(result);
      printAuditResults(result);
    } catch (error) {
      console.error("Error running audit:", error);
      Alert.alert("Error", "Failed to run audit");
    } finally {
      setIsLoading(false);
    }
  };

  const runCorrection = async () => {
    Alert.alert(
      "Correct Game Counts",
      "This will recalculate all game counts based on actual finished games. This action cannot be undone. Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Correct",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              const result = correctGameCounts();
              setAuditResult(result);
              Alert.alert("Success", "Game counts have been corrected!");
            } catch (error) {
              console.error("Error correcting counts:", error);
              Alert.alert("Error", "Failed to correct counts");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  const renderTeamAudit = () => {
    if (!auditResult) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏀 Team Audit</Text>
        {auditResult.teamAudit.map((team) => {
          const hasDiscrepancy = team.discrepancy.gamesPlayed !== 0;
          return (
            <View
              key={team.teamId}
              style={[styles.card, hasDiscrepancy && styles.errorCard]}
            >
              <Text style={styles.teamName}>
                {hasDiscrepancy ? "❌" : "✅"} {team.teamName}
              </Text>
              <Text style={styles.counts}>
                Current: W:{team.currentCounts.wins} L:
                {team.currentCounts.losses} D:{team.currentCounts.draws} Total:
                {team.currentCounts.gamesPlayed}
              </Text>
              <Text style={styles.counts}>
                Expected: W:{team.expectedCounts.wins} L:
                {team.expectedCounts.losses} D:{team.expectedCounts.draws}{" "}
                Total:{team.expectedCounts.gamesPlayed}
              </Text>
              {hasDiscrepancy && (
                <Text style={styles.discrepancy}>
                  Discrepancy: W:{team.discrepancy.wins} L:
                  {team.discrepancy.losses} D:{team.discrepancy.draws} Total:
                  {team.discrepancy.gamesPlayed}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderPlayerAudit = () => {
    if (!auditResult) return null;

    const playersWithDiscrepancy = auditResult.playerAudit.filter(
      (p) => p.discrepancy.gamesPlayed !== 0,
    );
    const playersCorrect =
      auditResult.playerAudit.length - playersWithDiscrepancy.length;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👥 Player Audit</Text>
        <Text style={styles.summary}>
          ✅ Players with correct counts: {playersCorrect}
        </Text>
        <Text style={styles.summary}>
          ❌ Players with discrepancies: {playersWithDiscrepancy.length}
        </Text>

        {playersWithDiscrepancy.map((player) => (
          <View key={player.playerId} style={[styles.card, styles.errorCard]}>
            <Text style={styles.playerName}>❌ {player.playerName}</Text>
            <Text style={styles.counts}>
              Current: W:{player.currentCounts.wins} L:
              {player.currentCounts.losses} D:{player.currentCounts.draws}{" "}
              Total:{player.currentCounts.gamesPlayed}
            </Text>
            <Text style={styles.counts}>
              Expected: W:{player.expectedCounts.wins} L:
              {player.expectedCounts.losses} D:{player.expectedCounts.draws}{" "}
              Total:{player.expectedCounts.gamesPlayed}
            </Text>
            <Text style={styles.discrepancy}>
              Discrepancy: W:{player.discrepancy.wins} L:
              {player.discrepancy.losses} D:{player.discrepancy.draws} Total:
              {player.discrepancy.gamesPlayed}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderGameDetails = () => {
    if (!auditResult) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎮 Game Details</Text>
        <Text style={styles.summary}>
          Total finished games: {auditResult.totalFinishedGames}
        </Text>
        {auditResult.gameDetails.map((game, index) => (
          <View key={game.gameId} style={styles.gameCard}>
            <Text style={styles.gameTitle}>
              {index + 1}. vs {game.opposingTeam}
            </Text>
            <Text style={styles.gameScore}>
              Score: {game.ourScore}-{game.opponentScore} (
              {game.result.toUpperCase()})
            </Text>
            <Text style={styles.gamePlayers}>
              Players: {game.playersInGame.length}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔧 Debug: Game Count Management</Text>
      <Text style={styles.warning}>
        ⚠️ This screen is for debugging game count issues. Use with caution!
      </Text>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.auditButton]}
          onPress={runAudit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Running Audit..." : "🔍 Run Audit"}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.correctButton]}
          onPress={runCorrection}
          disabled={isLoading || !auditResult}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Correcting..." : "🔧 Correct Counts"}
          </Text>
        </Pressable>
      </View>

      {auditResult && (
        <>
          {renderTeamAudit()}
          {renderPlayerAudit()}
          {renderGameDetails()}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: theme.colorOnyx,
  },
  warning: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: theme.colorOrangePeel,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  auditButton: {
    backgroundColor: theme.colorBlue,
  },
  correctButton: {
    backgroundColor: theme.colorOrangePeel,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: theme.colorOnyx,
  },
  summary: {
    fontSize: 16,
    marginBottom: 8,
    color: theme.colorOnyx,
  },
  card: {
    backgroundColor: theme.colorLightGrey,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  errorCard: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
    borderWidth: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: theme.colorOnyx,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: theme.colorOnyx,
  },
  counts: {
    fontSize: 14,
    color: theme.colorOnyx,
    fontFamily: "monospace",
  },
  discrepancy: {
    fontSize: 14,
    color: "#f44336",
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  gameCard: {
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colorOnyx,
  },
  gameScore: {
    fontSize: 14,
    color: theme.colorOnyx,
  },
  gamePlayers: {
    fontSize: 12,
    color: "#666",
  },
});
