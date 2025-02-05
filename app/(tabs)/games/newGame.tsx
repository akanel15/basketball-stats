import { BaskitballButton } from "@/components/BaskitballButton";
import { theme } from "@/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTeamStore } from "@/store/teamStore";
import { useGameStore } from "@/store/gameStore";
import { usePlayerStore } from "@/store/playerStore";

export default function NewGame() {
  const addGame = useGameStore((state) => state.addGame);
  const teamId = useTeamStore((state) => state.currentTeamId);
  const players = usePlayerStore((state) => state.players);
  const playersList = Object.values(players);
  const teamPlayers = playersList.filter((player) => player.teamId === teamId);

  const router = useRouter();
  const [opponentName, setOpponentName] = useState<string>();

  const handleSubmit = () => {
    if (!opponentName) {
      return Alert.alert("Validation Error", "Please enter opponent name");
    } else if (teamPlayers.length === 0) {
      return Alert.alert(
        "Validation Error",
        "Add players before creating a game",
        [
          {
            text: "Go",
            onPress: () => {
              router.navigate("/players");
            },
            style: "default",
          },
        ],
      );
    }

    addGame(teamId, opponentName);
    router.replace(`/games`);
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.header}>Opponent Name</Text>
      <TextInput
        style={styles.input}
        keyboardType="default"
        autoCapitalize="words"
        placeholder="LA Lakers"
        onChangeText={(newOpponentName) => setOpponentName(newOpponentName)}
      ></TextInput>

      <BaskitballButton
        title="Start Game"
        onPress={handleSubmit}
      ></BaskitballButton>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  contentContainer: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  header: {
    color: theme.colorOnyx,
    fontSize: 24,
    marginBottom: 8,
  },
  input: {
    color: theme.colorOnyx,
    fontSize: 24,
    marginBottom: 24,
    borderColor: theme.colorLightGrey,
    borderWidth: 2,
    padding: 12,
  },
});
