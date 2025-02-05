import { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { BaskitballButton } from "@/components/BaskitballButton";
import { useGameStore } from "@/store/gameStore";
import { usePlayerStore } from "@/store/playerStore";
import { theme } from "@/theme";
import { PlayerType } from "@/types/player";

type SubstitutionOverlayProps = {
  gameId: string;
  onClose: () => void;
};

export default function SetOverlay({
  gameId,
  onClose,
}: SubstitutionOverlayProps) {
  const game = useGameStore((state) => state.games[gameId]);

  const players = usePlayerStore((state) => state.players);
  const playersList = Object.values(players);
  const teamPlayers = playersList.filter(
    (player) => player.teamId === game.teamId,
  );

  const setActivePlayers = useGameStore((state) => state.setActivePlayers);

  const activePlayers = game.activePlayers.map((playerId) => players[playerId]);
  const benchPlayers = teamPlayers.filter(
    (player) => !activePlayers.some((ap) => ap.id === player.id),
  );

  const [selectedActive, setSelectedActive] =
    useState<PlayerType[]>(activePlayers);
  const [, setSelectedBench] = useState<PlayerType[]>([]);

  // Toggle active player selection (remove from active)
  const toggleActivePlayer = (player: PlayerType) => {
    setSelectedActive((prev) => prev.filter((p) => p.id !== player.id));
  };

  // Toggle bench player selection (add to active)
  const toggleBenchPlayer = (player: PlayerType) => {
    if (selectedActive.length < 5) {
      setSelectedActive((prev) => [...prev, player]);
      setSelectedBench((prev) => prev.filter((p) => p.id !== player.id));
    }
  };

  const handleConfirm = () => {
    const activeIds = selectedActive.map((player) => player.id);
    setActivePlayers(gameId, activeIds);
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <Text style={styles.title}>Substitutions</Text>

      <View style={styles.container}>
        {/* Active Players */}
        <View style={styles.column}>
          <Text style={styles.subHeading}>Active Players</Text>
          <FlatList
            data={selectedActive}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.playerBox, styles.activePlayer]}
                onPress={() => toggleActivePlayer(item)}
              >
                <Text style={styles.playerText}>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>

        {/* Grey Divider */}
        <View style={styles.divider} />

        {/* Bench Players */}
        <View style={styles.column}>
          <Text style={styles.subHeading}>Bench</Text>
          <FlatList
            data={benchPlayers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.playerBox}
                onPress={() => toggleBenchPlayer(item)}
              >
                <Text style={styles.playerText}>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>
      </View>

      {/* Confirm Button */}
      <BaskitballButton
        onPress={handleConfirm}
        title="Confirm Changes"
        color={theme.colorBlue}
      />
      <BaskitballButton onPress={onClose} title="Cancel" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    padding: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flexDirection: "row",
    flex: 1,
    marginVertical: 20,
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  divider: {
    width: 2,
    backgroundColor: theme.colorLightGrey,
  },
  playerBox: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: theme.colorLightGrey,
    width: "90%",
    alignItems: "center",
  },
  activePlayer: {
    borderColor: theme.colorOrangePeel,
    borderWidth: 2,
  },
  playerText: {
    fontSize: 16,
  },
});
