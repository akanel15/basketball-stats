import { useLayoutEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { usePlayerStore } from "@/store/playerStore";

export default function TeamPage() {
  const { playerId } = useRoute().params as { playerId: string }; // Access playerId from route params
  const navigation = useNavigation();
  const players = usePlayerStore((state) => state.players);

  const playerName =
    players.find((player) => player.id === playerId)?.name || "Player";

  useLayoutEffect(() => {
    // Dynamically set the header title as soon as the component is mounted
    navigation.setOptions({ title: playerName });
  }, [navigation, playerName]);

  return (
    <View>
      <Text>Welcome to {playerName} page!</Text>
    </View>
  );
}
