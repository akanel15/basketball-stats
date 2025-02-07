import { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { BaskitballButton } from "@/components/BaskitballButton";
import { useGameStore } from "@/store/gameStore";
import { theme } from "@/theme";
import { useSetStore } from "@/store/setStore";
import { SetType } from "@/types/set";

type SetOverlayProps = {
  gameId: string;
  onClose: () => void;
};

export default function SetOverlay({ gameId, onClose }: SetOverlayProps) {
  const game = useGameStore((state) => state.games[gameId]);

  const sets = useSetStore((state) => state.sets);
  const setList = Object.values(sets);
  const teamSets = setList.filter((set) => set.teamId === game.teamId);

  const setActiveSets = useGameStore((state) => state.setActiveSets);

  const activeSets = game.activeSets.map((setId) => sets[setId]);
  const otherSets = teamSets.filter((sets) => !activeSets.includes(sets));

  const [selectedActive, setSelectedActive] = useState<SetType[]>(activeSets);
  const [selectedBench, setSelectedBench] = useState<SetType[]>(otherSets);

  // Toggle active player selection (remove from active)
  const toggleActiveSet = (set: SetType) => {
    setSelectedActive((prev) => prev.filter((s) => s.id !== set.id));
    setSelectedBench((prev) => [...prev, set]);
  };

  // Toggle bench player selection (add to active)
  const toggleOtherSet = (set: SetType) => {
    if (selectedActive.length < 5) {
      setSelectedActive((prev) => [...prev, set]);
      setSelectedBench((prev) => prev.filter((s) => s.id !== set.id));
    }
  };

  const handleConfirm = () => {
    const activeIds = selectedActive.map((player) => player.id);
    setActiveSets(gameId, activeIds);
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
                style={[styles.playerBox, styles.activeSets]}
                onPress={() => toggleActiveSet(item)}
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
            data={selectedBench}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.playerBox}
                onPress={() => toggleOtherSet(item)}
              >
                <Text style={styles.playerText}>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.rowContainer}>
          <View style={styles.split}>
            <BaskitballButton
              onPress={onClose}
              title="Cancel"
              color={theme.colorOnyx}
            />
          </View>
          <View style={styles.split}>
            <BaskitballButton
              onPress={handleConfirm}
              title="Confirm"
              color={theme.colorBlue}
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
  activeSets: {
    borderColor: theme.colorBlue,
    borderWidth: 2,
  },
  playerText: {
    fontSize: 16,
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
