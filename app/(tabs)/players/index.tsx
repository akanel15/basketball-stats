import { PlayerCard } from "@/components/PlayerCard";
import { theme } from "@/theme";
import { router } from "expo-router";
import { FlatList, StyleSheet } from "react-native";
import { BaskitballButton } from "@/components/BaskitballButton";
import { usePlayerStore } from "@/store/playerStore";

export default function App() {
  const players = usePlayerStore((state) => state.players);
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={players}
      renderItem={({ item }) => <PlayerCard player={item}></PlayerCard>}
      ListEmptyComponent={
        <BaskitballButton
          title="Add your first Player"
          onPress={() => router.navigate("/players/newPlayer")}
        ></BaskitballButton>
      }
    ></FlatList>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  contentContainer: {
    padding: 12,
    shadowColor: theme.colorBlack,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
