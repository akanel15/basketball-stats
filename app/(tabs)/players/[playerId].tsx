import { useCallback, useLayoutEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Alert, Pressable, Text, View } from "react-native";
import { usePlayerStore } from "@/store/playerStore";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { theme } from "@/theme";

export default function TeamPage() {
  const { playerId } = useRoute().params as { playerId: string }; // Access playerId from route params
  const navigation = useNavigation();
  const players = usePlayerStore((state) => state.players);
  const deletePlayer = usePlayerStore((state) => state.removePlayer);

  const playerName =
    players.find((player) => player.id === playerId)?.name || "Player";
  const firstName = playerName.substring(0, playerName.indexOf(" "));

  const handleDeletePlayer = useCallback(() => {
    Alert.alert(
      `${firstName} will be removed`,
      "All their stats will be lost",
      [
        {
          text: "Yes",
          onPress: () => {
            deletePlayer(playerId);
            navigation.goBack();
          },
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  }, [firstName, playerId, deletePlayer, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: playerName,
      headerRight: () => (
        <Pressable hitSlop={20} onPress={handleDeletePlayer}>
          <FontAwesome5 name="trash-alt" size={24} color={theme.colorOnyx} />
        </Pressable>
      ),
    });
  }, [navigation, playerName, handleDeletePlayer]);

  return (
    <View>
      <Text>Welcome to {playerName}'s custom page!</Text>
    </View>
  );
}
