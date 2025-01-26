import { BaskitballButton } from "@/components/BaskitballButton";
import { BaskitballImage } from "@/components/BaskitballImage";
import { useTeamStore } from "@/store/teamStore";
import { theme } from "@/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";

export default function NewTeam() {
  const addTeam = useTeamStore((state) => state.addTeam);
  const router = useRouter();
  const [teamName, setTeamName] = useState<string>();
  const [imageUri, setImageUri] = useState<string>();

  const handleSubmit = () => {
    if (!teamName) {
      return Alert.alert("Validation Error", "Please give the team a name");
    }
    addTeam(teamName, imageUri);

    //naviate to team page set up players
    router.back();
  };

  const handleTeamLogoSelection = async () => {
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
        onPress={handleTeamLogoSelection}
      >
        <BaskitballImage imageUri={imageUri}></BaskitballImage>
      </TouchableOpacity>
      <Text style={styles.header}>Team Name</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="words"
        placeholder="Blackburn Vikings"
        onChangeText={(newTeamName) => setTeamName(newTeamName)}
      ></TextInput>

      <BaskitballButton
        title="Create Team"
        onPress={handleSubmit}
      ></BaskitballButton>
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
