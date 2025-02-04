import { BaskitballButton } from "@/components/BaskitballButton";
import { GameButton } from "@/components/GameButton";
import { useGameStore } from "@/store/gameStore";
import { usePlayerStore } from "@/store/playerStore";
import { useTeamStore } from "@/store/teamStore";
import { Stat } from "@/types/stats";
import { useNavigation, useRoute } from "@react-navigation/core";
import { useLayoutEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { theme } from "@/theme";
import { Team } from "@/types/game";
import { SetRadioButton } from "@/components/SetRadioButton";
import { useSetStore } from "@/store/setStore";

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
  const updateBoxScore = useGameStore((state) => state.updateBoxScore);
  const updateTotals = useGameStore((state) => state.updateTotals);

  const [selectedPlay, setSelectedPlay] = useState<string>();

  const handlePress = () => {
    updateTotals(gameId, Stat.Points, 3, Team.Us);
    updateBoxScore(gameId, teamPlayers[0].id, Stat.Points, 3);
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
      {/* Top Section - Team Information */}
      <View style={styles.teamsContainer}>
        {/* Team 1 */}
        <View style={styles.teamBox}>
          <Text style={styles.teamHeading}>{team.name}</Text>
          <Text>{game.statTotals[Team.Us][Stat.Points]}</Text>
          {/* Add more team details here */}
        </View>

        {/* Team 2 */}
        <View style={styles.teamBox}>
          <Text style={styles.teamHeading}>{game.opposingTeamName}</Text>
          <Text>{game.statTotals[Team.Opponent][Stat.Points]}</Text>
          {/* Add more team details here */}
        </View>
      </View>

      {/* Middle Section - Play-by-Play Stats */}
      <View style={styles.playByPlayContainer}>
        <Text style={styles.playByPlayHeading}>Play-by-Play Stats</Text>
        {/* Play-by-play stats content goes here */}
      </View>

      {/* Bottom Section - Sets & Players */}
      <View style={styles.bottomSection}>
        {/* Sets Section */}
        <View style={styles.section}>
          <Text style={styles.heading}>Sets</Text>
          <View style={styles.rowContainer}>
            {teamSets.slice(0, 6).map((set) => (
              <SetRadioButton
                key={set.id}
                title={set.name}
                selected={selectedPlay === set.id}
                onPress={() => setSelectedPlay(set.id)}
              />
            ))}
          </View>
        </View>

        {/* Players Section */}
        <View style={styles.section}>
          <Text style={styles.heading}>Players</Text>
          <View style={styles.rowContainer}>
            {teamPlayers.slice(0, 5).map((player) => (
              <GameButton
                key={player.id}
                title={player.name}
                onPress={() => handlePress()}
              />
            ))}
            <GameButton title="Opponent" onPress={() => handlePress()} />
          </View>
        </View>

        {/* Substitution Button */}
        <View style={styles.section}>
          <View style={styles.rowContainer}>
            <BaskitballButton onPress={handlePress} title="Sub Players" />
            <BaskitballButton onPress={handlePress} title="Change Set" />
          </View>
        </View>
      </View>
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
});
