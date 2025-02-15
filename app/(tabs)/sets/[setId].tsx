import { useLayoutEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { theme } from "@/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSetStore } from "@/store/setStore";
import { Stat } from "@/types/stats";

export default function SetPage() {
  const { setId } = useRoute().params as { setId: string }; // Access playerId from route params
  const navigation = useNavigation();
  const sets = useSetStore((state) => state.sets);
  const deleteSet = useSetStore((state) => state.removeSet);

  const set = sets[setId];
  const setName = set?.name || "Set";

  const handleDeletePlayer = () => {
    Alert.alert(`${setName} will be removed`, "All stats will be lost", [
      {
        text: "Yes",
        onPress: () => {
          deleteSet(setId);
          navigation.goBack();
        },
        style: "destructive",
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: setName,
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
        <Text>{setName}</Text>
      </View>
      <Text>{set.stats[Stat.Points]}</Text>
      <Text>{set.stats[Stat.ThreePointMakes]}</Text>
      <Text>{set.stats[Stat.ThreePointAttempts]}</Text>
      <Text>{set.stats[Stat.Assists]}</Text>
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
