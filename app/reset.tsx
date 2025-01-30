// import { TeamCard } from "@/components/TeamCard";
// import { theme } from "@/theme";
// import { FlatList, StyleSheet } from "react-native";
// import { BaskitballButton } from "@/components/BaskitballButton";
// import { useGameStore } from "@/store/gameStore";

// export default function App() {
//   const initialStoreState = {
//     games: {}, // Empty games object
//   };
//   const handlePress = () => {
//     useGameStore.setState(initialStoreState);
//   };

//   return (
//     <FlatList
//       style={styles.container}
//       contentContainerStyle={styles.contentContainer}
//       data={[]}
//       renderItem={({ item }) => <TeamCard team={item}></TeamCard>}
//       ListEmptyComponent={
//         <BaskitballButton
//           title="reset game store"
//           onPress={handlePress}
//         ></BaskitballButton>
//       }
//     ></FlatList>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colorWhite,
//   },
//   contentContainer: {
//     padding: 12,
//     shadowColor: theme.colorBlack,
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,

//     elevation: 5,
//   },
// });
