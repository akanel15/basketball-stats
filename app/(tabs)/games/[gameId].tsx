import { BaskitballButton } from "@/components/BaskitballButton";
import { GameButton } from "@/components/GameButton";
import { useGameStore } from "@/store/gameStore";
import { usePlayerStore } from "@/store/playerStore";
import { useTeamStore } from "@/store/teamStore";
import { Stat } from "@/types/stats";
import { useNavigation, useRoute } from "@react-navigation/core";
import { useLayoutEffect } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { theme } from "@/theme";

export default function GamePage() {
  const { gameId } = useRoute().params as { gameId: string }; // Access playerId from route params

  //Player Selection
  //const playerList
  const players = usePlayerStore((state) => state.players);
  const teamId = useTeamStore((state) => state.currentTeamId);
  const playersList = Object.values(players);
  const teamPlayers = playersList.filter((player) => player.teamId === teamId);
  const navigation = useNavigation();

  const deleteGame = useGameStore((state) => state.removeGame);
  const handleStatUpdate = useGameStore((state) => state.handleStatUpdate);

  const handlePress = () => {
    handleStatUpdate(gameId, teamPlayers[0].id, Stat.Points, 3);
    handleStatUpdate(gameId, teamPlayers[0].id, Stat.ThreePointAttempts, 3);
    handleStatUpdate(gameId, teamPlayers[0].id, Stat.ThreePointMakes, 3);
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
          <Text style={styles.teamHeading}>Blackburn Vikings</Text>
          {/* Add more team details here */}
        </View>

        {/* Team 2 */}
        <View style={styles.teamBox}>
          <Text style={styles.teamHeading}>Diamond Valley Eagles</Text>
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
            <GameButton onPress={handlePress} title="Alex Kanellis" />
            <GameButton onPress={handlePress} title="Alex Kanellis" />
            <GameButton onPress={handlePress} title="Alex Kanellis" />
          </View>
          <View style={styles.rowContainer}>
            <GameButton onPress={handlePress} title="Alex Kanellis" />
            <GameButton onPress={handlePress} title="Alex Kanellis" />
            <GameButton onPress={handlePress} title="Alex Kanellis" />
          </View>
        </View>

        {/* Players Section */}
        <View style={styles.section}>
          <Text style={styles.heading}>Players</Text>
          <View style={styles.rowContainer}>
            <GameButton onPress={handlePress} title="Player 1" />
            <GameButton onPress={handlePress} title="Player 2" />
            <GameButton onPress={handlePress} title="Player 3" />
          </View>
          <View style={styles.rowContainer}>
            <GameButton onPress={handlePress} title="Player 4" />
            <GameButton onPress={handlePress} title="Player 5" />
            <GameButton onPress={handlePress} title="Player 6" />
          </View>
        </View>

        {/* Substitution Button */}
        <View style={styles.section}>
          <BaskitballButton onPress={handlePress} title="Sub" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
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
    justifyContent: "center",
    gap: 6,
    marginBottom: 6,
  },
});
