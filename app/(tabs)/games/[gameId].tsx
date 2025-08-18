import { BaskitballButton } from "@/components/BaskitballButton";
import { GamePlayerButton } from "@/components/GamePlayerButton";
import { useGameStore } from "@/store/gameStore";
import { usePlayerStore } from "@/store/playerStore";
import { useTeamStore } from "@/store/teamStore";
import {
  ActionType,
  getStatsForAction,
  Stat,
  StatMapping,
} from "@/types/stats";
import { useNavigation, useRoute } from "@react-navigation/core";
import {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  AppState,
  Modal,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { theme } from "@/theme";
import { PeriodType, PlayByPlayType, Team } from "@/types/game";
import { SetRadioButton } from "@/components/SetRadioButton";
import { useSetStore } from "@/store/setStore";
import StatOverlay from "@/components/gamePage/StatOverlay";
import SetOverlay from "@/components/gamePage/SetOverlay";
import SubstitutionOverlay from "@/components/gamePage/SubstitutionOverlay";
import PlayByPlay from "@/components/gamePage/PlayByPlay";
import BoxScoreOverlay from "@/components/gamePage/BoxScoreOverlay";
import Ionicons from "@expo/vector-icons/Ionicons";
import MatchUpDisplay from "@/components/MatchUpDisplay";
import { Result } from "@/types/player";
import { useFocusEffect } from "@react-navigation/native";
import {
  completeGameAutomatically,
  completeGameManually,
  GameCompletionActions,
} from "@/logic/gameCompletion";
import { confirmGameDeletion } from "@/utils/playerDeletion";
import { LoadingState } from "@/components/LoadingState";
import Feather from "@expo/vector-icons/Feather";
import ViewShot from "react-native-view-shot";
import { shareBoxScoreImage } from "@/utils/shareBoxScore";
import ShareableBoxScore from "@/components/gamePage/ShareableBoxScore";

export default function GamePage() {
  const { gameId } = useRoute().params as { gameId: string }; // Access playerId from route params

  const players = usePlayerStore((state) => state.players);
  const teamId = useTeamStore((state) => state.currentTeamId);
  const getGameSafely = useGameStore((state) => state.getGameSafely);

  const sets = useSetStore((state) => state.sets);
  const setList = Object.values(sets);
  const teamSets = setList.filter((set) => set.teamId === teamId);
  const setIdList = teamSets.map((set) => set.id);

  const navigation = useNavigation();

  const setActiveSets = useGameStore((state) => state.setActiveSets);
  const removePlayFromPeriod = useGameStore(
    (state) => state.removePlayFromPeriod,
  );

  const [selectedPlay, setSelectedPlay] = useState<string>("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [showSubstitutions, setShowSubstitutions] = useState(false);
  const [showSets, setShowSets] = useState(false);
  const [showBoxScore, setShowBoxScore] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [freeThrowToggle, setFreeThrowToggle] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const shareableRef = useRef<ViewShot>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedOpposingTeamName, setEditedOpposingTeamName] = useState("");

  //game stats
  const updateBoxScore = useGameStore((state) => state.updateBoxScore);
  const updateTotals = useGameStore((state) => state.updateTotals);
  const updatePeriods = useGameStore((state) => state.updatePeriods);
  const updateGameSetStats = useGameStore((state) => state.updateSetStats);
  const updateGameSetCounts = useGameStore(
    (state) => state.incrementSetRunCount,
  );

  //team stats
  const updateTeamStats = useTeamStore((state) => state.updateStats);

  //player stats
  const updatePlayerStats = usePlayerStore((state) => state.updateStats);

  //set stats
  const updateSetStats = useSetStore((state) => state.updateStats);
  const updateSetRunCount = useSetStore((state) => state.incrementRunCount);

  const game = getGameSafely(gameId);
  const updateGame = useGameStore((state) => state.updateGame);

  // Move handleShare outside the useLayoutEffect so it's accessible
  const handleShare = async () => {
    if (isSharing) return;

    setIsSharing(true);
    setShowShareModal(true);

    // Small delay to ensure modal is rendered
    setTimeout(async () => {
      try {
        if (shareableRef.current) {
          const gameName = `vs ${game.opposingTeamName}`;
          await shareBoxScoreImage(shareableRef, gameName);
        }
      } finally {
        setIsSharing(false);
        setShowShareModal(false);
      }
    }, 500);
  };

  // Move handleDeleteGame outside the useLayoutEffect so it's accessible
  const handleDeleteGame = () => {
    confirmGameDeletion(gameId, `vs ${game.opposingTeamName}`, () => {
      navigation.goBack();
    });
  };

  // Handle invalid game ID
  useEffect(() => {
    if (!game) {
      Alert.alert(
        "Game Not Found",
        "This game no longer exists or has been deleted.",
        [
          {
            text: "Go Back",
            onPress: () => navigation.goBack(),
          },
        ],
      );
      return;
    }
  }, [game, navigation]);

  // Initialize edit values when game changes
  useEffect(() => {
    if (game) {
      setEditedOpposingTeamName(game.opposingTeamName);
    }
  }, [game]);

  // Move all hooks before any conditional returns
  useEffect(() => {
    if (game) {
      const activeSets = game.activeSets.map((setId) => sets[setId]);
      if (activeSets.length === 0 && setIdList.length > 0) {
        setActiveSets(gameId, setIdList.slice(0, 5));
      }
    }
  }, [game, sets, setIdList, gameId, setActiveSets]);

  useEffect(() => {
    if (!game) return;

    const createGameCompletionActions = (): GameCompletionActions => ({
      markGameAsFinished: () =>
        useGameStore.getState().markGameAsFinished(gameId),
      updateTeamGameNumbers: (teamId: string, result: Result) =>
        useTeamStore.getState().updateGamesPlayed(teamId, result),
      updatePlayerGameNumbers: (playerId: string, result: Result) =>
        usePlayerStore.getState().updateGamesPlayed(playerId, result),
      getCurrentGame: () => useGameStore.getState().games[gameId],
    });

    const handleAppStateChange = (nextAppState: string) => {
      if (
        (nextAppState === "background" || nextAppState === "inactive") &&
        !game.isFinished
      ) {
        const actions = createGameCompletionActions();
        completeGameAutomatically(game, gameId, teamId, actions, "AppState");
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription?.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gameId,
    teamId,
    game?.gamePlayedList,
    game?.isFinished,
    game?.statTotals,
  ]);

  useFocusEffect(
    useCallback(() => {
      if (!game) return;

      const createGameCompletionActions = (): GameCompletionActions => ({
        markGameAsFinished: () =>
          useGameStore.getState().markGameAsFinished(gameId),
        updateTeamGameNumbers: (teamId: string, result: Result) =>
          useTeamStore.getState().updateGamesPlayed(teamId, result),
        updatePlayerGameNumbers: (playerId: string, result: Result) =>
          usePlayerStore.getState().updateGamesPlayed(playerId, result),
        getCurrentGame: () => useGameStore.getState().games[gameId],
      });

      return () => {
        if (!game.isFinished) {
          const actions = createGameCompletionActions();
          completeGameAutomatically(
            game,
            gameId,
            teamId,
            actions,
            "FocusEffect",
          );
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      gameId,
      teamId,
      game?.gamePlayedList,
      game?.isFinished,
      game?.statTotals,
    ]),
  );

  useLayoutEffect(() => {
    if (!game) return;

    const calculateGameResult = (): Result => {
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

    const completeGame = () => {
      const createGameCompletionActions = (): GameCompletionActions => ({
        markGameAsFinished: () =>
          useGameStore.getState().markGameAsFinished(gameId),
        updateTeamGameNumbers: (teamId: string, result: Result) =>
          useTeamStore.getState().updateGamesPlayed(teamId, result),
        updatePlayerGameNumbers: (playerId: string, result: Result) =>
          usePlayerStore.getState().updateGamesPlayed(playerId, result),
        getCurrentGame: () => useGameStore.getState().games[gameId],
      });
      const actions = createGameCompletionActions();
      completeGameManually(game, gameId, teamId, actions);
    };

    const editGame = () => {
      const result = calculateGameResult();

      const revertTeamGameNumbers = useTeamStore.getState().revertGameNumbers;
      const revertPlayerGameNumbers =
        usePlayerStore.getState().revertGameNumbers;
      const markGameAsActive = useGameStore.getState().markGameAsActive;

      revertTeamGameNumbers(teamId, result);

      game.gamePlayedList.forEach((playerId) => {
        revertPlayerGameNumbers(playerId, result);
      });

      markGameAsActive(gameId);
    };

    const handleGameEdit = () => {
      // First unmark the game as finished to reactivate it
      editGame();
      // Then enter edit mode for game details
      setIsEditMode(true);
      setEditedOpposingTeamName(game.opposingTeamName);
    };

    const handleGameSave = async () => {
      if (editedOpposingTeamName.trim() === "") {
        Alert.alert("Validation Error", "Opposing team name cannot be empty");
        return;
      }

      try {
        await updateGame(gameId, {
          opposingTeamName: editedOpposingTeamName.trim(),
        });
        // Mark the game as finished again after editing
        completeGame();
        setIsEditMode(false);
      } catch {
        Alert.alert("Error", "Failed to update game. Please try again.");
      }
    };

    if (game.isFinished) {
      navigation.setOptions({
        title: isEditMode ? "Edit Game" : `vs ${game.opposingTeamName}`,
        headerLeft: () => (
          <Pressable
            hitSlop={20}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <FontAwesome5
              name="arrow-left"
              size={16}
              color={theme.colorOrangePeel}
            />
            <Text style={styles.backButtonText}>Teams</Text>
          </Pressable>
        ),
        headerRight: () => (
          <Pressable
            hitSlop={20}
            onPress={isEditMode ? handleGameSave : handleGameEdit}
          >
            <Text style={styles.headerButtonText}>
              {isEditMode ? "Done" : "Edit"}
            </Text>
          </Pressable>
        ),
      });
    } else {
      navigation.setOptions({
        headerLeft: () => (
          <Pressable
            hitSlop={20}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <FontAwesome5
              name="arrow-left"
              size={16}
              color={theme.colorOrangePeel}
            />
            <Text style={styles.backButtonText}>Teams</Text>
          </Pressable>
        ),
        headerRight: () => (
          <View style={styles.headerButtonContainer}>
            <Pressable
              hitSlop={20}
              onPress={completeGame}
              style={styles.headerButton}
            >
              <FontAwesome5
                name="check-circle"
                size={18}
                color={theme.colorOrangePeel}
              />
              <Text style={styles.headerButtonText}>Done</Text>
            </Pressable>
          </View>
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    game?.isFinished,
    gameId,
    teamId,
    game?.gamePlayedList,
    game?.statTotals,
    navigation,
    isEditMode,
    isSharing,
    editedOpposingTeamName,
  ]);

  // Show loading or error state if game doesn't exist
  if (!game) {
    return <LoadingState message="Loading game..." />;
  }

  const activePlayers = game.activePlayers.map((playerId) => players[playerId]);
  const activeSets = game.activeSets.map((setId) => sets[setId]);

  //STAT FUNCTIONS
  type StatUpdateType = {
    stats: Stat[];
    gameId: string;
    teamId: string;
    playerId: string;
    setId: string;
  };

  const updatePlusMinus = (team: Team, amount: number) => {
    amount = team === Team.Opponent ? -amount : amount;

    //us
    updateTeamStats(teamId, Stat.PlusMinus, amount, Team.Us);
    updateTotals(gameId, Stat.PlusMinus, amount, Team.Us);

    //them
    updateTeamStats(teamId, Stat.PlusMinus, -amount, Team.Opponent);
    updateTotals(gameId, Stat.PlusMinus, -amount, Team.Opponent);
    game.activePlayers.forEach((playerId) => {
      updateBoxScore(gameId, playerId, Stat.PlusMinus, amount);
      updatePlayerStats(playerId, Stat.PlusMinus, amount);
    });
  };

  function handleStatUpdate({
    stats,
    gameId,
    teamId,
    playerId,
    setId,
  }: StatUpdateType) {
    const team = playerId === "Opponent" ? Team.Opponent : Team.Us;
    //PLAY BY PLAY AND PERIOD INFO
    if (stats.length === 2) {
      //shot make
      updatePeriods(gameId, playerId, stats[0], selectedPeriod, team);
    } else if (stats.length === 1) {
      //regular case for single action
      updatePeriods(gameId, playerId, stats[0], selectedPeriod, team); //attempt means miss as the above attempts are filtered out
    }

    stats.forEach((stat) => {
      updateBoxScore(gameId, playerId, stat, 1);
      updateTotals(gameId, stat, 1, team);
      updatePlayerStats(playerId, stat, 1);
      updateTeamStats(teamId, stat, 1, team);
      updateSetStats(setId, stat, 1);
      updateGameSetStats(gameId, setId, stat, 1);

      switch (stat) {
        case Stat.FreeThrowsMade:
          updateTotals(gameId, Stat.Points, 1, team);
          updateBoxScore(gameId, playerId, Stat.Points, 1);
          updatePlayerStats(playerId, Stat.Points, 1);
          updateTeamStats(teamId, Stat.Points, 1, team);
          updateSetStats(setId, Stat.Points, 1);
          updateGameSetStats(gameId, setId, Stat.Points, 1);
          updatePlusMinus(team, 1);
          break;
        case Stat.TwoPointMakes:
          updateTotals(gameId, Stat.Points, 2, team);
          updateBoxScore(gameId, playerId, Stat.Points, 2);
          updatePlayerStats(playerId, Stat.Points, 2);
          updateTeamStats(teamId, Stat.Points, 2, team);
          updateSetStats(setId, Stat.Points, 2);
          updateGameSetStats(gameId, setId, Stat.Points, 2);
          updatePlusMinus(team, 2);
          break;
        case Stat.ThreePointMakes:
          updateTotals(gameId, Stat.Points, 3, team);
          updateBoxScore(gameId, playerId, Stat.Points, 3);
          updatePlayerStats(playerId, Stat.Points, 3);
          updateTeamStats(teamId, Stat.Points, 3, team);
          updateSetStats(setId, Stat.Points, 3);
          updateGameSetStats(gameId, setId, Stat.Points, 3);
          updatePlusMinus(team, 3);
          break;
      }
    });
  }
  const reversePlayStats = (playToRemove: PlayByPlayType) => {
    const team = playToRemove.playerId === "Opponent" ? Team.Opponent : Team.Us;
    const statsToReverse = getStatsForAction(playToRemove.action);

    // Reverse each stat that was added
    statsToReverse.forEach((stat) => {
      // Reverse all the updates (subtract instead of add)
      updateBoxScore(gameId, playToRemove.playerId, stat, -1);
      updateTotals(gameId, stat, -1, team);
      updatePlayerStats(playToRemove.playerId, stat, -1);
      updateTeamStats(teamId, stat, -1, team);

      // Handle points reversal for scoring plays
      switch (stat) {
        case Stat.FreeThrowsMade:
          updateTotals(gameId, Stat.Points, -1, team);
          updateBoxScore(gameId, playToRemove.playerId, Stat.Points, -1);
          updatePlayerStats(playToRemove.playerId, Stat.Points, -1);
          updateTeamStats(teamId, Stat.Points, -1, team);
          updatePlusMinus(team, -1);
          break;
        case Stat.TwoPointMakes:
          updateTotals(gameId, Stat.Points, -2, team);
          updateBoxScore(gameId, playToRemove.playerId, Stat.Points, -2);
          updatePlayerStats(playToRemove.playerId, Stat.Points, -2);
          updateTeamStats(teamId, Stat.Points, -2, team);
          updatePlusMinus(team, -2);
          break;
        case Stat.ThreePointMakes:
          updateTotals(gameId, Stat.Points, -3, team);
          updateBoxScore(gameId, playToRemove.playerId, Stat.Points, -3);
          updatePlayerStats(playToRemove.playerId, Stat.Points, -3);
          updateTeamStats(teamId, Stat.Points, -3, team);
          updatePlusMinus(team, -3);
          break;
      }
    });
  };

  const removePlay = (playIndex: number, period: number) => {
    // Check if period and playByPlay exist before accessing
    if (!game.periods?.[period]?.playByPlay) {
      console.log("No playByPlay data for this period");
      return;
    }

    const playToRemove = game.periods[period].playByPlay[playIndex];
    if (!playToRemove) {
      console.log("No play to remove");
      return;
    }

    Alert.alert(
      "Delete Play",
      `Remove ${playToRemove.action} by ${playToRemove.playerId === "Opponent" ? "Opponent" : players[playToRemove.playerId]?.name}?`,
      [
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Reverse the stats
            reversePlayStats(playToRemove);
            // Remove from playByPlay array
            removePlayFromPeriod(gameId, period, playIndex);
            console.log("Successfully deleted play:", playToRemove);
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  const handlePlayerPress = (playerId: string) => {
    setSelectedPlayer(playerId);
    setShowOverlay(true);
  };

  const handleStatPress = (category: ActionType, action: string) => {
    console.log("Action Type:", category, "Action Key:", action);

    const stats = StatMapping[category]?.[action];

    if (!stats) {
      console.error("Invalid action:", action);
      return;
    }

    handleStatUpdate({
      stats,
      gameId,
      teamId,
      playerId: selectedPlayer,
      setId: selectedPlay,
    });
    handleCloseOverlay();

    if (
      stats.includes(Stat.FreeThrowsMade) ||
      stats.includes(Stat.FreeThrowsAttempted)
    ) {
      setFreeThrowToggle(true);
    }

    const newActionPostFreeThrow =
      freeThrowToggle === true &&
      (!stats.includes(Stat.FreeThrowsMade) ||
        !stats.includes(Stat.FreeThrowsAttempted));

    //if play has concluded reset the selected play
    if (
      selectedPlayer !== "Opponent" &&
      (stats.includes(Stat.TwoPointMakes) ||
        stats.includes(Stat.TwoPointAttempts) ||
        stats.includes(Stat.ThreePointMakes) ||
        stats.includes(Stat.ThreePointAttempts) ||
        stats.includes(Stat.Turnovers) ||
        newActionPostFreeThrow)
    ) {
      updateSetRunCount(selectedPlay);
      updateGameSetCounts(gameId, selectedPlay);
      setSelectedPlay("");
      setFreeThrowToggle(false);
    }
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  if (game.isFinished) {
    return (
      <View style={styles.container}>
        {isEditMode && (
          <View style={styles.editContainer}>
            <View style={styles.editHeaderRow}>
              <Text style={styles.editLabel}>Opposing Team Name</Text>
              <FontAwesome5
                name="pencil-alt"
                size={14}
                color={theme.colorOrangePeel}
              />
            </View>
            <TextInput
              style={styles.editInput}
              value={editedOpposingTeamName}
              onChangeText={setEditedOpposingTeamName}
              placeholder="Enter opposing team name"
              autoCapitalize="words"
              autoFocus={true}
            />
          </View>
        )}

        <View style={styles.boxScoreContainer}>
          <BoxScoreOverlay
            gameId={gameId}
            onClose={() => {}}
            hideCloseButton={true}
          />
        </View>

        {/* Bottom Action Buttons */}
        <View style={styles.bottomActionsContainer}>
          <Pressable
            style={styles.actionButton}
            onPress={isSharing ? () => {} : handleShare}
            disabled={isSharing}
          >
            <Feather
              name={isSharing ? "loader" : "upload"}
              size={20}
              color={theme.colorOrangePeel}
            />
            <Text style={styles.actionButtonText}>
              {isSharing ? "Sharing..." : "Share Game"}
            </Text>
          </Pressable>

          {isEditMode && (
            <Pressable
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDeleteGame}
            >
              <FontAwesome5
                name="trash-alt"
                size={18}
                color={theme.colorWhite}
              />
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                Delete Game
              </Text>
            </Pressable>
          )}
        </View>

        {/* Hidden Modal for Capturing Full Box Score for Share */}
        <Modal
          visible={showShareModal}
          transparent={true}
          animationType="none"
          onRequestClose={() => setShowShareModal(false)}
        >
          <View style={styles.hiddenModalContainer}>
            <ViewShot
              ref={shareableRef}
              options={{
                format: "png",
                quality: 0.9,
                result: "tmpfile",
              }}
            >
              <ShareableBoxScore game={game} players={players} />
            </ViewShot>
          </View>
        </Modal>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.teamsContainer}>
        <MatchUpDisplay game={game}></MatchUpDisplay>
      </View>
      {showOverlay ? (
        <StatOverlay
          onClose={handleCloseOverlay}
          onStatPress={handleStatPress}
        />
      ) : showSets ? (
        <SetOverlay gameId={gameId} onClose={() => setShowSets(false)} />
      ) : showSubstitutions || activePlayers.length === 0 ? (
        <SubstitutionOverlay
          gameId={gameId}
          onClose={() => setShowSubstitutions(false)}
        />
      ) : showBoxScore ? (
        <BoxScoreOverlay
          gameId={gameId}
          onClose={() => setShowBoxScore(false)}
        />
      ) : (
        <View>
          <View style={styles.periodContainer}>
            <Pressable
              hitSlop={20}
              onPress={() => setSelectedPeriod(selectedPeriod - 1)}
              disabled={selectedPeriod === 0}
            >
              <Ionicons
                name="arrow-undo-circle"
                size={30}
                color={
                  selectedPeriod === 0
                    ? theme.colorLightGrey
                    : theme.colorOrangePeel
                }
              />
            </Pressable>
            {selectedPeriod + 1 <= game.periodType ? (
              // regulation
              game.periodType === PeriodType.Quarters ? (
                <Text style={styles.heading}>Q{selectedPeriod + 1}</Text>
              ) : (
                <Text style={styles.heading}>Half {selectedPeriod + 1}</Text>
              )
            ) : (
              <Text style={styles.heading}>
                OT{selectedPeriod + 1 - game.periodType}
              </Text>
            )}

            <Pressable
              hitSlop={20}
              onPress={() => setSelectedPeriod(selectedPeriod + 1)}
            >
              <Ionicons
                name="arrow-redo-circle"
                size={30}
                color={theme.colorOrangePeel}
              />
            </Pressable>
          </View>
          <View style={styles.playByPlayContainer}>
            <PlayByPlay
              gameId={gameId}
              period={selectedPeriod}
              onDeletePlay={removePlay}
            />
          </View>
          <View style={styles.bottomSection}>
            <View style={styles.section}>
              <Text style={styles.heading}>Sets</Text>
              <View style={styles.rowContainer}>
                {activeSets.map((set) => (
                  <SetRadioButton
                    key={set.id}
                    title={set.name}
                    selected={selectedPlay === set.id}
                    onPress={() => setSelectedPlay(set.id)}
                  />
                ))}
                <SetRadioButton
                  title="Reset"
                  selected={false}
                  onPress={() => setSelectedPlay("")}
                  reset={true}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.heading}>Players</Text>
              <View style={styles.rowContainer}>
                {activePlayers.map((player) => (
                  <GamePlayerButton
                    key={player.id}
                    player={player}
                    onPress={() => handlePlayerPress(player.id)}
                  />
                ))}
                <GamePlayerButton
                  onPress={() => handlePlayerPress("Opponent")}
                  opponentName={game.opposingTeamName}
                />
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.rowContainer}>
                <View style={styles.split}>
                  <BaskitballButton
                    onPress={() => setShowSubstitutions(true)}
                    title="Sub Players"
                  />
                </View>
                <View style={styles.split}>
                  <BaskitballButton
                    onPress={() => setShowSets(true)}
                    title="Change Sets"
                    color={theme.colorBlue}
                  />
                </View>
                <View style={styles.split}>
                  <BaskitballButton
                    onPress={() => setShowBoxScore(true)}
                    title="Box Score"
                    color={theme.colorOnyx}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: theme.colorWhite,
  },
  teamsContainer: {
    padding: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  playByPlayContainer: {
    flex: 1,
    marginTop: 4,
    marginBottom: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 140,
  },
  bottomSection: {
    justifyContent: "flex-end",
  },
  section: {
    marginBottom: 4,
  },
  heading: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 6,
    marginBottom: 6,
    flexWrap: "wrap",
  },
  split: {
    flex: 1,
    maxWidth: "50%",
  },
  periodContainer: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 30, // Adds spacing between the icons and text
  },
  headerButtonText: {
    color: theme.colorOrangePeel,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  headerButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  hiddenModalContainer: {
    position: "absolute",
    left: -9999,
    top: -9999,
    opacity: 0,
  },
  editContainer: {
    backgroundColor: theme.colorWhite,
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: theme.colorOnyx,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colorOnyx,
    marginBottom: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: theme.colorLightGrey,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: theme.colorWhite,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  backButtonText: {
    color: theme.colorOrangePeel,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 6,
  },
  editHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  boxScoreContainer: {
    flex: 1,
  },
  bottomActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: theme.colorWhite,
    borderTopWidth: 1,
    borderTopColor: theme.colorLightGrey,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colorWhite,
    borderWidth: 1,
    borderColor: theme.colorOrangePeel,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    gap: 8,
  },
  actionButtonText: {
    color: theme.colorOrangePeel,
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: theme.colorRed || "#DC2626",
    borderColor: theme.colorRed || "#DC2626",
  },
  deleteButtonText: {
    color: theme.colorWhite,
  },
});
