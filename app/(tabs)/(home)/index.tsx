import { TeamCard } from "@/components/TeamCard";
import { theme } from "@/theme";
import { router } from "expo-router";
import { FlatList, StyleSheet } from "react-native";
import { BaskitballButton } from "@/components/BaskitballButton";
import { useTeamStore } from "@/store/teamStore";

export default function App() {
  const team = useTeamStore((state) => state.teams);
  // const teams = [
  //   {
  //     id: "1",
  //     name: "Blackburn Vikings",
  //     playerList: [],
  //   },
  //   {
  //     id: "2",
  //     name: "Nunnawading",
  //     playerList: [],
  //   },
  //   {
  //     id: "3",
  //     name: "Sherbrooke",
  //     playerList: [],
  //   },
  // ];
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={team}
      renderItem={({ item }) => <TeamCard team={item}></TeamCard>}
      ListEmptyComponent={
        <BaskitballButton
          title="Add your first team"
          onPress={() => router.navigate("/newTeam")}
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
