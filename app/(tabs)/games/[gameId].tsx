import { BaskitballButton } from "@/components/BaskitballButton";
import { GameButton } from "@/components/GameButton";
import { useGameStore } from "@/store/gameStore";
import { usePlayerStore } from "@/store/playerStore";
import { useTeamStore } from "@/store/teamStore";
import { ActionType, Stat, StatMapping } from "@/types/stats";
import { useNavigation, useRoute } from "@react-navigation/core";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { theme } from "@/theme";
import { Team } from "@/types/game";
import { SetRadioButton } from "@/components/SetRadioButton";
import { useSetStore } from "@/store/setStore";
import StatOverlay from "@/components/gamePage/StatOverlay";
import SetOverlay from "@/components/gamePage/SetOverlay";
import SubstitutionOverlay from "@/components/gamePage/SubstitutionOverlay";
import PlayByPlay from "@/components/gamePage/PlayByPlay";
import BoxScoreOverlay from "@/components/gamePage/BoxScoreOverlay";

export default function GamePage() {
  const { gameId } = useRoute().params as { gameId: string }; // Access playerId from route params

  const players = usePlayerStore((state) => state.players);
  const teamId = useTeamStore((state) => state.currentTeamId);
  const team = useTeamStore((state) => state.teams[teamId]);

  const sets = useSetStore((state) => state.sets);
  const setList = Object.values(sets);
  const teamSets = setList.filter((set) => set.teamId === teamId);
  const setIdList = teamSets.map((set) => set.id);

  const navigation = useNavigation();
  const game = useGameStore((state) => state.games[gameId]);
  const activePlayers = game.activePlayers.map((playerId) => players[playerId]);

  const setActiveSets = useGameStore((state) => state.setActiveSets);
  const activeSets = game.activeSets.map((setId) => sets[setId]);

  const deleteGame = useGameStore((state) => state.removeGame);

  const [selectedPlay, setSelectedPlay] = useState<string>("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [showSubstitutions, setShowSubstitutions] = useState(false);
  const [showSets, setShowSets] = useState(false);
  const [showBoxScore, setShowBoxScore] = useState(false);

  const [selectedPlayer, setSelectedPlayer] = useState<string>("");

  useEffect(() => {
    if (activeSets.length === 0) {
      setActiveSets(gameId, setIdList.slice(0, 5));
    }
  });

  //STAT FUNCTIONS
  type StatUpdateType = {
    stats: Stat[];
    gameId: string;
    teamId: string;
    playerId: string;
    setId: string;
  };
  //game stats
  const updateBoxScore = useGameStore((state) => state.updateBoxScore);
  const updateTotals = useGameStore((state) => state.updateTotals);
  const updatePeriods = useGameStore((state) => state.updatePeriods);

  //team stats
  //const updateTeamStats = useTeamStore((state) => state.)

  //player stats
  //const playerstay = usePlayerStore((state) => state.)

  //set stats
  //const setStats = useSetStore((state) => state.)

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
      updatePeriods(gameId, playerId, stats[0], 0, team); //attempt means miss as the above attempts are filtered out
    } else if (stats.length === 1) {
      //regular case for single action
      updatePeriods(gameId, playerId, stats[0], 0, team); //attempt means miss as the above attempts are filtered out
    }

    stats.forEach((stat) => {
      updateBoxScore(gameId, playerId, stat, 1);
      updateTotals(gameId, stat, 1, team);

      switch (stat) {
        case Stat.FreeThrowsMade:
          updateTotals(gameId, Stat.Points, 1, team);
          updateBoxScore(gameId, playerId, Stat.Points, 1);

          break;
        case Stat.TwoPointMakes:
          updateTotals(gameId, Stat.Points, 2, team);
          updateBoxScore(gameId, playerId, Stat.Points, 2);

          break;
        case Stat.ThreePointMakes:
          updateTotals(gameId, Stat.Points, 3, team);
          updateBoxScore(gameId, playerId, Stat.Points, 3);

          break;
      }
    });
  }

  const handlePlayerPress = (playerId: string) => {
    setSelectedPlayer(playerId);
    setShowOverlay(true);
    console.log(game.boxScore);
  };

  const handleStatPress = (category: ActionType, action: string) => {
    console.log("Action Type:", category, "Action Key:", action); // Debugging log

    const stats = StatMapping[category]?.[action];

    if (!stats) {
      console.error("Invalid action:", action);
      return;
    }
    //updatePeriods(gameId, selectedPlayer, category, action);

    handleStatUpdate({
      stats,
      gameId,
      teamId,
      playerId: selectedPlayer,
      setId: selectedPlay,
    });
    handleCloseOverlay();

    //if play has concluded reset the selected play
    if (
      category === ActionType.ShootingMake ||
      category === ActionType.ShootingMiss ||
      stats.includes(Stat.Turnovers)
    ) {
      setSelectedPlay("");
    }
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const handleDeleteGame = () => {
    //need to remove player, team and set stats when a game is deleted
    Alert.alert(`This game will be removed`, "All their stats will be lost", [
      {
        text: "Yes",
        onPress: () => {
          deleteGame(gameId);
          navigation.goBack();
        },
        style: "destructive",
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable hitSlop={20} onPress={handleDeleteGame}>
          <FontAwesome5
            name="trash-alt"
            size={24}
            color={theme.colorOrangePeel}
          />
        </Pressable>
      ),
    });
  });
  return (
    <View style={styles.container}>
      <View style={styles.teamsContainer}>
        <View style={styles.teamBox}>
          <Text style={styles.teamHeading}>{team.name}</Text>
          <Text>{game.statTotals[Team.Us][Stat.Points]}</Text>
        </View>

        <View style={styles.teamBox}>
          <Text style={styles.teamHeading}>{game.opposingTeamName}</Text>
          <Text>{game.statTotals[Team.Opponent][Stat.Points]}</Text>
        </View>
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
          <View style={styles.playByPlayContainer}>
            <PlayByPlay gameId={gameId} period={0}></PlayByPlay>
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
                  <GameButton
                    key={player.id}
                    title={player.name}
                    onPress={() => handlePlayerPress(player.id)}
                  />
                ))}
                <GameButton
                  title="Opponent"
                  onPress={() => handlePlayerPress("Opponent")}
                  opponent={true}
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  teamBox: {
    flex: 1,
    padding: 20,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 2,
  },
  teamHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  playByPlayContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
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
});
