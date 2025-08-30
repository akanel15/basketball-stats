import { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { BaskitballButton } from "@/components/BaskitballButton";
import { useGameStore } from "@/store/gameStore";
import { usePlayerStore } from "@/store/playerStore";
import { theme } from "@/theme";
import { PlayerType } from "@/types/player";
import { PlayerImage } from "../PlayerImage";

type SubstitutionOverlayProps = {
  gameId: string;
  onClose: () => void;
};

export default function SubstitutionOverlay({ gameId, onClose }: SubstitutionOverlayProps) {
  const game = useGameStore(state => state.games[gameId]);
  const addPlayerToGamePlayed = useGameStore(state => state.addPlayersToGamePlayedList);

  const players = usePlayerStore(state => state.players);
  const playersList = Object.values(players);
  const teamPlayers = playersList.filter(player => player.teamId === game.teamId);

  const setActivePlayers = useGameStore(state => state.setActivePlayers);

  const activePlayers = game.activePlayers
    .map(playerId => players[playerId])
    .filter(player => player !== undefined); // Filter out undefined players
  const benchPlayers = teamPlayers.filter(player => !activePlayers.includes(player));

  const [selectedActive, setSelectedActive] = useState<PlayerType[]>(activePlayers);
  const [selectedBench, setSelectedBench] = useState<PlayerType[]>(benchPlayers);

  // Toggle active player selection (remove from active)
  const toggleActivePlayer = (player: PlayerType) => {
    setSelectedActive(prev => prev.filter(p => p.id !== player.id));
    setSelectedBench(prev => [...prev, player]);
  };

  // Toggle bench player selection (add to active)
  const toggleBenchPlayer = (player: PlayerType) => {
    if (selectedActive.length < 5) {
      setSelectedActive(prev => [...prev, player]);
      setSelectedBench(prev => prev.filter(p => p.id !== player.id));
    }
  };

  const handleConfirm = () => {
    const activeIds = selectedActive.map(player => player.id);
    addPlayerToGamePlayed(gameId, activeIds);
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
            data={selectedActive.sort((a, b) => a.number - b.number)}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.playerBox, styles.activePlayer]}
                onPress={() => toggleActivePlayer(item)}
              >
                <View style={styles.rowCard}>
                  <PlayerImage player={item} size={50}></PlayerImage>
                  <Text style={styles.playerText}>{item.name}</Text>
                </View>
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
            data={selectedBench.sort((a, b) => a.number - b.number)}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Pressable style={styles.playerBox} onPress={() => toggleBenchPlayer(item)}>
                <View style={styles.rowCard}>
                  <PlayerImage player={item} size={50}></PlayerImage>
                  <Text style={styles.playerText}>{item.name}</Text>
                </View>
              </Pressable>
            )}
          />
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.rowContainer}>
          <View style={styles.split}>
            <BaskitballButton onPress={onClose} title="Cancel" color={theme.colorOnyx} />
          </View>
          <View style={styles.split}>
            <BaskitballButton
              onPress={handleConfirm}
              title="Confirm"
              color={theme.colorOrangePeel}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    padding: 10,
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
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 50,
    paddingHorizontal: 10,
    width: 160,
  },
  playerText: {
    fontSize: 16,
    flexShrink: 1,
    flexWrap: "wrap",
    marginLeft: 8,
    textAlign: "left",
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  divider: {
    width: 2,
    backgroundColor: theme.colorLightGrey,
  },
  playerBox: {
    padding: 8,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: theme.colorLightGrey,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    minWidth: 160,
    maxWidth: 160,
  },
  activePlayer: {
    borderColor: theme.colorOrangePeel,
    borderWidth: 2,
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
  section: {
    marginBottom: 10,
  },
});
