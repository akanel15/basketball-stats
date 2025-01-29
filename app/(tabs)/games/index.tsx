import { BaskitballButton } from "@/components/BaskitballButton";
import { GameCard } from "@/components/GameCard";
import { useGameStore } from "@/store/gameStore";
import { theme } from "@/theme";
import { router } from "expo-router";
import { FlatList, StyleSheet } from "react-native";

export default function Games() {
  const games = useGameStore((state) => state.games);
  const gameList = Object.values(games);
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={gameList}
      renderItem={({ item }) => <GameCard game={item}></GameCard>}
      ListEmptyComponent={
        <BaskitballButton
          title="Add your first Game"
          onPress={() => router.navigate("/games/newGame")}
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
