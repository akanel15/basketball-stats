import { BaskitballButton } from "@/components/BaskitballButton";
import { GameButton } from "@/components/GameButton";
import { useGameStore } from "@/store/gameStore";
import { usePlayerStore } from "@/store/playerStore";
import { useTeamStore } from "@/store/teamStore";
import {
  Defensive,
  FoulTO,
  RebAst,
  ShootingMakes,
  ShootingMiss,
  Stat,
  StatMapping,
} from "@/types/stats";
import { useNavigation, useRoute } from "@react-navigation/core";
import { useLayoutEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { theme } from "@/theme";
import { Team } from "@/types/game";
import { SetRadioButton } from "@/components/SetRadioButton";
import { useSetStore } from "@/store/setStore";
import { GameStatButton } from "@/components/GameStatButton";

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
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");

  const handlePress = () => {
    //t
  };

  const handlePlayerPress = (playerId: string) => {
    setSelectedPlayer(playerId);
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    handleStatUpdate(
      gameId,
      teamId,
      selectedPlayer,
      selectedPlay,
      ShootingMakes.TwoPointMake,
    );
    StatMapping[action].forEach((stat) => {
      updateTotals(gameId, stat, 1, Team.Us);
      updateBoxScore(gameId, selectedPlayer, stat, 1);
      //update sets
      //update player stats
      //update team stats
    });

    setShowOverlay(false); // Hide overlay when done
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
        <View style={styles.gap}>
          <Text style={styles.heading}>Shooting</Text>
          <View style={styles.rowContainer}>
            {Object.values(ShootingMakes).map((stat) => (
              <GameStatButton
                key={stat}
                title={stat}
                onPress={handleCloseOverlay}
                backgroundColor={theme.colorMindaroGreen}
              />
            ))}
          </View>
          <View style={styles.rowContainer}>
            {Object.values(ShootingMiss).map((stat) => (
              <GameStatButton
                key={stat}
                title={stat}
                onPress={handleCloseOverlay}
                backgroundColor={theme.colorRedCrayola}
              />
            ))}
          </View>
          <Text style={styles.heading}>Assists + Rebs</Text>
          <View style={styles.rowContainer}>
            {Object.values(RebAst).map((stat) => (
              <GameStatButton
                key={stat}
                title={stat}
                onPress={handleCloseOverlay}
                backgroundColor={theme.colorMayaBlue}
              />
            ))}
          </View>
          <Text style={styles.heading}>Defence</Text>
          <View style={styles.rowContainer}>
            {Object.values(Defensive).map((stat) => (
              <GameStatButton
                key={stat}
                title={stat}
                onPress={handleCloseOverlay}
              />
            ))}
          </View>
          <Text style={styles.heading}>Fouls + TOs</Text>
          <View style={styles.rowContainer}>
            {Object.values(FoulTO).map((stat) => (
              <GameStatButton
                key={stat}
                title={stat}
                onPress={handleCloseOverlay}
              />
            ))}
          </View>
          <BaskitballButton onPress={handleCloseOverlay} title="Close" />
        </View>
      ) : (
        <View>
          <View style={styles.playByPlayContainer}>
            <Text style={styles.playByPlayHeading}>Play-by-Play Stats</Text>
          </View>

          <View style={styles.bottomSection}>
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
                  onPress={handlePress}
                  opponent={true}
                />
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.rowContainer}>
                <View style={styles.split}>
                  <BaskitballButton onPress={handlePress} title="Sub Players" />
                </View>
                <View style={styles.split}>
                  <BaskitballButton
                    onPress={handlePress}
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
  gap: {
    marginTop: 10,
  },
});
