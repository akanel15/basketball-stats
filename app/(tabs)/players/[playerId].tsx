import { useLayoutEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { usePlayerStore } from "@/store/playerStore";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { theme } from "@/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { PlayerImage } from "@/components/PlayerImage";
import { Stat } from "@/types/stats";

export default function PlayerPage() {
  const { playerId } = useRoute().params as { playerId: string }; // Access playerId from route params
  const navigation = useNavigation();
  const players = usePlayerStore((state) => state.players);
  const deletePlayer = usePlayerStore((state) => state.removePlayer);

  const player = players[playerId];
  const playerName = player?.name || "Player";
  const firstName =
    playerName.substring(0, playerName.indexOf(" ")) || "Player";

  const handleDeletePlayer = () => {
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
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: playerName,
      headerRight: () => (
        <Pressable hitSlop={20} onPress={handleDeletePlayer}>
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
        <PlayerImage player={player}></PlayerImage>
      </View>
      <Text>{player.stats[Stat.Points]}</Text>
      <Text>{player.stats[Stat.ThreePointMakes]}</Text>
      <Text>{player.stats[Stat.ThreePointAttempts]}</Text>
      <Text>{player.stats[Stat.PlusMinus]}</Text>
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
