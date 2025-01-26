import { StyleSheet, View, Text, Pressable } from "react-native";
import { theme } from "@/theme";
import { TeamType, useTeamStore } from "@/store/teamStore";
import { BaskitballImage } from "./BaskitballImage";
import { Link } from "expo-router";

export function TeamCard({ team }: { team: TeamType }) {
  const updateTeamId = useTeamStore((state) => state.setCurrentTeamId);

  const handlePress = () => {
    updateTeamId(team.id);
  };

  return (
    <Link href={`/${team.id}`} asChild>
      <Pressable style={styles.teamCard} onPress={handlePress}>
        <BaskitballImage size={80} imageUri={team.imageUri} />

        <View style={styles.details}>
          <Text numberOfLines={1} style={styles.teamName}>
            {team.name}
          </Text>
          <Text style={styles.subtitle}>Click to see more</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  teamCard: {
    flexDirection: "row",
    shadowColor: theme.colorBlack,
    backgroundColor: theme.colorWhite,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  details: {
    padding: 14,
    justifyContent: "center",
  },
  teamName: {
    fontSize: 18,
    marginBottom: 4,
  },
  subtitle: {
    color: theme.colorGrey,
  },
});
