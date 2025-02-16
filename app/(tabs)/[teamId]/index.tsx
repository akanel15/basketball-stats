import { useLayoutEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useTeamStore } from "@/store/teamStore";
import { theme } from "@/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BaskitballImage } from "@/components/BaskitballImage";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Stat } from "@/types/stats";
import { Team } from "@/types/game";

export default function TeamPage() {
  const { teamId } = useRoute().params as { teamId: string }; // Access teamId from route params
  const navigation = useNavigation();
  const teams = useTeamStore((state) => state.teams);
  const deleteTeam = useTeamStore((state) => state.removeTeam);

  const team = teams[teamId];
  const teamName = team?.name || "Team";

  const handleDeleteTeam = () => {
    Alert.alert(`${teamName} will be removed`, "All their stats will be lost", [
      {
        text: "Yes",
        onPress: () => {
          deleteTeam(teamId);
          navigation.goBack();
        },
        style: "destructive",
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSwapTeam = () => {
    navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: teamName,
      headerLeft: () => (
        <Pressable hitSlop={20} onPress={handleSwapTeam}>
          <FontAwesome6
            name="arrows-rotate"
            size={24}
            color={theme.colorOrangePeel}
          />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable hitSlop={20} onPress={handleDeleteTeam}>
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
    <KeyboardAwareScrollView style={styles.container}>
      <View style={[styles.centered, styles.topBanner]}>
        <BaskitballImage imageUri={team?.imageUri}></BaskitballImage>
      </View>
      <Text>{team.stats[Team.Us][Stat.Points]}</Text>
      <Text>{team.stats[Team.Us][Stat.ThreePointMakes]}</Text>
      <Text>{team.stats[Team.Us][Stat.ThreePointAttempts]}</Text>
      <Text>{team.stats[Team.Us][Stat.PlusMinus]}</Text>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  centered: {
    alignItems: "center",
    marginBottom: 24,
    padding: 24,
  },
  topBanner: {
    backgroundColor: theme.colorOnyx,
  },
});
