import { BaskitballButton } from "@/components/BaskitballButton";
import { GameButton } from "@/components/GameButton";
import { useGameStore } from "@/store/gameStore";
import { usePlayerStore } from "@/store/playerStore";
import { useTeamStore } from "@/store/teamStore";
import { ActionType, Stat, StatMapping } from "@/types/stats";
import { useNavigation, useRoute } from "@react-navigation/core";
import { useLayoutEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { theme } from "@/theme";
import { Team } from "@/types/game";
import { SetRadioButton } from "@/components/SetRadioButton";
import { useSetStore } from "@/store/setStore";
import StatOverlay from "@/components/gamePage/StatOverlay";
import SetOverlay from "@/components/gamePage/SetOverlay";
import SubstitutionOverlay from "@/components/gamePage/SubstitutionOverlay";

export default function GamePage() {
  const { gameId } = useRoute().params as { gameId: string }; // Access playerId from route params

  const players = usePlayerStore((state) => state.players);
  const teamId = useTeamStore((state) => state.currentTeamId);
  const team = useTeamStore((state) => state.teams[teamId]);
  const playersList = Object.values(players);
  const teamPlayers = playersList.filter((player) => player.teamId === teamId);

  const sets = useSetStore((state) => state.sets);
  const setList = Object.values(sets);
  const teamSets = setList.filter((set) => set.teamId === teamId);

  const navigation = useNavigation();
  const game = useGameStore((state) => state.games[gameId]);

  const deleteGame = useGameStore((state) => state.removeGame);

  const [selectedPlay, setSelectedPlay] = useState<string>("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [showSubstitutions, setShowSubstitutions] = useState(false);
  const [showSets, setShowSets] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");

  //STAT FUNCTIONS
  type StatUpdateType = {
    stat: Stat;
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
    stat,
    gameId,
    teamId,
    playerId,
    setId,
  }: StatUpdateType) {
    const team = playerId === "Opponent" ? Team.Opponent : Team.Us;

    updateBoxScore(gameId, playerId, stat, 1);
    updateTotals(gameId, stat, 1, team);
    updatePeriods(gameId, playerId, stat, 1, team);

    switch (stat) {
      case Stat.FreeThrowsMade:
        updateTotals(gameId, Stat.Points, 1, team);
        break;
      case Stat.TwoPointMakes:
        updateTotals(gameId, Stat.Points, 2, team);
        break;
      case Stat.ThreePointMakes:
        updateTotals(gameId, Stat.Points, 3, team);
        break;
    }
  }

  const handlePlayerPress = (playerId: string) => {
    setSelectedPlayer(playerId);
    setShowOverlay(true);
  };

  const handleStatPress = (category: ActionType, action: string) => {
    console.log("Action Type:", category, "Action Key:", action); // Debugging log

    const stats = StatMapping[category]?.[action];

    if (!stats) {
      console.error("Invalid action:", action);
      return;
    }

    stats.forEach((stat) => {
      handleStatUpdate({
        stat,
        gameId,
        teamId,
        playerId: selectedPlayer,
        setId: selectedPlay,
      });
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
      ) : showSubstitutions ? (
        <SubstitutionOverlay
          gameId={gameId}
          onClose={() => setShowSubstitutions(false)}
        />
      ) : (
        <View>
          <View style={styles.playByPlayContainer}>
            <Text style={styles.playByPlayHeading}>Play-by-Play Stats</Text>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.section}>
              <Text style={styles.heading}>Sets</Text>
              <View style={styles.rowContainer}>
                {teamSets.slice(0, 5).map((set) => (
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
                {teamPlayers.slice(0, 5).map((player) => (
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
  playByPlayHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bottomSection: {
    justifyContent: "flex-end",
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
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
