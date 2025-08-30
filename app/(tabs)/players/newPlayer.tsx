import { BaskitballButton } from "@/components/BaskitballButton";
import { BaskitballImage } from "@/components/BaskitballImage";
import { usePlayerStore } from "@/store/playerStore";
import { theme } from "@/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { useTeamStore } from "@/store/teamStore";

export default function NewPlayer() {
  const addPlayer = usePlayerStore(state => state.addPlayer);
  const teamId = useTeamStore(state => state.currentTeamId);
  const router = useRouter();
  const [playerName, setPlayerName] = useState<string>();
  const [playerNumber, setPlayerNumber] = useState<number>();
  const [imageUri, setImageUri] = useState<string>();

  const handleSubmit = () => {
    if (!playerName) {
      return Alert.alert("Validation Error", "Please give the player a name");
    }
    if (playerNumber === undefined || playerNumber === null) {
      return Alert.alert("Validation Error", "Please give the player a number");
    }
    addPlayer(playerName, playerNumber, teamId, imageUri);

    //naviate to player page set up players
    router.back();
  };

  const handlePlayerImageSelection = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
    return result;
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.contentContainer}
    >
      <TouchableOpacity
        style={styles.centered}
        activeOpacity={0.6}
        onPress={handlePlayerImageSelection}
      >
        <View style={styles.imageContainer}>
          <BaskitballImage imageUri={imageUri}></BaskitballImage>
          <View style={styles.photoOverlay}>
            <Ionicons
              name={imageUri ? "camera" : "add-circle"}
              size={32}
              color={theme.colorWhite}
            />
            <Text style={styles.photoText}>{imageUri ? "Change Photo" : "Add Photo"}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Text style={styles.header}>Player Name</Text>
      <TextInput
        style={styles.input}
        keyboardType="default"
        autoCapitalize="words"
        placeholder="Lebron James"
        onChangeText={newPlayerName => setPlayerName(newPlayerName)}
      ></TextInput>
      <Text style={styles.header}>Player Number</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="0"
        onChangeText={newPlayerNumber => setPlayerNumber(parseInt(newPlayerNumber))}
      ></TextInput>

      <BaskitballButton title="Add Player" onPress={handleSubmit}></BaskitballButton>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  contentContainer: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  centered: { alignItems: "center", marginBottom: 24 },
  imageContainer: {
    position: "relative",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  photoText: {
    color: theme.colorWhite,
    fontSize: 12,
    fontWeight: "600",
  },
  header: {
    color: theme.colorOnyx,
    fontSize: 24,
    marginBottom: 8,
  },
  input: {
    color: theme.colorOnyx,
    fontSize: 24,
    marginBottom: 24,
    borderColor: theme.colorLightGrey,
    borderWidth: 2,
    padding: 12,
  },
});
