import { useLayoutEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useTeamStore } from "@/store/teamStore";
import { Text, View } from "react-native";

export default function TeamPage() {
  const { playerId } = useRoute().params as { playerId: string }; // Access playerId from route params
  const navigation = useNavigation();
  const teams = useTeamStore((state) => state.teams);

  const teamName = teams.find((team) => team.id === playerId)?.name || "Team";

  useLayoutEffect(() => {
    // Dynamically set the header title as soon as the component is mounted
    navigation.setOptions({ title: teamName });
  }, [navigation, teamName]);

  return (
    <View>
      <Text>Welcome to {teamName} page!</Text>
    </View>
  );
}
